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
            <li v-for="(feature, i) in selectedModelOffer.features" :key="i">
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

    <!-- Alternative Angebote, die laut Kompatibilität ebenfalls passen -->
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
              <li v-for="(feature, i) in offer.features" :key="i">
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

const route = useRoute();
const store = useCylinderStore();

const isSchliessanlage = route.query.isSchliessanlage === "true";
const anlageNr = route.query.anlageNr || "";

// Zwischenspeicher für Positionsdaten
const positionData = ref([]);

// Hier sammeln wir alle fertigen "Angebots"-Objekte
const offers = ref([]);

/** 
 * Der Name des in Pinia (store) ausgewählten Modells (vom Konfigurator),
 * z.B. "ABUS EC550" etc.
 */
const selectedModel = computed(() => store.selectedModel);

// Navigation zurück
const navigateBack = () => {
  window.history.back();
};

// (Beispiel) In den Warenkorb
const addToCart = (systemName, price) => {
  console.log(`System ausgewählt: ${systemName}, Preis: ${price}`);
};

// Rundungs-Helfer
const roundPrice = (price) => {
  return price.toFixed(2);
};

/* 
   Hier kommt die Logik, ob ein Modell sämtliche
   konfigurierten Zylinder (inkl. Größen, Options) bedienen kann.
   Du kannst sie zusätzlich zum reinen "Price-Calc" oder 
   Switch-Case machen.
*/
function modelCanHandleAllZylinders(modelName, positionArray) {
  for (const item of positionArray) {
    if (!checkZylinderCompatibility(modelName, item)) {
      return false;
    }
  }
  return true;
}

function checkZylinderCompatibility(modelName, zylinderItem) {
  const type = mapTypToModelKey(zylinderItem.Typ);

  const cm = cylinderModels[modelName];
  if (!cm || !cm[type] || !cm[type].sizes) return false;

  // Prüfe, ob im "sizes" Array eine Inside/Outside-Kombination existiert,
  // die zu SizeI / SizeA passt
  const matchingSize = cm[type].sizes.find(
    (sz) =>
      Number(sz.inside) === Number(zylinderItem.SizeI) &&
      Number(sz.outside) === Number(zylinderItem.SizeA)
  );
  if (!matchingSize) return false;

  // Falls wir Options (Sicherheitsfunktion etc.) prüfen wollen, wäre hier eine Stelle

  return true;
}

// z.B. "Knaufzylinder (innen)" => "Knaufzylinder"
function mapTypToModelKey(typ) {
  if (typ === "Knaufzylinder (innen)") return "Knaufzylinder";
  return typ;
}

