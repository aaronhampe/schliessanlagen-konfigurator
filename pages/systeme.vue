<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useCylinderStore } from "@/stores/cylinderStores.js";
import cylinderModels from "@/data/cylinderModels.js";
import { mapOptionToUpchargeKey, mapTypToModelKey } from "@/data/utils/optionMapping.js";

const route = useRoute();
const router = useRouter();
const anlageNr = route.query.anlageNr || "";
// Aus URL lesen -> kann "true" oder "false" sein
const isSchliessanlage = route.query.isSchliessanlage === "true";

const store = useCylinderStore();
const selectedModel = computed(() => store.selectedModel);

const positionData = ref([]);
const matrix = ref([]);            // <--- NEU
const totalGlobalKeys = ref(0);
const offers = ref([]);

// Für "Zurück"-Button
const navigateBack = () => {
  router.push({
    name: "index",
    query: { anlageNr: anlageNr },
  });
};

function roundPrice(price) {
  return price.toFixed(2);
}

// Prüfe, ob dieses Modell alle Zylinder (Typ+Größe) kann
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
  // 1) Typ checken
  if (!modelConfig[typeKey]) {
    return false;
  }
  // 2) Größe checken
  const foundSize = modelConfig[typeKey].sizes.find(
    (sz) =>
      Number(sz.inside) === Number(zylinderItem.SizeI) &&
      Number(sz.outside) === Number(zylinderItem.SizeA)
  );
  if (!foundSize) {
    return false;
  }

  // 3) OPTIONS checken
  //    Hole das Array ALLER möglichen Options:
  const validOptions = modelConfig[typeKey].options || [];
  //    Auseinanderparsen
  const selectedOptions = (zylinderItem.Option || "")
    .split(",")
    .map((s) => s.trim())
    .filter((o) => o);

  //    Prüfe jede ausgewählte Option, ob sie im "validOptions"-Array steht
  for (const opt of selectedOptions) {
    if (!validOptions.includes(opt)) {
      // => Das Modell kennt diese Option nicht
      return false;
    }
  }

  // Wenn wir hier ankommen, ist Typ/Größe/Optionen alle kompatibel
  return true;
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

// In den Warenkorb legen (gleich geblieben)
function addToCart(systemName, price, productID) {
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
    .then((r) => r.json())
    .then((result) => {
      if (result.success) {
        const cartUrl = result.data.cart_url || "https://www.stt-shop.de/warenkorb/";
        const cartKey = result.data.cart_key;
        const finalUrl = cartKey ? `${cartUrl}?cocart-load-cart=${cartKey}` : cartUrl;
        window.location.href = finalUrl;
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
    const positionResponse = await $fetch("/api/sqlgetposition", {
      method: "POST",
      body: { ID: anlageNr },
    });
    positionData.value = positionResponse.queryresult || [];

    // 2) Schlüssel
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

    // 3) Matrix (NEU!)
    const matrixResponse = await $fetch("/api/sqlgetmatrix", {
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
      const canHandleAll = modelCanHandleAllZylinders(modelName, positionData.value);
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

<template>
  <div class="systeme-page">
    <h2>Systemübersicht</h2>
    <div v-if="anlageNr">
      <p>
        Zuletzt erstellte Anlagennummer: <strong>{{ anlageNr }}</strong>
      </p>
    </div>

    <!-- Haupt-Angebot -->
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
          <UButton icon="i-heroicons-shopping-cart-16-solid" class="select-system-button" @click="addToCart(
      selectedModelOffer.title,
      selectedModelOffer.price,
      selectedModelOffer.productID
    )">
            System auswählen
          </UButton>
        </div>
      </div>
    </div>

    <!-- Alternative Angebote -->
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

<style>
@import "@/styles/systems.scss";
</style>