<template>
  <div class="systeme-page">
    <h2>Systemübersicht</h2>
    <div v-if="anlageNr">
      <!--240742-->
      <p>
        Zuletzt erstellte Anlagennummer: <strong>{{ anlageNr }}</strong>
      </p>
    </div>
    <h2 class="heading">Folgende Systeme passen zu Ihren Anforderungen:</h2>
    <div class="offer-container" v-if="positionData.length">
      <div class="offer" v-for="(offer, index) in filteredOffers" :key="index">
        <img :src="offer.image" :alt="offer.alt" class="offer-image" />
        <div class="offer-details">
          <h3>{{ offer.title }}</h3>
          <div class="offer-price">
            Gesamtpreis: <strong>{{ roundPrice(offer.price) }} €</strong>
          </div>
          <ul class="offer-features">
            <li v-for="(feature, i) in offer.features" :key="i">
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

    <UButton class="back-button" @click="navigateBack"
      >Zurück zum Konfigurator</UButton
    >
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";

const route = useRoute();
const isSchliessanlage = route.query.isSchliessanlage === 'true'; 
const anlageNr = route.query.anlageNr || "";
const navigateBack = () => {
  window.history.back();
};

const addToCart = (systemName, price) => {
  console.log(`System ausgewählt: ${systemName}, Preis: ${price}`);
  // Add functionality to add system to cart
};

const positionData = ref([]);
const offers = ref([]);

var priceAbusEC550 = 0;
var priceAbusEC660 = 0;
var priceAbusEC880 = 0;
var priceAbusTi14 = 0;
var priceAbusA93 = 0;
var priceAbusMagtec = 0;
var priceDomTwido = 0;
var priceDomRN = 0;
var priceDomSigma = 0;
var priceIseoR6 = 0;
var priceKeso8000 = 0;

const roundPrice = (price) => {
  return price.toFixed(2);
};

const filteredOffers = computed(() => {
  return offers.value.filter((offer) =>
    isSchliessanlage
      ? offer.suitableFor.includes("schliessanlage")
      : offer.suitableFor.includes("gleichschliessung")
  );
});


const calculatePrice = (item, basePrice, sizeFactorA, sizeFactorI) => {
  let price = basePrice;
  price += ((parseInt(item.SizeA) - 30) / 5) * sizeFactorA;
  if (item.SizeI) {
    price += ((parseInt(item.SizeI) - 30) / 5) * sizeFactorI;
  }
  return price * parseInt(item.Anzahl);
};

