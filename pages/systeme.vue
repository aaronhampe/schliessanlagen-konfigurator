<template>
  <div class="systeme-page">
    <h2>Systemübersicht</h2>
    <div v-if="anlageNr">
      <p>Zuletzt erstellte Anlagennummer: <strong>{{ anlageNr }}</strong></p>
    </div>

    <!-- Displaying the calculated offers for ABUS EC550, EC660, and ABUS 880 -->
    <div class="offer-container" v-if="positionData.length">
      <!-- ABUS EC550 Offer -->
      <div class="offer">
        <h3>Angebot für ABUS EC550:</h3>
        <img src="/image/abus-ec550-300x300.webp" alt="ABUS EC550" class="offer-image" />
        <div>Gesamtpreis ABUS EC550: <strong>{{ roundPrice(priceAbus550) }}</strong> Euro</div>
        <ul>
          <li>Platzhalter: Feature 1</li>
          <li>Platzhalter: Feature 2</li>
          <li>Platzhalter: Feature 3</li>
        </ul>
        <UButton icon="i-heroicons-shopping-cart-16-solid" class="select-system-button" @click="addToCart('ABUS EC550', priceAbus550)">
          System auswählen
        </UButton>
      </div>

      <!-- ABUS EC660 Offer -->
      <div class="offer">
        <h3>Angebot für ABUS EC660:</h3>
        <img src="/image/abus-ec660-300x300.webp" alt="ABUS EC660" class="offer-image" />
        <div>Gesamtpreis ABUS EC660: <strong>{{ roundPrice(priceAbus660) }}</strong> Euro</div>
        <ul>
          <li>Platzhalter: Feature 1</li>
          <li>Platzhalter: Feature 2</li>
          <li>Platzhalter: Feature 3</li>
        </ul>
        <UButton icon="i-heroicons-shopping-cart-16-solid" class="select-system-button" @click="addToCart('ABUS EC660', priceAbus660)">
          System auswählen
        </UButton>
      </div>

      <!-- ABUS 880 Offer -->
      <div class="offer">
        <h3>Angebot für ABUS 880:</h3>
        <img src="/image/abus-ec880-300x300.webp" alt="ABUS 880" class="offer-image" />
        <div>Gesamtpreis ABUS 880: <strong>{{ roundPrice(priceAbus880) }}</strong> Euro</div>
        <ul>
          <li>Platzhalter: Feature 1</li>
          <li>Platzhalter: Feature 2</li>
          <li>Platzhalter: Feature 3</li>
        </ul>
        <UButton icon="i-heroicons-shopping-cart-16-solid" class="select-system-button" @click="addToCart('ABUS 880', priceAbus880)">
          System auswählen
        </UButton>
      </div>
    </div>

    <UButton class="back-button" @click="navigateBack">Zurück zum Konfigurator</UButton>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useFetch } from "nuxt/app";

const route = useRoute();
const anlageNr = route.query.anlageNr || "";
const navigateBack = () => {
  window.history.back();
};

const addToCart = (systemName, price) => {
  console.log(`System ausgewählt: ${systemName}, Preis: ${price}`);
  // Add functionality to add system to cart
};

const positionData = ref([]);
const keyData = ref([]);
const matrixData = ref([]);
var priceAbus550 = 0;
var priceAbus660 = 0;
var priceAbus880 = 0;

const roundPrice = (price) => {
  return price.toFixed(2);
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
        if (item.Typ === "Doppelzylinder") {
          priceAbus550 += 18.85;
          priceAbus550 += ((parseInt(item.SizeA) - 30) / 5) * 2.1;
          priceAbus550 += ((parseInt(item.SizeI) - 30) / 5) * 2.1;
          priceAbus550 *= parseInt(item.Anzahl);
        }
        if (item.Typ === "Halbzylinder") {
          priceAbus550 += 14.65;
          priceAbus550 += ((parseInt(item.SizeA) - 30) / 5) * 2.1;
          priceAbus550 *= parseInt(item.Anzahl);
        }

        if (item.Typ === "Doppelzylinder") {
          priceAbus660 += 25.0;
          priceAbus660 += ((parseInt(item.SizeA) - 30) / 5) * 3.0;
          priceAbus660 += ((parseInt(item.SizeI) - 30) / 5) * 3.0;
          priceAbus660 *= parseInt(item.Anzahl);
        }
        if (item.Typ === "Halbzylinder") {
          priceAbus660 += 20.0;
          priceAbus660 += ((parseInt(item.SizeA) - 30) / 5) * 3.0;
          priceAbus660 *= parseInt(item.Anzahl);
        }

        if (item.Typ === "Doppelzylinder") {
          priceAbus880 += 22.0;
          priceAbus880 += ((parseInt(item.SizeA) - 30) / 5) * 2.5;
          priceAbus880 += ((parseInt(item.SizeI) - 30) / 5) * 2.5;
          priceAbus880 *= parseInt(item.Anzahl);
        }
        if (item.Typ === "Halbzylinder") {
          priceAbus880 += 18.0;
          priceAbus880 += ((parseInt(item.SizeA) - 30) / 5) * 2.5;
          priceAbus880 *= parseInt(item.Anzahl);
        }
      });

      const { data: keyResponse, error: keyError } = await useFetch(`/api/sqlgetschluessel`, {
        method: "POST",
        body: { ID: anlageNr },
      });
      if (keyError) {
        console.error("Fehler beim Laden der Schlüssel-Konfiguration:", keyError);
      } else {
        keyData.value = keyResponse.value?.queryresult || [];
      }

      const { data: matrixResponse, error: matrixError } = await useFetch(`/api/sqlgetmatrix`, {
        method: "POST",
        body: { ID: anlageNr },
      });
      if (matrixError) {
        console.error("Fehler beim Laden der Matrix-Daten:", matrixError);
      } else {
        matrixData.value = matrixResponse.value?.queryresult || [];
      }
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

.offer-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.offer {
  background: #e9ecef;
  padding: 15px;
  margin-top: 20px;
  border-radius: 10px;
  flex: 1 1 calc(33.333% - 20px);
}

.offer h3 {
  margin-bottom: 10px;
}

.offer div {
  font-size: 18px;
  font-weight: bold;
}

.offer-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 10px;
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