// Die "klassische" Switch-Case-Preisberechnung:
function onCalculatePrices(positionArr) {
  // Variablen für jedes Modell
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

  // Hilfsfunktion (Beispiel)
  const calculatePrice = (item, basePrice, sizeFactorA, sizeFactorI) => {
    let p = basePrice;
    // Höchst vereinfacht:
    p += ((parseInt(item.SizeA) - 30) / 5) * sizeFactorA;
    if (item.SizeI) {
      p += ((parseInt(item.SizeI) - 30) / 5) * sizeFactorI;
    }
    return p * parseInt(item.Anzahl || 1);
  };

  // Durchgehen aller positionen
  positionArr.forEach((item) => {
    switch (item.Typ) {
      case "Doppelzylinder":
        priceAbusTi14 += calculatePrice(item, 11.75, 1.62, 1.62);
        priceAbusA93 += calculatePrice(item, 13.95, 2.4, 2.7);
        priceAbusEC550 += calculatePrice(item, 18.85, 2.1, 2.1);
        priceAbusEC660 += calculatePrice(item, 28.95, 3.4, 3.4);
        priceAbusEC880 += calculatePrice(item, 52.95, 3.5, 3.5);
        priceAbusMagtec1500 += calculatePrice(item, 42.95, 2.5, 2.5);
        priceAbusMagtec2500 += calculatePrice(item, 42.95, 2.5, 2.5);
        priceDomTwido += calculatePrice(item, 73.95, 3, 3);
        priceDomRN += calculatePrice(item, 20.95, 1.9, 2.0);
        priceDomSigma += calculatePrice(item, 43.95, 2.3, 2.2);
        priceIseoR6 += calculatePrice(item, 31.95, 1, 1);
        priceKeso8000 += calculatePrice(item, 110, 6, 6);
        break;

      case "Knaufzylinder (innen)":
        priceAbusA93 += calculatePrice(item, 28.86, 1.8, 1.8);
        priceAbusEC550 += calculatePrice(item, 30.40, 2.5, 2.5);
        priceAbusEC660 += calculatePrice(item, 40.95, 3, 3);
        priceAbusEC880 += calculatePrice(item, 47.95, 1.5, 1.5);
        priceAbusMagtec1500 += calculatePrice(item, 65.95, 3, 3);
        priceAbusMagtec2500 += calculatePrice(item, 65.95, 3, 3);
        priceDomTwido += calculatePrice(item, 71.95, 3, 3);
        priceDomRN += calculatePrice(item, 31.95, 3, 3);
        priceDomSigma += calculatePrice(item, 41.95, 3.2, 3.2);
        priceIseoR6 += calculatePrice(item, 45.95, 1.2, 1.2);
        priceKeso8000 += calculatePrice(item, 111.90, 13, 13);
        break;

      case "Halbzylinder":
        priceAbusTi14 += calculatePrice(item, 9.95, 1.8, 0);
        priceAbusA93 += calculatePrice(item, 10, 1.8, 0);
        priceAbusEC550 += calculatePrice(item, 14.65, 2.1, 0);
        priceAbusEC660 += calculatePrice(item, 20, 3.0, 0);
        priceAbusEC880 += calculatePrice(item, 18, 2.5, 0);
        priceAbusMagtec1500 += calculatePrice(item, 16, 2, 2);
        priceAbusMagtec2500 += calculatePrice(item, 16, 2, 2);
        priceDomTwido += calculatePrice(item, 20, 1.6, 1.8);
        priceDomRN += calculatePrice(item, 21, 1.4, 1.6);
        priceDomSigma += calculatePrice(item, 22, 2.0, 2.0);
        priceIseoR6 += calculatePrice(item, 18, 1.6, 1.9);
        priceKeso8000 += calculatePrice(item, 25, 2.4, 1.9);
        break;

      // ggf. Vorhangschloss, Außenzylinder etc.
    }
  });

  // Baue nun ein Array zurück:
  return {
    "ABUS TI14": priceAbusTi14,
    "ABUS A93": priceAbusA93,
    "ABUS EC550": priceAbusEC550,
    "ABUS EC660": priceAbusEC660,
    "ABUS EC880": priceAbusEC880,
    "ABUS Magtec 1500": priceAbusMagtec1500,
    "ABUS Magtec 2500": priceAbusMagtec2500,
    "DOM IX Twido": priceDomTwido,
    "DOM RN": priceDomRN,
    "DOM RS Sigma": priceDomSigma,
    "ISEO R6": priceIseoR6,
    "KESO 8000": priceKeso8000,
  };
}

// =========== Computed: Hauptangebot =============
const selectedModelOffer = computed(() => {
  return offers.value.find((o) => o.title === selectedModel.value);
});

// =========== Computed: Alternativen ==============
const alternativeOffers = computed(() => {
  // z.B. "schliessanlage" oder "gleichschliessung"
  const neededFlag = isSchliessanlage ? "schliessanlage" : "gleichschliessung";

  return offers.value.filter((o) => {
    // 1) Anderes Modell
    if (o.title === selectedModel.value) return false;
    // 2) Muss 'canHandleAll' sein
    if (!o.canHandleAll) return false;
    // 3) Muss denselben isSchliessanlage-Flag abdecken
    if (!o.suitableFor.includes(neededFlag)) return false;

    return true;
  });
});

