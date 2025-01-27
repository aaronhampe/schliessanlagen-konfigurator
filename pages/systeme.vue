<template>
  <div class="systeme-page">
    <h2>Systemübersicht</h2>
    <div v-if="anlageNr">
      <p>
        Zuletzt erstellte Anlagennummer: <strong>{{ anlageNr }}</strong>
      </p>
    </div>

    <!-- Haupt-Angebot: das im Konfigurator ausgewählte Modell -->
    <div v-if="selectedModelOffer">
      <h2>Angebot für Ihr ausgewähltes Modell</h2>
      <div class="offer highlighted-offer">
        <img :src="selectedModelOffer.image" :alt="selectedModelOffer.alt" class="offer-image" />
        <div class="offer-details">
          <h3>{{ selectedModelOffer.title }}</h3>
          <div class="offer-price">
            Gesamtpreis:
            <strong>{{ roundPrice(selectedModelOffer.price) }} €</strong>
          </div>
          <ul class="offer-features">
            <li v-for="(feature, i) in selectedModelOffer.features || []" :key="i">
              <i class="icon-check"></i> {{ feature }}
            </li>
          </ul>
          <UButton icon="i-heroicons-shopping-cart-16-solid" class="select-system-button"
            @click="addToCart(selectedModelOffer.title, selectedModelOffer.price)">
            System auswählen
          </UButton>
        </div>
      </div>
    </div>

    <!-- Alternative Angebote, die ebenfalls passen -->
    <div v-if="alternativeOffers.length" style="margin-top: 30px;">
      <h2>Weitere passende Angebote</h2>
      <div class="offer-container">
        <div class="offer" v-for="(offer, index) in alternativeOffers" :key="offer.title">
          <img :src="offer.image" :alt="offer.alt" class="offer-image" />
          <div class="offer-details">
            <h3>{{ offer.title }}</h3>
            <div class="offer-price">
              Gesamtpreis:
              <strong>{{ roundPrice(offer.price) }} €</strong>
            </div>
            <ul class="offer-features">
              <li v-for="(feature, i) in offer.features || []" :key="i">
                <i class="icon-check"></i> {{ feature }}
              </li>
            </ul>
            <UButton icon="i-heroicons-shopping-cart-16-solid" class="select-system-button"
              @click="addToCart(offer.title, offer.price)">
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
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useCylinderStore } from "@/stores/cylinderStores.js";
import cylinderModels from "@/data/cylinderModels.js";
import { mapOptionToUpchargeKey, mapTypToModelKey } from "@/data/utils/optionMapping.js";

// Router-Parameter
const route = useRoute();
const anlageNr = route.query.anlageNr || "";

// Schließanlage-Boolean aus Route
const isSchliessanlage = route.query.isSchliessanlage === "true";

// Pinia-Store (für aktuelle Auswahl)
const store = useCylinderStore();

// Das im Konfigurator gewählte Modell (z.B. "DOM IX Twido")
const selectedModel = computed(() => store.selectedModel);

// Navigation zurück (Button "Zurück zum Konfigurator")
const navigateBack = () => {
  window.history.back();
};

// "In den Warenkorb" - Platzhalter-Funktion
const addToCart = (systemName, price) => {
  console.log(`System ausgewählt: ${systemName}, Preis: ${price}`);
};

// Rundungs-Helfer
const roundPrice = (price) => price.toFixed(2);

// Hier landen die Positionsdaten aus der DB (z.B. /api/sqlgetposition)
const positionData = ref([]);

// Gesamtliste an Offers (= Hauptmodell + Alternativen)
const offers = ref([]);

/**
 * Prüft, ob das Modell alle gewünschten Zylinder (inkl. Größen) abbilden kann.
 * Falls es eine Option gibt, die das Modell gar nicht unterstützt, könntest du das
 * hier ebenfalls prüfen. Hier beschränken wir uns auf Typ + Größen.
 */
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

/**
 * Prüft für eine einzelne Tür/Position (z.B. { Typ, SizeA, SizeI, ...}),
 * ob das Modell (modelName) diese Konfiguration anbietet.
 * - Typ => "Doppelzylinder", "Knaufzylinder (innen)", ...
 * - inside/outside => Muss in .sizes enthalten sein
 */
function checkZylinderCompatibility(modelName, zylinderItem) {
  const modelConfig = cylinderModels[modelName];
  if (!modelConfig) return false;

  // "Knaufzylinder (innen)" => "Knaufzylinder"
  const typeKey = mapTypToModelKey(zylinderItem.Typ);
  if (!modelConfig[typeKey]) {
    return false; // Modell kennt den Typ gar nicht
  }

  // Hat dieses Modell + Typ die passende Size?
  const foundMatch = modelConfig[typeKey].sizes.find(
    (sz) =>
      Number(sz.inside) === Number(zylinderItem.SizeI) &&
      Number(sz.outside) === Number(zylinderItem.SizeA)
  );
  if (!foundMatch) {
    return false; // Größenpaar nicht gefunden
  }

  return true;
}

