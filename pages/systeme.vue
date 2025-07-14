<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, computed, watch, nextTick } from "vue"; // watch hinzugefügt
import { useCylinderStore } from "@/stores/cylinderStores.js";
import cylinderModels from "@/data/cylinderModels.js";
import {
  mapOptionToUpchargeKey,
  mapTypToModelKey,
} from "@/data/utils/optionMapping.js";

const route = useRoute();
const router = useRouter();
const anlageNr = route.query.anlageNr || "";
const isSchliessanlage = route.query.isSchliessanlage === "true";
const store = useCylinderStore();
const selectedModel = computed(() => store.selectedModel);
const positionData = ref([]);
const matrix = ref([]);
const totalGlobalKeys = ref(0);
const offers = ref([]);
const schluesselData = ref([]);
const selectedSort = ref("priceAsc");

const isSummaryModalOpen = ref(false);
const isInfoModalOpen = ref(false);
const isSuccessModalOpen = ref(false);

const selectedOffer = ref(null);
const hasAcceptedWiderruf = ref(false);
const hasMeasuredCorrectly = ref(false);
const hasAcceptedLieferzeiten = ref(false);
const hoverWiderruf = ref(false);
const hoverLieferzeit = ref(false);

// NEU: Refs für die Fehlermeldung und deren Text
const showRequirementError = ref(false);
const requirementErrorText = ref("");
// const requirementErrorTimeout = ref(null); // Optional, falls du einen Timeout zum Ausblenden nutzen willst

const navigateBack = () => {
  router.push({
    name: "index",
    query: { anlageNr: anlageNr },
  });
};

function roundPrice(price) {
  return price.toFixed(2);
}

function openSummary(offer) {
  selectedOffer.value = offer;
  hasAcceptedWiderruf.value = false;
  hasMeasuredCorrectly.value = false;
  hasAcceptedLieferzeiten.value = false;
  showRequirementError.value = false;
  isSummaryModalOpen.value = true;

  nextTick(() => {
    if (isSummaryModalOpen.value && window.self !== window.top) {
      // Prüfen, ob in iFrame
      // Wähle ein Element, das sich zuverlässig am Anfang deiner Seite befindet.
      // Das könnte die erste h2-Überschrift oder der .filters-container sein.
      const pageTopElement =
        document.querySelector(".systeme-page > h2:first-of-type") ||
        document.querySelector(".filters-container") ||
        document.body; // Fallback

      if (pageTopElement) {
        // Scrolle dieses Element an den Anfang des sichtbaren Bereichs des iFrames.
        pageTopElement.scrollIntoView({ behavior: "auto", block: "start" });
      } else {
        // Sollte nicht passieren, aber als letzte Instanz die alten Methoden versuchen.
        console.warn(
          "Kein geeignetes Element am Seitenanfang für scrollIntoView gefunden."
        );
        // if (document.documentElement) document.documentElement.scrollTop = 0;
        // if (document.body) document.body.scrollTop = 0;
        // const nuxtAppRoot = document.getElementById('__nuxt');
        // if (nuxtAppRoot && nuxtAppRoot.scrollTop !== undefined) nuxtAppRoot.scrollTop = 0;
      }
    }
  });
}

function openInfo(offer) {
  selectedOffer.value = offer;
  isInfoModalOpen.value = true;

  nextTick(() => {
    if (isInfoModalOpen.value && window.self !== window.top) {
      const pageTopElement =
        document.querySelector(".systeme-page > h2:first-of-type") ||
        document.querySelector(".filters-container") ||
        document.body;
      if (pageTopElement) {
        pageTopElement.scrollIntoView({ behavior: "auto", block: "start" });
      } else {
        console.warn(
          "Kein geeignetes Element am Seitenanfang für scrollIntoView im InfoModal gefunden."
        );
      }
    }
  });
}

// Umbenannt von confirmPurchase zu performActualPurchase, wird aufgerufen, wenn alle Checks ok sind.
async function performActualPurchase() {
  const offer = selectedOffer.value;
  if (!offer) {
    console.error("Kein Angebot ausgewählt für den Kauf.");
    // Hier könnte man auch eine Fehlermeldung für den Nutzer setzen:
    // requirementErrorText.value = "Ein interner Fehler ist aufgetreten. Bitte versuchen Sie es erneut.";
    // showRequirementError.value = true;
    return;
  }
  await addToCart(offer.title, offer.price, offer.productID);
}