// onMounted => Positionen laden => Switch-Case => offers aufbauen
onMounted(async () => {
  if (!anlageNr) return;
  try {
    // 1) Positionen laden
    const positionResponse = await $fetch("/api/sqlgetposition", {
      method: "POST",
      body: { ID: anlageNr },
    });
    positionData.value = positionResponse.queryresult || [];

    // 2) Switch-Case-Preisberechnung
    const priceMap = onCalculatePrices(positionData.value);

    // 3) Für jedes Modell checken wir: canHandleAllZylinders
    // und bauen ein "offer"-Objekt mit Bild, Features und co.
    const canAbusEC550 = modelCanHandleAllZylinders("ABUS EC550", positionData.value);
    const canAbusEC660 = modelCanHandleAllZylinders("ABUS EC660", positionData.value);
    const canAbusEC880 = modelCanHandleAllZylinders("ABUS EC880", positionData.value);
    const canAbusTi14 = modelCanHandleAllZylinders("ABUS Ti14", positionData.value);
    const canAbusA93 = modelCanHandleAllZylinders("ABUS A93", positionData.value);
    const canAbusMagtec1500 = modelCanHandleAllZylinders("ABUS Magtec 1500", positionData.value);
    const canAbusMagtec2500 = modelCanHandleAllZylinders("ABUS Magtec 2500", positionData.value);
    const canDomTwido = modelCanHandleAllZylinders("DOM IX Twido", positionData.value);
    const canDomRN = modelCanHandleAllZylinders("DOM RN", positionData.value);
    const canDomSigma = modelCanHandleAllZylinders("DOM RS Sigma", positionData.value);
    const canIseoR6 = modelCanHandleAllZylinders("ISEO R6", positionData.value);
    const canKeso8000 = modelCanHandleAllZylinders("KESO 8000", positionData.value);

    // 4) Baue das "offers"-Array wie früher
    offers.value = [
      {
        image: "/images/abus-ti14-doppelzylinder-logo-500x500.png",
        alt: "ABUS TI14",
        title: "ABUS Ti14",
        price: priceMap["ABUS TI14"],
        features: ["Robuste Konstruktion", "Einfache Installation", "Lange Lebensdauer"],
        canHandleAll: canAbusTi14,
        suitableFor: ["gleichschliessung"],
      },
      {
        image: "/images/abus-a93-doppelzylinder-logo-500x500.png",
        alt: "ABUS A93",
        title: "ABUS A93",
        price: priceMap["ABUS A93"],
        features: ["Kein Picking", "Verstärkter Kern", "Mehrschlüsseloption"],
        canHandleAll: canAbusA93,
        suitableFor: ["gleichschliessung"],
      },
      {
        image: "/images/abus-ec550-doppelzylinder-logo-500x500.png",
        alt: "ABUS EC550",
        title: "ABUS EC550",
        price: priceMap["ABUS EC550"],
        features: [
          "Zuverlässiger Basisschutz",
          "Anti-Pick und Bohrschutz",
          "Für Wohnhäuser",
        ],
        canHandleAll: canAbusEC550,
        suitableFor: ["gleichschliessung"],
      },
      {
        image: "/images/abus-ec660-doppelzylinder-logo-500x500.png",
        alt: "ABUS EC660",
        title: "ABUS EC660",
        price: priceMap["ABUS EC660"],
        features: [
          "Sicherheitsstufe 2",
          "Bohrschutz",
          "Mehrfachverriegelung",
        ],
        canHandleAll: canAbusEC660,
        suitableFor: ["gleichschliessung"],
      },
      {
        image: "/images/abus-ec880-doppelzylinder-logo-500x500.png",
        alt: "ABUS EC880",
        title: "ABUS EC880",
        price: priceMap["ABUS EC880"],
        features: [
          "Bohr- und Ziehschutz",
          "Wendeschlüssel",
          "Geschäftsgebäude",
        ],
        canHandleAll: canAbusEC880,
        suitableFor: ["gleichschliessung"],
      },
      {
        image: "/images/abus-magtec-doppelzylinder-schluessel-logo-500x500.png",
        alt: "ABUS Magtec 1500",
        title: "ABUS Magtec 1500",
        price: priceMap["ABUS Magtec 1500"],
        features: ["Sicherheitsstufe 1", "Wendeschlüssel", "Bohrschutz"],
        canHandleAll: canAbusMagtec1500,
        suitableFor: ["schliessanlage", "gleichschliessung"],
      },
      {
        image: "/images/abus-magtec-doppelzylinder-schluessel-logo-500x500.png",
        alt: "ABUS Magtec 2500",
        title: "ABUS Magtec 2500",
        price: priceMap["ABUS Magtec 2500"],
        features: ["Sicherheitsstufe 1", "Wendeschlüssel", "Bohrschutz"],
        canHandleAll: canAbusMagtec2500,
        suitableFor: ["schliessanlage", "gleichschliessung"],
      },
      {
        image: "/images/dom-ix-twido-doppelzylinder-schluessel-logo-500x500.png",
        alt: "DOM IX Twido",
        title: "DOM IX Twido",
        price: priceMap["DOM IX Twido"],
        features: [
          "Sicherheitsstufe 1", "Wendeschlüssel", "Bohrschutz"
        ],
        canHandleAll: canDomTwido,
        suitableFor: ["schliessanlage", "gleichschliessung"],
      },
      {
        image: "/images/dom-rn-doppelzylinder-schluessel-logo-500x500.png",
        alt: "DOM RN",
        title: "DOM RN",
        price: priceMap["DOM RN"],
        features: [
          "Manipulationsschutz",
          "Langlebige Materialien",
          "Privat & Gewerblich",
        ],
        canHandleAll: canDomRN,
        suitableFor: ["gleichschliessung"],
      },
      {
        image: "/images/dom-rs-sigma-doppelzylinder-logo-500x500.png",
        alt: "DOM RS Sigma",
        title: "DOM RS Sigma",
        price: priceMap["DOM RS Sigma"],
        features: [
          "Sicherheitsstufe 2",
          "Aufbohrschutz",
          "Patentierter Schlüssel",
        ],
        canHandleAll: canDomSigma,
        suitableFor: ["schliessanlage", "gleichschliessung"],
      },
      {
        image: "/images/iseo-r6-doppelzylinder-schluessel-logo-500x500.png",
        alt: "ISEO R6",
        title: "ISEO R6",
        price: priceMap["ISEO R6"],
        features: [
          "Sicherheitsstufe 2",
          "Patentschutz",
          "Langlebiger Zylinder",
        ],
        canHandleAll: canIseoR6,
        suitableFor: ["gleichschliessung"],
      },
      {
        image: "/images/keso-omega-8000-doppelzylinder-schluessel-logo-500x500.png",
        alt: "KESO 8000",
        title: "KESO 8000",
        price: priceMap["KESO 8000"],
        features: [
          "Sicherheitsstufe 3",
          "Zertifizierte Sicherheit",
          "Schlagschutz",
        ],
        canHandleAll: canKeso8000,
        suitableFor: ["schliessanlage", "gleichschliessung"],
      },
    ];
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
  /* Lighter background */
  border: 1px solid #ddd;
  /* Add a border */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* Soft shadow */
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  /* Hover effect */
}

.offer:hover {
  transform: translateY(-5px);
  /* Lift tile on hover */
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
  /* Checkmark color */
  margin-right: 8px;
}

.select-system-button {
  background-color: #007bff;
  color: white;
  margin-top: 10px;
  width: 100%;
  /* Full width button */
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
