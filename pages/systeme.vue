<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
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
const selectedOffer = ref(null);
const hasAcceptedWiderruf = ref(false);
const hasMeasuredCorrectly = ref(false);
const hasAcceptedLieferzeiten = ref(false);
const hoverWiderruf = ref(false);
const hoverLieferzeit = ref(false);

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
  isSummaryModalOpen.value = true;
}

function confirmPurchase() {
  // Nur wenn angehakt
  if (!hasAcceptedWiderruf.value) return;

  const offer = selectedOffer.value;
  if (!offer) return;

  addToCart(offer.title, offer.price, offer.productID);
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

const allRequiredChecked = computed(() => {
  return (
    hasAcceptedWiderruf.value &&
    hasMeasuredCorrectly.value &&
    hasAcceptedLieferzeiten.value
  );
});

function generateConfigurationText() {
  let lines = [];

  // 1) Zylinder-Daten
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

  // 2) Schlüssel-Daten
  lines.push("<br>");
  lines.push("");
  schluesselData.value.forEach((keyItem) => {
    const keyName =
      keyItem.Bezeichnung && keyItem.Bezeichnung.trim() !== ""
        ? keyItem.Bezeichnung
        : `Schlüssel ${keyItem.KeyPOS}`;

    // Welche Zylinder schließt dieser Schlüssel?
    const cylinders = getCylindersForKey(keyItem.KeyPOS);
    lines.push(`-<b> ${keyName}</b> schließt: ${cylinders}<br>`);
  });

  // 3) Widerruf
  lines.push("<br>");
  lines.push(
    `<b>Widerruf akzeptiert</b>? ${hasAcceptedWiderruf.value ? "Ja" : "Nein"}`
  );
  lines.push(
    `<br><b>Zylinder korrekt gemessen</b>? ${
      hasMeasuredCorrectly.value ? "Ja" : "Nein"
    }`
  );
  lines.push(
    `<br><b>Lieferzeiten akzeptiert</b>? ${
      hasAcceptedLieferzeiten.value ? "Ja" : "Nein"
    }`
  );

  // 4) Gesamt-Anzahl Schlüssel
  lines.push(`<br> <b>Gesamtschlüssel:</b> ${totalGlobalKeys.value}`);

  // Am Ende in einen String umwandeln
  return lines.join("\n");
}

// Summenpreis berechnen (Zylinder + Optionen + Schlüssel)
function calculatePriceForModel(modelName, positionArr, totalKeys = 0) {
  if (!modelName || modelName === "Kein bestimmtes Modell") return 0;
  const modelConfig = cylinderModels[modelName];
  if (!modelConfig) return 0;

  let totalPrice = 0;
  // 1) ZYLINDER-Preis
  positionArr.forEach((item) => {
    const typeKey = mapTypToModelKey(item.Typ);
    if (!modelConfig[typeKey]) {
      return;
    }
    // Finde Size
    const sizeMatch = modelConfig[typeKey].sizes.find(
      (sz) =>
        Number(sz.outside) === Number(item.SizeA) &&
        Number(sz.inside) === Number(item.SizeI)
    );
    if (!sizeMatch) {
      return;
    }

    let priceForThisDoor = sizeMatch.price || 0;

    // 2) Optionen
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

    // 3) Menge pro Tür
    const doorCount = Number(item.Anzahl) || 1;
    totalPrice += priceForThisDoor * doorCount;
  });

  // 4) Schlüssel
  const globalKeyPrice = modelConfig.keyPrice || 0;
  totalPrice += globalKeyPrice * totalKeys;

  return totalPrice;
}

// ====================== NEU: Alle angekreuzt? ======================
function checkIfAllAreChecked(matrixItems) {
  if (!matrixItems || matrixItems.length === 0) return false;
  return matrixItems.every(
    (m) => m.Berechtigung === true || m.Berechtigung === 1
  );
}
const allAreChecked = computed(() => checkIfAllAreChecked(matrix.value));

// ====================== ANGEBOTSLISTE ======================
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

// Hier filtern wir die "alternativen Angebote" heraus.
// Neue Logik => wenn isSchliessanlage===true und allAreChecked===true,
// dann dürfen wir auch "o.isSchliessanlage === false" anzeigen.
const alternativeOffers = computed(() => {
  return offers.value.filter((o) => {
    // Nicht das Hauptmodell
    if (o.title === selectedModel.value) return false;
    // Muss alle Zylinder abdecken
    if (!o.canHandleAll) return false;

    // Standard-Fall: "Typ" muss passen
    // Ausnahme: Schließanlage => allAreChecked => wir erlauben auch false
    if (o.isSchliessanlage !== isSchliessanlage) {
      // Nur wenn isSchliessanlage===true && allAreChecked => o.isSchliessanlage===false erlauben
      if (isSchliessanlage && allAreChecked.value && !o.isSchliessanlage) {
        // => OK => wir brechen NICHT ab
      } else {
        return false;
      }
    }

    // sonst reinlassen
    return true;
  });
});

const sortedAlternativeOffers = computed(() => {
  const sorted = [...alternativeOffers.value];

  if (selectedSort.value === "priceAsc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (selectedSort.value === "priceDesc") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (selectedSort.value === "useCasePrivat") {
    sorted.sort((a, b) => compareUseCase(a, b, "privat"));
  } else if (selectedSort.value === "useCaseGewerblich") {
    sorted.sort((a, b) => compareUseCase(a, b, "gewerblich"));
  } else if (selectedSort.value === "securityAsc") {
    sorted.sort((a, b) => a.securityLevel - b.securityLevel);
  } else if (selectedSort.value === "securityDesc") {
    sorted.sort((a, b) => b.securityLevel - a.securityLevel);
  }

  return sorted;
});

function compareUseCase(a, b, focus) {
  const rankPrivat = {
    privat: 0,
    "privat & gewerblich": 1,
    gewerblich: 2,
  };
  const rankGewerblich = {
    gewerblich: 0,
    "privat & gewerblich": 1,
    privat: 2,
  };

  // Wähle Rangtabelle je nach Fokus
  const rank = focus === "privat" ? rankPrivat : rankGewerblich;

  const rA = rank[a.useCase] ?? 999; // Fallback, falls useCase fehlt
  const rB = rank[b.useCase] ?? 999;

  // Zuerst nach Rang
  const diff = rA - rB;
  if (diff !== 0) return diff;

  // Falls Rang gleich => fallback: Preis aufsteigend
  return a.price - b.price;
}

// In den Warenkorb legen (gleich geblieben)
function addToCart(systemName, price, productID) {
  const fullConfiguration = generateConfigurationText();

  fetch("https://www.stt-shop.de/wp-json/custom/v1/add_to_cart", {
    method: "POST",
    //
    headers: {
      "Content-Type": "application/json",
    },
    
   body: JSON.stringify({}), // No data sent as per your request,
  
  })
    .then((r) => r.json())
    .then((result) => {
      if (result.success) {
        const cartUrl =
          result.data.cart_url || "https://www.stt-shop.de/warenkorb/";
         // const cartKey = result.data.cart_key;
         //const finalUrl = cartKey
         //   ? `${cartUrl}?cocart-load-cart=${cartKey}`
         //   : cartUrl;
        window.open(finalUrl, "_blank");
      }
    })
    .catch((err) => {
      console.log("Fehler beim Hinzufügen zum Warenkorb:", err);
    });
}

// onMounted => Positionen, Schlüssel, Matrix laden
onMounted(async () => {
  if (!anlageNr) return;

  try {
    // 1) Positionen (Zylinder)
    const positionResponse = await $fetch("./api/sqlgetposition", {
      method: "POST",
      body: { ID: anlageNr },
    });
    positionData.value = positionResponse.queryresult || [];

    // 2) Schlüssel:
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

    // 3) Matrix (NEU!)
    const matrixResponse = await $fetch("./api/sqlgetmatrix", {
      method: "POST",
      body: { ID: anlageNr },
    });
    matrix.value = matrixResponse.queryresult || [];

    // 4) Angebote vorbereiten
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
          <option value="useCasePrivat">Privat</option>
          <option value="useCaseGewerblich">Gewerblich</option>
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
      <div class="offer highlighted-offer">
        <img
          :src="selectedModelOffer.image"
          :alt="selectedModelOffer.alt"
          class="offer-image"
        />
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
            <li
              v-for="(feature, i) in selectedModelOffer.features || []"
              :key="i"
            >
              <i class="icon-check"></i> {{ feature }}
            </li>
          </ul>
          <div
            class="use-case-badge"
            :class="`use-case-${selectedModelOffer.useCase}`"
          >
            Empfohlen für:
            <strong>
              {{
                selectedModelOffer.useCase === "privat"
                  ? "Privat"
                  : selectedModelOffer.useCase === "gewerblich"
                  ? "Gewerblich"
                  : "Privat & Gewerblich"
              }}
            </strong>
          </div>
          <div class="offer-price">
            Gesamtpreis:
            <strong>{{ roundPrice(selectedModelOffer.price) }} €</strong>
          </div>
          <UButton
            icon="i-heroicons-shopping-cart-16-solid"
            class="select-system-button"
            @click="openSummary(selectedModelOffer)"
          >
            System auswählen
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
        <div
          class="offer"
          v-for="(offer, index) in sortedAlternativeOffers"
          :key="offer.title"
        >
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
            <div class="use-case-badge" :class="`use-case-${offer.useCase}`">
              Unsere Empfehlung: <br />
              <strong>
                {{
                  offer.useCase === "privat"
                    ? "Privat"
                    : offer.useCase === "gewerblich"
                    ? "Gewerblich"
                    : "Privat & Gewerblich"
                }}
              </strong>
            </div>
            <div class="offer-price">
              Gesamtpreis:
              <strong class="price">{{ roundPrice(offer.price) }}€</strong>
            </div>
            <UButton
              icon="i-heroicons-shopping-cart-16-solid"
              class="select-system-button"
              @click="openSummary(offer)"
            >
              System auswählen
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <UButton class="back-button" @click="navigateBack">
      Zurück zum Konfigurator
    </UButton>
  </div>

  <UModal
    :fullscreen="true"
    v-model="isSummaryModalOpen"
    class="summary-modal modern-design"
  >
    <div class="modal-content">
      <!-- Header / Title -->
      <div class="modal-header">
        <div class="header-title">
          <h2>
            {{ selectedOffer.title || "Ausgewähltes Modell" }}
            -
            {{ isSchliessanlage ? "Schließanlage" : "Gleichschließung" }}
          </h2>
          <UButton
            color="red"
            class="close-button"
            @click="isSummaryModalOpen = false"
          >
            X
          </UButton>
        </div>
      </div>

      <!-- Flex-Container: Bild & Info-Text -->
      <div class="model-overview-card">
        <div class="model-image-section">
          <img :src="selectedOffer.image" alt="Zylinder-Modell" />
        </div>
        <div class="model-info-section">
          <p class="model-info-text" style="white-space: pre-wrap">
            {{ selectedOffer.infoText }}
          </p>
        </div>
      </div>

      <!-- Zylinder- und Schlüsselübersicht -->
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
              {{
                keyItem.Bezeichnung && keyItem.Bezeichnung.trim() !== ""
                  ? keyItem.Bezeichnung
                  : "Schlüssel " + keyItem.KeyPOS
              }}
            </strong>
            schließt:
            <span>{{ getCylindersForKey(keyItem.KeyPOS) }}</span>
          </li>
        </ul>
      </div>

      <!-- Widerruf / Checkboxen / Preis -->
      <div class="price-and-widerruf">
        <h2>Wichtige Hinweise:</h2>
        <div class="required-checks">
          <!-- Widerruf -->
          <label class="widerruf-label">
            <UCheckbox color="sky" v-model="hasAcceptedWiderruf" />
            <span>Ich stimme der Widerrufsbelehrung zu.</span>
            <div
              class="info-icon"
              @mouseenter="hoverWiderruf = true"
              @mouseleave="hoverWiderruf = false"
            >
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
          <!-- Lieferzeiten -->
          <label class="widerruf-label" style="margin-top: 10px">
            <UCheckbox color="sky" v-model="hasAcceptedLieferzeiten" />
            <span>Ich habe die Lieferzeiten zur Kenntnis genommen.</span>
            <div
              class="info-icon"
              @mouseenter="hoverLieferzeit = true"
              @mouseleave="hoverLieferzeit = false"
              @click.stop
            >
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
           <!-- Zylinder gemessen -->
           <label class="widerruf-label" style="margin-top: 10px">
            <UCheckbox color="sky" v-model="hasMeasuredCorrectly" />
            <span>Ich habe alle Zylinder/Schlösser korrekt gemessen.</span>
          </label>

        </div>

        <!-- Preis -->
        <div class="offer-price" style="margin-top: 20px">
          Gesamtpreis:
          <strong>{{ roundPrice(selectedOffer.price || 0) }} €</strong>
        </div>
      </div>

      <!-- Footer + Kauf-Button -->
      <div class="modal-footer">
        <UButton
          :disabled="!allRequiredChecked"
          color="blue"
          variant="solid"
          @click="confirmPurchase"
        >
          Angebot kaufen
        </UButton>
      </div>
    </div>
  </UModal>
</template>

<style scoped>
@import "@/styles/systems.scss";
</style>