/**
 * @param {String} modelName 
 * @param {Array} positionArr - Zylinder (DB: sqlgetposition)
 * @param {Number} totalKeys - Summierte Schlüssel (aus sqlgetschluessel)
 */
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
    // Finde die Size
    const sizeMatch = modelConfig[typeKey].sizes.find(
      (sz) =>
        Number(sz.outside) === Number(item.SizeA) &&
        Number(sz.inside) === Number(item.SizeI)
    );
    if (!sizeMatch) {
      return;
    }

    let priceForThisDoor = sizeMatch.price || 0;

    // 2) Optionen (N&G, bohrschutz, etc.)
    const upchargeObj =
      modelConfig[typeKey].optionUpcharges ||
      modelConfig.optionUpcharges ||
      {};
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

    // 3) Menge/Türanzahl
    const doorCount = Number(item.Anzahl) || 1;
    totalPrice += priceForThisDoor * doorCount;
  });

  // 4) SCHLÜSSEL-Preis => keyPrice * totalKeys
  const globalKeyPrice = modelConfig.keyPrice || 0;
  // Falls du je Zylindertyp unterscheiden willst,
  // müsstest du es anders aufteilen. Hier: EINFACH global.
  totalPrice += globalKeyPrice * totalKeys;

  return totalPrice;
}


// Hauptmodell (was der User gewählt hat)
const selectedModelOffer = computed(() => {
  return offers.value.find((o) => o.title === selectedModel.value);
});

// Alternativen
const alternativeOffers = computed(() => {
  return offers.value.filter((o) => {
    if (o.title === selectedModel.value) return false;
    if (!o.canHandleAll) return false;
    if (o.isSchliessanlage !== isSchliessanlage) return false;
    return true;
  });
});

// Neues Ref für die globale Schlüssel-Summe
const totalGlobalKeys = ref(0);

onMounted(async () => {
  if (!anlageNr) return;

  try {
    // 1) POSITIONEN laden
    const positionResponse = await $fetch("/api/sqlgetposition", {
      method: "POST",
      body: { ID: anlageNr },
    });
    positionData.value = positionResponse.queryresult || [];

    // 2) SCHLUESSEL laden
    const schluesselResponse = await $fetch("/api/sqlgetschluessel", {
      method: "POST",
      body: { ID: anlageNr },
    });
    const schluesselData = schluesselResponse.queryresult || [];

    // Summiere "Anzahl" aller Schlüssel-Einträge
    // Bsp: keyPos=1 => Anzahl=5, keyPos=2 => Anzahl=1, ...
    let sumKeys = 0;
    schluesselData.forEach((entry) => {
      sumKeys += Number(entry.Anzahl) || 0;
    });
    totalGlobalKeys.value = sumKeys;

    // 3) Angebote/Offers aufbauen
    // (wie vorher)
    const allModelNames = Object.keys(cylinderModels).filter(
      (modelName) => modelName !== "Kein bestimmtes Modell"
    );

    const tempOffers = allModelNames.map((modelName) => {
      const canHandleAll = modelCanHandleAllZylinders(
        modelName,
        positionData.value
      );
      // -> NEU: Übergib totalGlobalKeys an "calculatePriceForModel"
      const price = calculatePriceForModel(
        modelName,
        positionData.value,
        totalGlobalKeys.value
      );

      return {
        title: modelName,
        price,
        canHandleAll,
        isSchliessanlage: cylinderModels[modelName].isSchliessanlage ?? false,
        image: cylinderModels[modelName].image || "/images/dummy.png",
        alt: modelName,
        features: cylinderModels[modelName].features || [],
      };
    });

    offers.value = tempOffers;
  } catch (error) {
    console.error("Fehler beim Laden der Konfigurationsdaten:", error);
  }
});

</script>

<style scoped>
.systeme-page {
  margin: 50px;
  font-size: 18px;
}

.heading {
  margin: 0px;
  font-size: 24px;
}

.offer-container {
  display: flex;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.offer {
  padding: 15px;
  margin-top: 20px;
  border-radius: 10px;
  width: 280px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.offer:hover {
  transform: translateY(-5px);
}

.offer-image {
  height: auto;
  object-fit: cover;
  padding: 20px;
}

.offer-details {
  padding: 15px;
}

.offer-price {
  font-size: 20px;
  margin-bottom: 10px;
  color: #343a40;
}

.offer-features {
  list-style: none;
  padding: 0;
}

.offer-features li {
  display: flex;
  align-items: center;
}

.offer-features i {
  color: #28a745;
  margin-right: 8px;
}

.select-system-button {
  background-color: #007bff;
  color: white;
  margin-top: 10px;
  width: 100%;
}

.select-system-button:hover {
  background-color: #0056b3;
  transition: 300ms;
}

.offer h3 {
  margin-bottom: 10px;
}

.offer div {
  font-size: 18px;
  font-weight: bold;
}

.back-button {
  background-color: #ffcc00;
  color: #fff;
  margin-top: 20px;
}

.highlighted-offer {
  border: 2px solid #007bff;
  background: #e7f1ff;
}
</style>