onMounted(async () => {
  if (anlageNr) {
    try {
      const positionResponse = await $fetch(`/api/sqlgetposition`, {
        method: "POST",
        body: { ID: anlageNr },
      });
      positionData.value = positionResponse.queryresult || [];

      positionResponse.queryresult.forEach((item) => {
        switch (item.Typ) {
          case "Doppelzylinder":
            priceAbusTi14 += calculatePrice(item, 11.75, 1.62, 1.62); //done
            priceAbusA93 += calculatePrice(item, 14, 2.4, 2.7); //done
            priceAbusEC550 += calculatePrice(item, 18.85, 2.1, 2.45); //done
            priceAbusEC660 += calculatePrice(item, 25, 3.0, 3.0);
            priceAbusEC880 += calculatePrice(item, 22, 2.5, 2.5);
            priceAbusMagtec += calculatePrice(item, 22, 2, 2); 
            priceDomTwido += calculatePrice(item, 23, 2.2, 2.1);
            priceDomRN += calculatePrice(item, 21, 1.9, 2.0); 
            priceDomSigma += calculatePrice(item, 24, 2.3, 2.2); 
            priceIseoR6 += calculatePrice(item, 16, 1.8, 1.9); 
            priceKeso8000 += calculatePrice(item, 25, 2.4, 2.3); 

            break;
          case "Halbzylinder":
            priceAbusTi14 += calculatePrice(item, 9.95, 1.8, 0);
            priceAbusA93 += calculatePrice(item, 10, 1.8, 0);
            priceAbusEC550 += calculatePrice(item, 14.65, 2.1, 0);
            priceAbusEC660 += calculatePrice(item, 20, 3.0, 0);
            priceAbusEC880 += calculatePrice(item, 18, 2.5, 0);
            priceAbusMagtec += calculatePrice(item, 16, 2, 2); 
            priceDomTwido += calculatePrice(item, 20, 1.6, 1.8);
            priceDomRN += calculatePrice(item, 21, 1.4, 1.6); 
            priceDomSigma += calculatePrice(item, 22, 2.0, 2.0); 
            priceIseoR6 += calculatePrice(item, 18, 1.6, 1.9); 
            priceKeso8000 += calculatePrice(item, 25, 2.4, 1.9); 
            break;
        }
      });

      //Zylinder Modelle

      offers.value = [
        {
          image: "/images/abus-ti14-doppelzylinder-logo-500x500.png",
          alt: "ABUS TI14",
          title: "ABUS TI14",
          price: priceAbusTi14,
          features: [
            "Robuste Konstruktion",
            "Einfache Installation",
            "Lange Lebensdauer",
          ],
          suitableFor: ["gleichschliessung"], // Für beide Konfigurationen geeignet
        },

        {
          image: "/images/abus-a93-doppelzylinder-logo-500x500.png",
          alt: "ABUS A93",
          title: "ABUS A93",
          price: priceAbusA93,
          features: ["Kein Picking", "Verstärkter Kern", "Mehrschlüsseloption"],
          suitableFor: ["gleichschliessung"],
        },

        {
          image: "/images/abus-ec550-doppelzylinder-logo-500x500.png",
          alt: "ABUS EC550",
          title: "ABUS EC550",
          price: priceAbusEC550,
          features: [
            "Zuverlässiger Basisschutz",
            "Anti-Pick und Bohrschutz",
            "Für Wohnhäusern",
          ],
          suitableFor: ["gleichschliessung"], // Für beide Optionen geeignet
        },

        {
          image: "/images/abus-ec660-doppelzylinder-logo-500x500.png",
          alt: "ABUS EC660",
          title: "ABUS EC660",
          price: priceAbusEC660,
          features: [
            "Sicherheitsstufe 2",
            "Bohrschutz",
            "Mehrfachverriegelung",
          ],
          suitableFor: ["gleichschliessung"], // Nur für Gleichschließungen geeignet
        },

        {
          image: "/images/abus-ec880-doppelzylinder-logo-500x500.png",
          alt: "ABUS EC880",
          title: "ABUS EC880",
          price: priceAbusEC880,
          features: [
            "Bohr- und Ziehschutz",
            "Wendeschlüssel",
            "Geschäftsgebäude",
          ],
          suitableFor: ["gleichschliessung"], // Für beide Optionen geeignet
        },

        {
          image: "/images/abus-magtec-doppelzylinder-schluessel-logo-500x500.png",
          alt: "ABUS Magtec",
          title: "ABUS Magtec",
          price: priceAbusMagtec,
          features: ["Sicherheitsstufe 1", "Wendeschlüssel", "Bohrschutz"],
          suitableFor: ["schliessanlage", "gleichschliessung"], // Nur für Schließanlagen geeignet
        },

        {
          image: "/images/dom-ix-twido-doppelzylinder-schluessel-logo-500x500.png",
          alt: "DOM IX Twido",
          title: "DOM IX Twido",
          price: priceDomTwido,
          features: [
            "Hoher Kopierschutz",
            "Modulare Bauweise",
            "Komplexe Schließanlagen",
          ],
          suitableFor: ["schliessanlage"], // Nur für Schließanlagen geeignet
        },

        {
          image: "/images/dom-rn-doppelzylinder-schluessel-logo-500x500.png",
          alt: "DOM RN",
          title: "DOM RN",
          price: priceDomRN,
          features: [
            "Manipulationsschutz",
            "Langlebige Materialien",
            "Privat & Gewerblich",
          ],
          suitableFor: ["gleichschliessung"], // Für Schließanlagen und Gleichschließungen geeignet
        },

        {
          image: "/images/dom-rs-sigma-doppelzylinder-logo-500x500.png",
          alt: "DOM RS Sigma",
          title: "DOM RS Sigma",
          price: priceDomSigma,
          features: [
            "Sicherheitsstufe 2",
            "Aufbohrschutz",
            "Patentierter Schlüssel",
          ],
          suitableFor: ["schliessanlage", "gleichschliessung"], // Nur für Schließanlagen geeignet
        },

        {
          image: "/images/iseo-r6-doppelzylinder-schluessel-logo-500x500.png",
          alt: "ISEO R6",
          title: "ISEO R6",
          price: priceIseoR6,
          features: [
            "Sicherheitsstufe 2",
            "Patentschutz",
            "Langlebiger Zylinder",
          ],
          suitableFor: ["gleichschliessung"], // Für Gleichschließung geeignet
        },

        {
          image: "/images/keso-omega-8000-doppelzylinder-schluessel-logo-500x500.png",
          alt: "KESO 8000",
          title: "KESO 8000",
          price: priceKeso8000,
          features: [
            "Sicherheitsstufe 3",
            "Zertifizierte Sicherheit",
            "Schlagschutz",
          ],
          suitableFor: ["schliessanlage"], // Für beide geeignet
        },
      ];
    } catch (error) {
      console.error("Fehler beim Laden der Konfigurationsdaten:", error);
    }
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
  background: #f8f9fa; /* Lighter background */
  border: 1px solid #ddd; /* Add a border */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow */
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease; /* Hover effect */
}

.offer:hover {
  transform: translateY(-5px); /* Lift tile on hover */
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
  color: #28a745; /* Checkmark color */
  margin-right: 8px;
}

.select-system-button {
  background-color: #007bff;
  color: white;
  margin-top: 10px;
  width: 100%; /* Full width button */
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

.select-system-button {
  background-color: #007bff;
  color: white;
  margin-top: 10px;
  width: auto;
}

.select-system-button:hover {
  background-color: #0c5baf;
  transition: 300ms;
}

@media (max-width: 1024px) {
  .offer {
    flex: 1 1 calc(50% - 20px);
  }
}

@media (max-width: 768px) {
  .offer {
    flex: 1 1 100%;
  }
}
</style>
