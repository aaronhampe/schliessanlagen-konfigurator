<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, computed, watch } from "vue"; // watch hinzugefügt
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
  // Reset der Checkboxen und Fehlermeldung beim Öffnen des Modals
  hasAcceptedWiderruf.value = false;
  hasMeasuredCorrectly.value = false;
  hasAcceptedLieferzeiten.value = false;
  showRequirementError.value = false; // Fehlermeldung zurücksetzen
  isSummaryModalOpen.value = true;
}

function openInfo(offer) {
  selectedOffer.value = offer;
  isInfoModalOpen.value = true;
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

  // Die addToCart-Funktion bleibt wie sie ist.
  // Sie verwendet intern generateConfigurationText, was die Werte der Checkboxen bereits berücksichtigt.
  // Der Parameter widerruf_accepted: true in addToCart ist okay, da allRequiredChecked dies sicherstellt.
  await addToCart(offer.title, offer.price, offer.productID);
}

const allRequiredChecked = computed(() => {
  return (
    hasAcceptedWiderruf.value &&
    hasMeasuredCorrectly.value &&
    hasAcceptedLieferzeiten.value
  );
});

// NEU: Funktion, die vom Kaufen-Button aufgerufen wird
function handlePurchaseClick() {
  // Optional: Bestehenden Timeout löschen, falls verwendet
  // if (requirementErrorTimeout.value) {
  //   clearTimeout(requirementErrorTimeout.value);
  // }

  if (allRequiredChecked.value) { // Hier wird das computed property .value geprüft
    showRequirementError.value = false; // Fehlermeldung ausblenden, falls sie sichtbar war
    performActualPurchase();
  } else {
    requirementErrorText.value = "Bitte bestätigen Sie alle Hinweise, um fortzufahren.";
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
      if (!hasAcceptedWiderruf.value) elementToScrollTo = document.querySelector('.widerruf-label:nth-of-type(1)');
      else if (!hasAcceptedLieferzeiten.value) elementToScrollTo = document.querySelector('.widerruf-label:nth-of-type(2)');
      else if (!hasMeasuredCorrectly.value) elementToScrollTo = document.querySelector('.widerruf-label:nth-of-type(3)');
    }

    if (!elementToScrollTo) { // Fallback, falls kein spezifisches Label gefunden wurde
      elementToScrollTo = document.querySelector('.required-checks h2');
    }

    if (elementToScrollTo) {
      elementToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    const response = await fetch('https://www.stt-shop.de/wp-json/custom/v1/add_to_cart', {
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
    });
    if (!response.ok) {
      throw new Error(`Failed to add to cart: ${response.statusText}`);
    }
    window.open("https://www.stt-shop.de/warenkorb/", "_blank");
  } catch (error) {
    console.error("Error adding to cart:", error);
    // Hier könntest du auch eine Fehlermeldung für den Nutzer setzen
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
    <h2>Systemübersicht</h2>
    <div v-if="anlageNr">
      <p>
        Anlagennummer: <strong>{{ anlageNr }}</strong>
      </p>

      <div class="filters-container">
        <label class="filter-label"> Sortieren nach: </label>
        <!-- Sortier-Select -->
        <select v-model="selectedSort" class="filter-select">
          <option value="none">Keine Sortierung</option>
          <option value="priceAsc">Preis (aufsteigend)</option>
          <option value="priceDesc">Preis (absteigend)</option>
          <option value="securityAsc">Sicherheit (aufsteigend)</option>
          <option value="securityDesc">Sicherheit (absteigend)</option>
        </select>
      </div>
    </div>
    <UButton class="back-button" @click="navigateBack" style="margin: 10px 10px 10px 0px">
      Zurück zum Konfigurator
    </UButton>

    <!-- Haupt-Angebot -->
    <div v-if="selectedModelOffer">
      <h2>Angebot für Ihr ausgewähltes Modell:</h2>
      <div class="offer highlighted-offer offer-row">
        <img :src="selectedModelOffer.image" :alt="selectedModelOffer.alt" class="offer-image" />
        <div class="offer-details">
          <h3>{{ selectedModelOffer.title }}</h3>

          <div class="offer-type-info">
            {{
      selectedModelOffer.isSchliessanlage
        ? "Schließanlage"
        : "Gleichschließung"
    }}
          </div>
          <ul class="offer-features">
            <li v-for="(feature, i) in selectedModelOffer.features || []" :key="i">
              <i class="icon-check"></i> {{ feature }}
            </li>
          </ul>
          <UButton class="info-button" color="gray" variant="ghost"
            @click="openInfo(selectedModelOffer /* bzw. offer im v-for */)">
            Mehr&nbsp;Infos
          </UButton>
          <div class="offer-delivery">
            <strong>Lieferzeit:</strong> {{ selectedModelOffer.deliveryTime }}
          </div>
          <div class="offer-price">
            Gesamtpreis:
            <strong>{{ roundPrice(selectedModelOffer.price) }} €</strong> <span class="shipping">inkl. Versand</span>
          </div>
          <UButton icon="i-heroicons-shopping-cart-16-solid" class="select-system-button"
            @click="openSummary(selectedModelOffer)">
            System kaufen
          </UButton>
        </div>
      </div>
    </div>

    <!-- Alternative Angebote -->
    <div v-if="alternativeOffers.length" style="margin-top: 30px">
      <h2>
        {{
      selectedModel === "Kein bestimmtes Modell"
        ? "Angebote für Sie:"
        : "Weitere passende Angebote:"
    }}
      </h2>
      <div class="offer-container">
        <div class="offer offer-row" v-for="(offer, index) in sortedAlternativeOffers" :key="offer.title">
          <img :src="offer.image" :alt="offer.alt" class="offer-image" />
          <div class="offer-details">
            <h3>{{ offer.title }}</h3>
            <div class="offer-type-info">
              {{
      offer.isSchliessanlage ? "Schließanlage" : "Gleichschließung"
    }}
            </div>
            <ul class="offer-features">
              <li v-for="(feature, i) in offer.features || []" :key="i">
                <i class="icon-check"></i> {{ feature }}
              </li>
            </ul>

            <UButton class="info-button" color="gray" variant="ghost"
              @click="openInfo(offer /* bzw. offer im v-for */)">
              Mehr&nbsp;Infos
            </UButton>

            <div class="offer-delivery">
              <strong>Lieferzeit:</strong> {{ offer.deliveryTime }}
            </div>
            <div class="offer-price">
              Gesamtpreis:
              <strong class="price">{{ roundPrice(offer.price) }}€</strong><span class="shipping">inkl. Versand</span>
            </div>
            <UButton icon="i-heroicons-shopping-cart-16-solid" class="select-system-button" @click="openSummary(offer)">
              System kaufen
            </UButton>
          </div>
        </div>
      </div>
    </div>


    <UButton class="back-button" @click="navigateBack">
      Zurück zum Konfigurator
    </UButton>
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
          <UButton color="red" class="close-button" @click="isSummaryModalOpen = false">
            X
          </UButton>
        </div>
      </div>

      <div class="modal-body-scrollable">

        <div v-if="selectedOffer.imageUrl" class="cylinder-image-container">
          <img :src="selectedOffer.imageUrl" alt="Zylinderbild" class="cylinder-image" />
        </div>

        <div class="content-wrapper">
          <h3 class="config-heading">Zylinderübersicht</h3>
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

          <p class="keys-info">
            Gesamtanzahl Schlüssel: <strong>{{ totalGlobalKeys }}</strong>
          </p>

          <h3 class="config-heading">Schlüsselübersicht</h3>
          <ul class="keys-list">
            <li v-for="(keyItem, index) in schluesselData" :key="keyItem.KeyPOS">
              <strong>
                {{ keyItem.Bezeichnung && keyItem.Bezeichnung.trim() !== "" ? keyItem.Bezeichnung : "Schlüssel " +
      keyItem.KeyPOS }}
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
                    persönlichen Bedürfnisse des Verbrauchers zugeschnitten sind.
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
                    komplexere Schließanlagen mit vielen Optionen bis zu 4 Wochen
                    in Anspruch nehmen.
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
            <strong>{{ roundPrice(selectedOffer.price || 0) }} €</strong><span class="shipping">,<br>inkl.
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

</template>

<style scoped>
@import "@/styles/systems.scss";
</style>
