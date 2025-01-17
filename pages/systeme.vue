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
        <img
          :src="selectedModelOffer.image"
          :alt="selectedModelOffer.alt"
          class="offer-image"
        />
        <div class="offer-details">
          <h3>{{ selectedModelOffer.title }}</h3>
          <div class="offer-price">
            Gesamtpreis:
            <strong>{{ roundPrice(selectedModelOffer.price) }} €</strong>
          </div>
          <ul class="offer-features">
            <li
              v-for="(feature, i) in selectedModelOffer.features || []"
              :key="i"
            >
              <i class="icon-check"></i> {{ feature }}
            </li>
          </ul>
          <UButton
            icon="i-heroicons-shopping-cart-16-solid"
            class="select-system-button"
            @click="addToCart(selectedModelOffer.title, selectedModelOffer.price)"
          >
            System auswählen
          </UButton>
        </div>
      </div>
    </div>

    <!-- Alternative Angebote, die laut Kompatibilität ebenfalls passen -->
    <div v-if="alternativeOffers.length" style="margin-top: 30px;">
      <h2>Weitere passende Angebote</h2>
      <div class="offer-container">
        <div
          class="offer"
          v-for="(offer, index) in alternativeOffers"
          :key="offer.title"
        >
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
            <UButton
              icon="i-heroicons-shopping-cart-16-solid"
              class="select-system-button"
              @click="addToCart(offer.title, offer.price)"
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
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useCylinderStore } from "@/stores/cylinderStores.js";
import cylinderModels from "@/data/cylinderModels.js";

// Router-Parameter
const route = useRoute();
const anlageNr = route.query.anlageNr || "";

// Schließanlage Boolean aus Route
const isSchliessanlage = route.query.isSchliessanlage === "true";

// Pinia-Store
const store = useCylinderStore();

// Das im Konfigurator gewählte Modell:
const selectedModel = computed(() => store.selectedModel);

// Navigation zurück
const navigateBack = () => {
  window.history.back();
};

// In den Warenkorb (Beispiel)
const addToCart = (systemName, price) => {
  console.log(`System ausgewählt: ${systemName}, Preis: ${price}`);
};

// Rundungs-Helfer
const roundPrice = (price) => price.toFixed(2);

// Positionen, die der User im Konfigurator angelegt hat:
const positionData = ref([]);

// Daraus bauen wir später unsere "offers" zusammen
const offers = ref([]);

// --------------------------------------------
// Hilfsfunktionen für die Modell-Kompatibilität
// --------------------------------------------
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

  // Zylindertyp anpassen (Knaufzylinder (innen) => Knaufzylinder)
  const typeKey = mapTypToModelKey(zylinderItem.Typ);

  // Falls das Modell diesen Typ gar nicht hat => kein Match
  if (!modelConfig[typeKey] || !modelConfig[typeKey].sizes) {
    return false;
  }

  // Prüfe Inside/Outside
  const foundMatch = modelConfig[typeKey].sizes.find(
    (sz) =>
      Number(sz.inside) === Number(zylinderItem.SizeI) &&
      Number(sz.outside) === Number(zylinderItem.SizeA)
  );
  if (!foundMatch) return false;

  // Ggf. Options prüfen - hier weglassen oder hinzunehmen
  return true;
}

// Mapped "Knaufzylinder (innen)" => "Knaufzylinder", etc.
function mapTypToModelKey(typ) {
  if (typ === "Knaufzylinder (innen)") return "Knaufzylinder";
  return typ;
}