const allRequiredChecked = computed(() => {
  return (
    hasAcceptedWiderruf.value &&
    hasMeasuredCorrectly.value &&
    hasAcceptedLieferzeiten.value
  );
});

function goToCart() {
  window.open("https://www.stt-shop.de/warenkorb/", "_blank");
  isSuccessModalOpen.value = false; // Modal danach schließen
}

// NEU: Funktion, die vom Kaufen-Button aufgerufen wird
function handlePurchaseClick() {
  // Optional: Bestehenden Timeout löschen, falls verwendet
  // if (requirementErrorTimeout.value) {
  //   clearTimeout(requirementErrorTimeout.value);
  // }

  if (allRequiredChecked.value) {
    // Hier wird das computed property .value geprüft
    showRequirementError.value = false; // Fehlermeldung ausblenden, falls sie sichtbar war
    performActualPurchase();
  } else {
    requirementErrorText.value =
      "Bitte bestätigen Sie alle Hinweise, um fortzufahren.";
    showRequirementError.value = true;

    // Versuch, zum ersten nicht angehakten Element oder der Sektion zu scrollen
    let targetElementId = null;
    if (!hasAcceptedWiderruf.value) {
      // Du müsstest den Labels IDs geben, z.B. id="widerruf-label"
      targetElementId = "widerruf-checkbox-label"; // Beispiel-ID
    } else if (!hasAcceptedLieferzeiten.value) {
      targetElementId = "lieferzeiten-checkbox-label"; // Beispiel-ID
    } else if (!hasMeasuredCorrectly.value) {
      targetElementId = "gemessen-checkbox-label"; // Beispiel-ID
    }

    let elementToScrollTo = null;
    if (targetElementId) {
      // Versuche zuerst, ein spezifisches Label anhand einer ID zu finden
      // Gib hierfür deinen Labels entsprechende IDs, z.B.
      // <label id="widerruf-checkbox-label" class="widerruf-label">...</label>
      // elementToScrollTo = document.getElementById(targetElementId);

      // Als Fallback oder wenn IDs nicht verwendet werden, scrolle zum allgemeinen Bereich
      // Diese Selektoren müssen ggf. an deine exakte HTML-Struktur angepasst werden.
      if (!hasAcceptedWiderruf.value)
        elementToScrollTo = document.querySelector(
          ".widerruf-label:nth-of-type(1)"
        );
      else if (!hasAcceptedLieferzeiten.value)
        elementToScrollTo = document.querySelector(
          ".widerruf-label:nth-of-type(2)"
        );
      else if (!hasMeasuredCorrectly.value)
        elementToScrollTo = document.querySelector(
          ".widerruf-label:nth-of-type(3)"
        );
    }

    if (!elementToScrollTo) {
      // Fallback, falls kein spezifisches Label gefunden wurde
      elementToScrollTo = document.querySelector(".required-checks h2");
    }

    if (elementToScrollTo) {
      elementToScrollTo.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Optional: Fehlermeldung nach einiger Zeit automatisch ausblenden
    // requirementErrorTimeout.value = setTimeout(() => {
    //   showRequirementError.value = false;
    // }, 7000); // Nach 7 Sekunden
  }
}

// NEU: Watcher, um die Fehlermeldung auszublenden, sobald alle Checkboxen angehakt sind.
watch(allRequiredChecked, (isNowChecked) => {
  if (isNowChecked && showRequirementError.value) {
    showRequirementError.value = false;
  }
});

// --- Der Rest deines Skripts bleibt hier unverändert ---
// generateConfigurationText, calculatePriceForModel, etc.

function getPositionsForKey(keyPos) {
  return positionData.value
    .filter((pos) => matrixCheck(pos.POS, keyPos))
    .map((pos) => `Pos. ${pos.POS}`)
    .join(", ");
}

function modelCanHandleAllZylinders(modelName, positionArray) {
  const modelConfig = cylinderModels[modelName];
  if (!modelConfig) return false;

  for (const zylinder of positionArray) {
    if (!checkZylinderCompatibility(modelName, zylinder)) {
      return false;
    }
  }
  return true;
}

function checkZylinderCompatibility(modelName, zylinderItem) {
  const modelConfig = cylinderModels[modelName];
  if (!modelConfig) return false;

  const typeKey = mapTypToModelKey(zylinderItem.Typ);
  if (!modelConfig[typeKey]) {
    return false;
  }

  const foundSize = modelConfig[typeKey].sizes.find(
    (sz) =>
      Number(sz.inside) === Number(zylinderItem.SizeI) &&
      Number(sz.outside) === Number(zylinderItem.SizeA)
  );
  if (!foundSize) {
    return false;
  }

  const validOptions = modelConfig[typeKey].options || [];
  const selectedOptions = (zylinderItem.Option || "")
    .split(",")
    .map((s) => s.trim())
    .filter((o) => o);

  for (const opt of selectedOptions) {
    if (!validOptions.includes(opt)) {
      return false;
    }
  }

  return true;
}

function generateConfigurationText() {
  let lines = [];
  lines.push("<br>");
  positionData.value.forEach((pos) => {
    const name =
      pos.Bezeichnung && pos.Bezeichnung.trim() !== ""
        ? pos.Bezeichnung
        : `Tür ${pos.POS}`;
    const type = pos.Typ || "Unbekannter Typ";
    const sizes = `${pos.SizeA} / ${pos.SizeI}`;
    const anzahl = pos.Anzahl || 1;
    const option = pos.Option || "";
    lines.push(
      `-<b> ${name}</b> (Typ: ${type}, Größe: ${sizes}, Anzahl: ${anzahl}, Optionen: ${option})<br>`
    );
  });
  lines.push("<br>");
  schluesselData.value.forEach((keyItem) => {
    const keyName =
      keyItem.Bezeichnung && keyItem.Bezeichnung.trim() !== ""
        ? keyItem.Bezeichnung
        : `Schlüssel ${keyItem.KeyPOS}`;
    const positions = getPositionsForKey(keyItem.KeyPOS);
    lines.push(`-<b> ${keyName}</b> schließt: ${positions}<br>`);
  });
  lines.push("<br>");
  lines.push(
    `<b>Widerruf akzeptiert</b>? ${hasAcceptedWiderruf.value ? "Ja" : "Nein"}`
  );
  lines.push(
    `<br><b>Zylinder korrekt gemessen</b>? ${hasMeasuredCorrectly.value ? "Ja" : "Nein"
    }`
  );
  lines.push(
    `<br><b>Lieferzeiten akzeptiert</b>? ${hasAcceptedLieferzeiten.value ? "Ja" : "Nein"
    }`
  );
  lines.push(`<br> <b>Gesamtschlüssel:</b> ${totalGlobalKeys.value}`);
  return lines.join("\n");
}

function calculatePriceForModel(modelName, positionArr, totalKeys = 0) {
  if (!modelName || modelName === "Kein bestimmtes Modell") return 0;
  const modelConfig = cylinderModels[modelName];
  if (!modelConfig) return 0;
  let totalPrice = 0;
  positionArr.forEach((item) => {
    const typeKey = mapTypToModelKey(item.Typ);
    if (!modelConfig[typeKey]) {
      return;
    }
    const sizeMatch = modelConfig[typeKey].sizes.find(
      (sz) =>
        Number(sz.outside) === Number(item.SizeA) &&
        Number(sz.inside) === Number(item.SizeI)
    );
    if (!sizeMatch) {
      return;
    }
    let priceForThisDoor = sizeMatch.price || 0;
    const upchargeObj =
      modelConfig[typeKey].optionUpcharges || modelConfig.optionUpcharges || {};
    const selectedOptions = (item.Option || "")
      .split(",")
      .map((s) => s.trim())
      .filter((o) => o);
    selectedOptions.forEach((opt) => {
      const mappedKey = mapOptionToUpchargeKey(opt);
      if (mappedKey && upchargeObj[mappedKey]) {
        priceForThisDoor += upchargeObj[mappedKey];
      }
    });
    const doorCount = Number(item.Anzahl) || 1;
    totalPrice += priceForThisDoor * doorCount;
  });
  const globalKeyPrice = modelConfig.keyPrice || 0;
  totalPrice += globalKeyPrice * totalKeys;
  return totalPrice;
}

function checkIfAllAreChecked(matrixItems) {
  if (!matrixItems || matrixItems.length === 0) return false;
  return matrixItems.every(
    (m) => m.Berechtigung === true || m.Berechtigung === 1
  );
}
const allAreChecked = computed(() => checkIfAllAreChecked(matrix.value));

const selectedModelOffer = computed(() => {
  return offers.value.find((o) => o.title === selectedModel.value);
});

function matrixCheck(zylinderPos, keyPos) {
  const found = matrix.value.find(
    (item) => item.POSZylinder === zylinderPos && item.POSSchluessel === keyPos
  );
  return found && (found.Berechtigung === true || found.Berechtigung === 1);
}

function getCylindersForKey(keyPos) {
  const result = positionData.value
    .filter((pos) => matrixCheck(pos.POS, keyPos))
    .map((pos) => {
      if (pos.Bezeichnung && pos.Bezeichnung.trim() !== "") {
        return pos.Bezeichnung;
      } else {
        return `Tür ${pos.POS}`;
      }
    });
  return result.join(", ");
}

const alternativeOffers = computed(() => {
  return offers.value.filter((o) => {
    if (o.title === selectedModel.value) return false;
    if (!o.canHandleAll) return false;
    if (o.isSchliessanlage !== isSchliessanlage) {
      if (isSchliessanlage && allAreChecked.value && !o.isSchliessanlage) {
        // OK
      } else {
        return false;
      }
    }
    return true;
  });
});

const sortedAlternativeOffers = computed(() => {
  const sorted = [...alternativeOffers.value];
  if (selectedSort.value === "priceAsc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (selectedSort.value === "priceDesc") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (selectedSort.value === "securityAsc") {
    sorted.sort((a, b) => a.securityLevel - b.securityLevel);
  } else if (selectedSort.value === "securityDesc") {
    sorted.sort((a, b) => b.securityLevel - a.securityLevel);
  }
  return sorted;
});

async function addToCart(systemName, price, productID) {
  const fullConfiguration = generateConfigurationText();
  try {
    const response = await fetch(
      "https://www.stt-shop.de/wp-json/custom/v1/add_to_cart",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productID,
          price: price,
          quantity: 1,
          anlage_nummer: anlageNr,
          config_text: fullConfiguration,
          widerruf_accepted: true, // Bleibt so, da allRequiredChecked es sicherstellt
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to add to cart: ${response.statusText}`);
    }


    await $fetch("/api/updateProtect", {
      method: "POST",
      body: { ID: anlageNr }
    });

    isSummaryModalOpen.value = false;
    isSuccessModalOpen.value = true;
    nextTick(() => {
      // Prüfe jetzt auf das korrekte Modal: isSuccessModalOpen
      if (isSuccessModalOpen.value && window.self !== window.top) {
        const pageTopElement =
          document.querySelector(".systeme-page > h2:first-of-type") ||
          document.querySelector(".filters-container") ||
          document.body;
        if (pageTopElement) {
          pageTopElement.scrollIntoView({ behavior: "auto", block: "start" });
        } else {
          console.warn(
            "Kein geeignetes Element am Seitenanfang für scrollIntoView im ErfolgsModal gefunden."
          );
        }
      }
    });
    window.open("https://www.stt-shop.de/warenkorb/", "_blank");
  } catch (error) {
    console.error("Error adding to cart:", error);
    // Hier könntest du auch eine Fehlermeldung für den Nutzer setzen
    isSummaryModalOpen.value = false;
    requirementErrorText.value = `Fehler beim Hinzufügen zum Warenkorb: ${error.message}`;
    showRequirementError.value = true;
  }
}

onMounted(async () => {
  if (!anlageNr) return;
  try {
    const positionResponse = await $fetch("./api/sqlgetposition", {
      method: "POST",
      body: { ID: anlageNr },
    });
    positionData.value = positionResponse.queryresult || [];
    const schluesselResponse = await $fetch("./api/sqlgetschluessel", {
      method: "POST",
      body: { ID: anlageNr },
    });
    schluesselData.value = schluesselResponse.queryresult || [];
    let sumKeys = 0;
    schluesselData.value.forEach((entry) => {
      sumKeys += Number(entry.Anzahl) || 0;
    });
    totalGlobalKeys.value = sumKeys;
    const matrixResponse = await $fetch("./api/sqlgetmatrix", {
      method: "POST",
      body: { ID: anlageNr },
    });
    matrix.value = matrixResponse.queryresult || [];
    const allModelNames = Object.keys(cylinderModels).filter(
      (modelName) => modelName !== "Kein bestimmtes Modell"
    );
    const tempOffers = allModelNames.map((modelName) => {
      const modelConfig = cylinderModels[modelName];
      const canHandleAll = modelCanHandleAllZylinders(
        modelName,
        positionData.value
      );
      const price = calculatePriceForModel(
        modelName,
        positionData.value,
        totalGlobalKeys.value
      );
      return {
        title: modelName,
        price,
        productID: modelConfig.productID || null,
        canHandleAll,
        isSchliessanlage: !!modelConfig.isSchliessanlage,
        image: modelConfig.image,
        alt: modelName,
        useCase: modelConfig.useCase || "",
        features: modelConfig.features || [],
        infoText: modelConfig.infoText || "",
        securityLevel: modelConfig.securityLevel || 1,
        deliveryTime: modelConfig.deliveryTime || "Lieferzeit nicht definiert",
      };
    });
    offers.value = tempOffers;
  } catch (error) {
    console.error("Fehler beim Laden der Konfigurationsdaten:", error);
  }
});
</script>

<template>
  <div class="systeme-page">
    <!-- Verbesserter Header mit Breadcrumb und Support -->
    <div class="page-header">
      <div class="header-top">
        <div class="breadcrumb">
          <span class="breadcrumb-item">Konfigurator</span>
          <i class="i-heroicons-chevron-right breadcrumb-separator"></i>
          <span class="breadcrumb-item current">Systemauswahl</span>
        </div>

        <!-- Support-Bereich (rechts oben) -->
        <div class="support-widget">
          <div class="support-icon">
            <i class="i-heroicons-phone"></i>
          </div>
          <div class="support-text">
            <span class="support-label">Beratung gewünscht?</span>
            <a href="tel:+4951306093900" class="support-phone">
              +49 5130 609390
            </a>
          </div>
        </div>
      </div>

      <div class="page-title-section">
        <h2>Passende Schließsysteme für Ihre Konfiguration</h2>
        <div class="anlage-info" v-if="anlageNr">
          <i class="i-heroicons-identification anlage-icon"></i>
          <span>Anlage: <strong>{{ anlageNr }}</strong></span>
        </div>
      </div>
    </div>

    <!-- Verbesserte Filter-Sektion -->
    <div class="controls-section">
      <div class="filters-container">
        <div class="filter-group">
          <label class="filter-label">
            <i class="i-heroicons-funnel filter-icon"></i>
            Sortieren nach:
          </label>
          <select v-model="selectedSort" class="filter-select">
            <option value="none">Empfehlung</option>
            <option value="priceAsc">Preis (günstig → teuer)</option>
            <option value="priceDesc">Preis (teuer → günstig)</option>
            <option value="securityAsc">Sicherheit (niedrig → hoch)</option>
            <option value="securityDesc">Sicherheit (hoch → niedrig)</option>
          </select>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <UButton class="action-btn secondary" @click="navigateBack" icon="i-heroicons-arrow-left" variant="outline"
          color="gray">
          Konfiguration bearbeiten
        </UButton>
      </div>
    </div>

    <!-- Haupt-Angebot (verbessertes Design) -->
    <div v-if="selectedModelOffer" class="main-offer-section">
      <div class="section-header">
        <h3>
          <i class="i-heroicons-star section-icon"></i>
          Ihr ausgewähltes Modell
        </h3>
        <div class="recommendation-badge">Empfohlen</div>
      </div>

      <div class="offer main-offer">
        <div class="offer-badge">Ihre Auswahl</div>
        <img :src="selectedModelOffer.image" :alt="selectedModelOffer.alt" class="offer-image" />
        <div class="offer-details">
          <div class="offer-header">
            <h4>{{ selectedModelOffer.title }}</h4>
            <div class="offer-type-info">
              <i class="i-heroicons-lock-closed type-icon"></i>
              {{ selectedModelOffer.isSchliessanlage ? "Schließanlage" : "Gleichschließung" }}
            </div>
          </div>

          <ul class="offer-features">
            <li v-for="(feature, i) in selectedModelOffer.features || []" :key="i">
              <i class="i-heroicons-check-circle feature-check"></i>
              {{ feature }}
            </li>
          </ul>

          <div class="offer-meta">
            <div class="offer-delivery">
              <i class="i-heroicons-truck delivery-icon"></i>
              <span><strong>Lieferzeit:</strong> {{ selectedModelOffer.deliveryTime }}</span>
            </div>

            <UButton class="info-button" color="gray" variant="ghost" icon="i-heroicons-information-circle"
              @click="openInfo(selectedModelOffer)">
              Details ansehen
            </UButton>
          </div>

          <div class="offer-footer">
            <div class="offer-price">
              <span class="price-label">Gesamtpreis:</span>
              <div class="price-value">
                <strong>{{ roundPrice(selectedModelOffer.price) }} €</strong>
                <span class="shipping">inkl. Versand</span>
              </div>
            </div>

            <UButton icon="i-heroicons-shopping-cart" class="select-system-button primary"
              @click="openSummary(selectedModelOffer)">
              System kaufen
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Alternative Angebote (verbessertes Listen-Design) -->
    <div v-if="alternativeOffers.length" class="alternatives-section">
      <div class="section-header">
        <h3>
          <i class="i-heroicons-squares-2x2 section-icon"></i>
          {{ selectedModel === "Kein bestimmtes Modell" ? "Alle passenden Systeme" : "Weitere Optionen" }}
        </h3>
        <span class="result-count">{{ alternativeOffers.length }} Alternativen</span>
      </div>

      <div class="offer-container">
        <div class="offer alternative-offer" v-for="(offer, index) in sortedAlternativeOffers" :key="offer.title">
          <img :src="offer.image" :alt="offer.alt" class="offer-image" />
          <div class="offer-details">
            <div class="offer-header">
              <h4>{{ offer.title }}</h4>
              <div class="offer-type-info">
                <i class="i-heroicons-lock-closed type-icon"></i>
                {{ offer.isSchliessanlage ? "Schließanlage" : "Gleichschließung" }}
              </div>
            </div>

            <ul class="offer-features">
              <li v-for="(feature, i) in offer.features?.slice(0, 2) || []" :key="i">
                <i class="i-heroicons-check-circle feature-check"></i>
                {{ feature }}
              </li>
              <li v-if="offer.features?.length > 2" class="more-features">
                +{{ offer.features.length - 2 }} weitere Features
              </li>
            </ul>

            <div class="offer-meta">
              <div class="offer-delivery">
                <i class="i-heroicons-truck delivery-icon"></i>
                <span><strong>Lieferzeit:</strong> {{ offer.deliveryTime }}</span>
              </div>

              <UButton class="info-button" color="gray" variant="ghost" icon="i-heroicons-information-circle"
                @click="openInfo(offer)">
                Details
              </UButton>
            </div>

            <div class="offer-footer">
              <div class="offer-price">
                <span class="price-label">Gesamtpreis:</span>
                <div class="price-value">
                  <strong>{{ roundPrice(offer.price) }} €</strong>
                  <span class="shipping">inkl. Versand</span>
                </div>
              </div>

              <UButton icon="i-heroicons-shopping-cart" class="select-system-button" @click="openSummary(offer)">
                Auswählen
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Navigation -->
    <div class="page-footer">
      <UButton class="back-button-footer" @click="navigateBack" icon="i-heroicons-arrow-left" variant="outline"
        color="gray">
        Zurück zum Konfigurator
      </UButton>
    </div>
  </div>


  <UModal :fullscreen="true" v-model="isSummaryModalOpen" class="summary-modal modern-design">
    <div class="modal-content">
      <div class="modal-header">
        <div class="header-title">
          <h2>
            {{ selectedOffer.title || "Ausgewähltes Modell" }}
            -
            {{ isSchliessanlage ? "Schließanlage" : "Gleichschließung" }}
          </h2>
          <UButton color="red" class="close-button" icon="i-heroicons-x-mark" @click="isSummaryModalOpen = false">
          </UButton>
        </div>
      </div>

      <div class="modal-body-scrollable">
        <div v-if="selectedOffer.imageUrl" class="cylinder-image-container">
          <img :src="selectedOffer.imageUrl" alt="Zylinderbild" class="cylinder-image" />
        </div>

        <div class="content-wrapper">
          <h3 class="config-heading">Zylinderübersicht</h3>
          <div class="table-scroll-wrapper">
            <table class="zylinder-table">
              <thead>
                <tr>
                  <th>Pos.</th>
                  <th>Bezeichnung</th>
                  <th>Typ</th>
                  <th>Außen / Innen</th>
                  <th>Anzahl</th>
                  <th>Optionen</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pos in positionData" :key="pos.POS">
                  <td>{{ pos.POS }}</td>
                  <td>
                    {{
          pos.Bezeichnung && pos.Bezeichnung.trim() !== ""
            ? pos.Bezeichnung
            : "Tür " + pos.POS
        }}
                  </td>
                  <td>{{ pos.Typ }}</td>
                  <td>{{ pos.SizeA }} / {{ pos.SizeI }}</td>
                  <td>{{ pos.Anzahl }}</td>
                  <td>{{ pos.Option }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="keys-info">
            Gesamtanzahl Schlüssel: <strong>{{ totalGlobalKeys }}</strong>
          </p>

          <h3 class="config-heading">Schlüsselübersicht</h3>
          <ul class="keys-list">
            <li v-for="(keyItem, index) in schluesselData" :key="keyItem.KeyPOS">
              <strong>
                {{
          keyItem.Bezeichnung && keyItem.Bezeichnung.trim() !== ""
            ? keyItem.Bezeichnung
            : "Schlüssel " + keyItem.KeyPOS
        }}
              </strong>
              schließt:
              <span>{{ getPositionsForKey(keyItem.KeyPOS) }}</span>
            </li>
          </ul>
        </div>

        <div class="price-and-widerruf">
          <div class="required-checks">
            <h2>Wichtige Hinweise:</h2>
            <label class="widerruf-label">
              <UCheckbox color="sky" v-model="hasAcceptedWiderruf" />
              <span>Ich stimme der Widerrufsbelehrung zu.</span>
              <div class="info-icon" @mouseenter="hoverWiderruf = true" @mouseleave="hoverWiderruf = false">
                <i class="i-heroicons-information-circle" />
                <transition name="fade">
                  <div v-if="hoverWiderruf" class="tooltip-box">
                    Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung
                    von Waren, die nicht vorgefertigt sind und für deren
                    Herstellung eine individuelle Auswahl oder Bestimmung durch
                    den Verbraucher maßgeblich ist oder die eindeutig auf die
                    persönlichen Bedürfnisse des Verbrauchers zugeschnitten
                    sind.
                  </div>
                </transition>
              </div>
            </label>
            <label class="widerruf-label" style="margin-top: 10px">
              <UCheckbox color="sky" v-model="hasAcceptedLieferzeiten" />
              <span>Ich habe die Lieferzeiten zur Kenntnis genommen.</span>
              <div class="info-icon" @mouseenter="hoverLieferzeit = true" @mouseleave="hoverLieferzeit = false"
                @click.stop>
                <i class="i-heroicons-information-circle" />
                <transition name="fade">
                  <div v-if="hoverLieferzeit" class="tooltip-box">
                    Die Lieferzeit richtet sich nach der Art Ihrer Schließung.
                    Während einfache Gleichschließungen meist innerhalb von 2
                    Werktagen bis zu einer Woche geliefert werden, können
                    komplexere Schließanlagen mit vielen Optionen bis zu 4
                    Wochen in Anspruch nehmen.
                  </div>
                </transition>
              </div>
            </label>
            <label class="widerruf-label" style="margin-top: 10px">
              <UCheckbox color="sky" v-model="hasMeasuredCorrectly" />
              <span>Ich habe alle Zylinder/Schlösser korrekt gemessen.</span>
            </label>
            <p v-if="showRequirementError" class="error-message-pflichtfelder">
              <i class="i-heroicons-exclamation-triangle error-icon"></i>
              <span class="error-text-content">{{ requirementErrorText }}</span>
            </p>
          </div>

          <div class="offer-price-summery" style="margin-top: 20px">
            Gesamtpreis:
            <strong>{{ roundPrice(selectedOffer.price || 0) }} €</strong><span class="shipping">,<br />inkl.
              Versand</span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <UButton :class="{ 'pseudo-disabled': !allRequiredChecked }" color="blue" variant="solid"
          @click="handlePurchaseClick">
          Angebot kaufen
        </UButton>
      </div>
    </div>
  </UModal>

  <UModal :fullscreen="true" v-model="isInfoModalOpen" class="info-modal modern-design">
    <div class="modal-content">
      <div class="modal-header">
        <div class="header-title">
          <h2>
            {{ selectedOffer.title || "Ausgewähltes Modell" }}
            -
            {{ isSchliessanlage ? "Schließanlage" : "Gleichschließung" }}
          </h2>
          <UButton color="red" class="close-button" icon="i-heroicons-x-mark" @click="isInfoModalOpen = false">
          </UButton>
        </div>
      </div>

      <!-- Flex-Container: Bild & Info-Text -->
      <div class="model-overview-card">
        <div class="model-image-section">
          <div class="image-card">
            <img :src="selectedOffer.image" alt="Zylinder-Modell" />
          </div>
          <!-- Optional: Sicherheitsbadge -->
          <div v-if="selectedOffer.securityLevel" class="security-badge">
            🛡️ Level {{ selectedOffer.securityLevel }}
          </div>
        </div>

        <div class="model-info-section">
          <div class="info-header">
            <h3 class="model-title">{{ selectedOffer.title }}</h3>
            <span class="model-type">
              {{ isSchliessanlage ? "Schließanlage" : "Gleichschließung" }}
            </span>
          </div>

          <p class="model-info-text" style="white-space: pre-wrap">
            {{ selectedOffer.infoText }}
          </p>

          <!-- Optional: Feature-Tags -->
          <div v-if="selectedOffer.features && selectedOffer.features.length" class="features-preview">
            <span v-for="feature in selectedOffer.features.slice(0, 3)" :key="feature" class="feature-tag">
              {{ feature }}
            </span>
            <span v-if="selectedOffer.features.length > 3" class="feature-tag">
              +{{ selectedOffer.features.length - 3 }} weitere
            </span>
          </div>

          <!-- Call-to-Action Hinweis -->
          <div class="action-hint">
            <i class="hint-icon">💡</i>
            Schließen Sie das Fenster, um zur Systemauswahl zurückzukehren
          </div>
        </div>
      </div>
    </div>
  </UModal>

  <UModal :fullscreen="true" v-model="isSuccessModalOpen" class="success-modal modern-design">
    <div class="modal-content">
      <div class="modal-header flex padding">
        <div class="header-title">
          <h2>Erfolgreich hinzugefügt</h2>
        </div>
        <UButton color="red" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="close-button" style="
            margin-bottom: 20px;
            border-radius: 50%;
            width: 40px;
            height: 40px;
          " @click="isSuccessModalOpen = false" />
      </div>

      <div class="modal-body-success">
        <div class="success-icon-wrapper">
          <i class="i-heroicons-check-circle-solid success-icon"></i>
        </div>
        <h3 class="success-title">Konfiguration im Warenkorb</h3>
        <p class="success-message">
          Ihre individuelle Schließanlage wurde erfolgreich zum Warenkorb
          hinzugefügt. Bitte überprüfen Sie die Details im Warenkorb, bevor Sie
          Ihre Bestellung abschließen.
        </p>
      </div>

      <div class="modal-footer-success">
        <UButton color="gray" variant="ghost" @click="isSuccessModalOpen = false">
          Weiter einkaufen
        </UButton>
        <UButton icon="i-heroicons-arrow-right-16-solid" @click="goToCart">
          Zum Warenkorb
        </UButton>
      </div>
    </div>
  </UModal>
</template>

<style scoped>
@import "@/styles/systems.scss";

.padding {
  padding: 20px;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-body-success {
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.success-icon-wrapper {
  margin-bottom: 1.5rem;
}

.success-icon {
  font-size: 5rem;
  /* Oder 80px */
  color: #4ade80;
  /* Ein schönes Grün, z.B. Tailwind green-400 */
  width: 80px;
  height: 80px;
}

.success-title {
  font-size: 1.5rem;
  /* 24px */
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.success-message {
  font-size: 1rem;
  /* 16px */
  color: #6b7280;
  /* a gray color */
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.modal-footer-success {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  /* 12px */
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  /* light gray border */
  background-color: #f9fafb;
  /* slightly off-white */
}
</style>
