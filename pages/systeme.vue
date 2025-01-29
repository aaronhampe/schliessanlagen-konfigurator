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
            @click="addToCart(selectedModelOffer.title, selectedModelOffer.price, selectedModelOffer.productID)">
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
              @click="addToCart(offer.title, offer.price, offer.productID)">
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

function addToCart(systemName, price, productID) {
  // 1) fetch an den /api/wc-cart-add-item
  fetch("/api/wc-cart-add-item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productID,
      price,
      quantity: 1,
      Anlage: anlageNr,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        console.log("Result:", result);
        // cart_url und cart_key sind in result.data
        const cartUrl = result.data.cart_url || "https://www.stt-shop.de/warenkorb/";
        const cartKey = result.data.cart_key;

        const finalUrl = cartKey
          ? `${cartUrl}?cocart-load-cart=${cartKey}`
          : cartUrl;

        window.location.href = finalUrl;
      }
    })

    .catch((error) => {
      console.log("Es gab einen Fehler bei der Anfrage:", error);
    });
}


onMounted(async () => {
  if (!anlageNr) return;

  try {
    const positionResponse = await $fetch("/api/sqlgetposition", {
      method: "POST",
      body: { ID: anlageNr },
    });
    positionData.value = positionResponse.queryresult || [];

    const schluesselResponse = await $fetch("/api/sqlgetschluessel", {
      method: "POST",
      body: { ID: anlageNr },
    });
    const schluesselData = schluesselResponse.queryresult || [];

    let sumKeys = 0;
    schluesselData.forEach((entry) => {
      sumKeys += Number(entry.Anzahl) || 0;
    });
    totalGlobalKeys.value = sumKeys;

    const allModelNames = Object.keys(cylinderModels).filter(
      (modelName) => modelName !== "Kein bestimmtes Modell"
    );

    const tempOffers = allModelNames.map((modelName) => {
      const modelConfig = cylinderModels[modelName];
      const canHandleAll = modelCanHandleAllZylinders(modelName, positionData.value);
      const price = calculatePriceForModel(
        modelName,
        positionData.value,
        totalGlobalKeys.value
      );

      const productID = modelConfig.productID || null;

      return {
        title: modelName,
        price,
        productID,
        canHandleAll,
        isSchliessanlage: modelConfig.isSchliessanlage ?? false,
        image: modelConfig.image || "/images/dummy.png",
        alt: modelName,
        features: modelConfig.features || [],
      };
    });


    offers.value = tempOffers;
  } catch (error) {
    console.error("Fehler beim Laden der Konfigurationsdaten:", error);
  }
});

</script>

<style>
@import "@/styles/systems.scss";
</style>