// --------------------------------------------
// Preiskalkulation (Switch-Case, wie gehabt)
// --------------------------------------------
function calculateModelPrices(positionArr) {
  // Du kannst auch ein Objekt initialisieren und am Ende zurückgeben:
  const priceMap = {};

  // Hier Beispiel wie bisher:
  let priceAbusEC550 = 0;
  let priceAbusEC660 = 0;
  let priceAbusEC880 = 0;
  let priceAbusTi14 = 0;
  let priceAbusA93 = 0;
  let priceAbusMagtec1500 = 0;
  let priceAbusMagtec2500 = 0;
  let priceDomTwido = 0;
  let priceDomRN = 0;
  let priceDomSigma = 0;
  let priceIseoR6 = 0;
  let priceKeso8000 = 0;

  // Beispiel-Helfer
  const calcPrice = (item, base, factorA, factorI) => {
    let p = base;
    p += ((parseInt(item.SizeA) - 30) / 5) * factorA;
    if (item.SizeI) {
      p += ((parseInt(item.SizeI) - 30) / 5) * factorI;
    }
    return p * parseInt(item.Anzahl || 1);
  };

  positionArr.forEach((item) => {
    switch (item.Typ) {
      case "Doppelzylinder":
        priceAbusTi14 += calcPrice(item, 11.75, 1.62, 1.62);
        priceAbusA93 += calcPrice(item, 13.95, 2.4, 2.7);
        priceAbusEC550 += calcPrice(item, 18.85, 2.1, 2.1);
        priceAbusEC660 += calcPrice(item, 28.95, 3.4, 3.4);
        priceAbusEC880 += calcPrice(item, 52.95, 3.5, 3.5);
        priceAbusMagtec1500 += calcPrice(item, 42.95, 2.5, 2.5);
        priceAbusMagtec2500 += calcPrice(item, 42.95, 2.5, 2.5);
        priceDomTwido += calcPrice(item, 73.95, 3, 3);
        priceDomRN += calcPrice(item, 20.95, 1.9, 2.0);
        priceDomSigma += calcPrice(item, 43.95, 2.3, 2.2);
        priceIseoR6 += calcPrice(item, 31.95, 1, 1);
        priceKeso8000 += calcPrice(item, 110, 6, 6);
        break;
      case "Knaufzylinder (innen)":
        priceAbusA93 += calcPrice(item, 28.86, 1.8, 1.8);
        priceAbusEC550 += calcPrice(item, 30.40, 2.5, 2.5);
        priceAbusEC660 += calcPrice(item, 40.95, 3, 3);
        priceAbusEC880 += calcPrice(item, 47.95, 1.5, 1.5);
        priceAbusMagtec1500 += calcPrice(item, 65.95, 3, 3);
        priceAbusMagtec2500 += calcPrice(item, 65.95, 3, 3);
        priceDomTwido += calcPrice(item, 71.95, 3, 3);
        priceDomRN += calcPrice(item, 31.95, 3, 3);
        priceDomSigma += calcPrice(item, 41.95, 3.2, 3.2);
        priceIseoR6 += calcPrice(item, 45.95, 1.2, 1.2);
        priceKeso8000 += calcPrice(item, 111.90, 13, 13);
        break;
      case "Halbzylinder":
        priceAbusTi14 += calcPrice(item, 9.95, 1.8, 0);
        priceAbusA93 += calcPrice(item, 10, 1.8, 0);
        priceAbusEC550 += calcPrice(item, 14.65, 2.1, 0);
        priceAbusEC660 += calcPrice(item, 20, 3.0, 0);
        priceAbusEC880 += calcPrice(item, 18, 2.5, 0);
        priceAbusMagtec1500 += calcPrice(item, 16, 2, 2);
        priceAbusMagtec2500 += calcPrice(item, 16, 2, 2);
        priceDomTwido += calcPrice(item, 20, 1.6, 1.8);
        priceDomRN += calcPrice(item, 21, 1.4, 1.6);
        priceDomSigma += calcPrice(item, 22, 2.0, 2.0);
        priceIseoR6 += calcPrice(item, 18, 1.6, 1.9);
        priceKeso8000 += calcPrice(item, 25, 2.4, 1.9);
        break;
    }
  });

  // In einem Objekt speichern (Key = Modellname)
  priceMap["ABUS Ti14"] = priceAbusTi14;
  priceMap["ABUS A93"] = priceAbusA93;
  priceMap["ABUS EC550"] = priceAbusEC550;
  priceMap["ABUS EC660"] = priceAbusEC660;
  priceMap["ABUS EC880"] = priceAbusEC880;
  priceMap["ABUS Magtec 1500"] = priceAbusMagtec1500;
  priceMap["ABUS Magtec 2500"] = priceAbusMagtec2500;
  priceMap["DOM IX Twido"] = priceDomTwido;
  priceMap["DOM RN"] = priceDomRN;
  priceMap["DOM RS Sigma"] = priceDomSigma;
  priceMap["ISEO R6"] = priceIseoR6;
  priceMap["KESO 8000"] = priceKeso8000;

  return priceMap;
}

// --------------------------------------------
// Hauptangebot & Alternativen
// --------------------------------------------
const selectedModelOffer = computed(() => {
  return offers.value.find((o) => o.title === selectedModel.value);
});

const alternativeOffers = computed(() => {
  return offers.value.filter((o) => {
    // nicht das Hauptmodell
    if (o.title === selectedModel.value) return false;
    // muss canHandleAll sein
    if (!o.canHandleAll) return false;
    // muss denselben isSchliessanlage-Wert haben
    if (o.isSchliessanlage !== isSchliessanlage) return false;
    return true;
  });
});

// --------------------------------------------
// onMounted: Laden, Rechnen, Aufbauen
// --------------------------------------------
// ...

onMounted(async () => {
  if (!anlageNr) return;

  try {
    // 1) positionData laden
    const positionResponse = await $fetch("/api/sqlgetposition", {
      method: "POST",
      body: { ID: anlageNr },
    });
    positionData.value = positionResponse.queryresult || [];

    // 2) PriceMap via Switch-Case
    const priceMap = calculateModelPrices(positionData.value);

    // 3) Filtere "Kein bestimmtes Modell" direkt beim Durchlauf aus.
    //    So erscheint es gar nicht erst in `offers`.
    const allModelNames = Object.keys(cylinderModels).filter(
      (modelName) => modelName !== "Kein bestimmtes Modell"
    );

    // Für jedes Modell in cylinderModels => Erzeuge ein "Offer"-Objekt
    const tempOffers = allModelNames.map((modelName) => {
      const modelConfig = cylinderModels[modelName];
      const canHandleAll = modelCanHandleAllZylinders(modelName, positionData.value);
      const price = priceMap[modelName] || 0;

      return {
        title: modelName,
        price,
        canHandleAll,
        // Wichtig: Wir übernehmen den isSchliessanlage-Wert
        isSchliessanlage: modelConfig.isSchliessanlage ?? false,
        image: modelConfig.image || "/images/dummy.png",
        alt: modelConfig.alt || modelName,
        features: modelConfig.features || [],
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
