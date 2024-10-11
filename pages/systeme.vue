<template>
  <div class="systeme-page">
    <h2>Systemübersicht</h2>
    <div v-if="anlageNr">
      <p>Zuletzt erstellte Anlagennummer: <strong>{{ anlageNr }}</strong></p>
    </div>
    
    <div v-if="positionData.length">
      <h3>Türpositionen:</h3>
      <div>Gesamtpreis: {{ priceAbus550 }} Euro</div>
      <div v-for="(position, index) in positionData" :key="index" class="position-item">
        <p><strong>Position:</strong> {{ position.POS }}</p>
        <p><strong>Türbezeichnung:</strong> {{ position.Bezeichnung }}</p>
        <p><strong>Anzahl:</strong> {{ position.Anzahl }}</p>
        <p><strong>Zylinder-Typ:</strong> {{ position.Typ }}</p>
        <p><strong>Außenmaß:</strong> {{ position.SizeA }}</p>
        <p><strong>Innenmaß:</strong> {{ position.SizeI }}</p>
        <p><strong>Option:</strong> {{ position.Option }}</p>
      </div>
    </div>

    <div v-if="keyData.length">
      <h3>Schlüssel-Konfiguration:</h3>
      <div v-for="(key, index) in keyData" :key="index" class="key-item">
        <p><strong>Schlüsselname:</strong> {{ key.Bezeichnung }}</p>
        <p><strong>Anzahl:</strong> {{ key.Anzahl }}</p>
      </div>
    </div>

    <div v-if="matrixData.length">
      <h3>Zugriffsberechtigungen (Matrix):</h3>
      <div v-for="(entry, index) in matrixData" :key="index" class="matrix-item">
        <p><strong>Tür Position:</strong> {{ entry.POSZylinder }}</p>
        <p><strong>Schlüssel Position:</strong> {{ entry.POSSchluessel }}</p>
        <p><strong>Berechtigung:</strong> {{ entry.Berechtigung ? 'Ja' : 'Nein' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useFetch } from 'nuxt/app';

const route = useRoute();
const anlageNr = route.query.anlageNr || '';

const positionData = ref([]);  // Speichert die Türpositionen
const keyData = ref([]);       // Speichert die Schlüssel-Konfiguration
const matrixData = ref([]);    // Speichert die Berechtigungsmatrix
var priceAbus550 = 0;               // Preis für das 1. System

onMounted(async () => {
  if (anlageNr) {
    try {
      // Lade die Türpositionen
      const positionResponse = await $fetch(`/api/sqlgetposition`, {
        method: 'POST',
        body: { ID: anlageNr }
      });
        
        positionData.value = positionResponse.queryresult || [];
        positionResponse.queryresult.forEach(item => {
                const zeile = item.POS - 1; // Annahme: POSZylinder beginnt bei 1
                if (item.Typ==='Doppelzylinder') {
                     priceAbus550=priceAbus550+18.85;
                     priceAbus550=priceAbus550+((parseInt(item.SizeA)-30)/5)*2.1;
                     priceAbus550=priceAbus550+((parseInt(item.SizeI)-30)/5)*2.1;
                     priceAbus550=priceAbus550*parseInt(item.Anzahl);
                 }
                if (item.Typ==='Halbzylinder') {
                     priceAbus550=priceAbus550+14.65;
                     priceAbus550=priceAbus550+((parseInt(item.SizeA)-30)/5)*2.1;
                     priceAbus550=priceAbus550*parseInt(item.Anzahl);
                 }

                //this.rows[zeile][0].doorDesignation = item.Bezeichnung;
                //this.rows[zeile][0].doorquantity = item.Anzahl || 1;
                //this.rows[zeile][0].type = item.Typ || '';
                //this.rows[zeile][0].outside = item.SizeA || '';
                //this.rows[zeile][0].inside = item.SizeI || '';
                //this.rows[zeile][0].options = item.Option || '';
    });


      // Lade die Schlüssel-Konfiguration
      const { data: keyResponse, error: keyError } = await useFetch(`/api/sqlgetschluessel`, {
        method: 'POST',
        body: { ID: anlageNr }
      });
      console.log(keyResponse.value);
      if (keyError) {
        console.error('Fehler beim Laden der Schlüssel-Konfiguration:', keyError);
      } else {
        keyData.value = keyResponse.value?.queryresult || [];
      }

      // Lade die Matrix-Daten (Berechtigungen)
      const { data: matrixResponse, error: matrixError } = await useFetch(`/api/sqlgetmatrix`, {
        method: 'POST',
        body: { ID: anlageNr }
      });
      if (matrixError) {
        console.error('Fehler beim Laden der Matrix-Daten:', matrixError);
      } else {
        matrixData.value = matrixResponse.value?.queryresult || [];
      }

    } catch (error) {
      console.error('Fehler beim Laden der Konfigurationsdaten:', error);
    }
  }
});
</script>

<style scoped>
.systeme-page {
  margin: 50px;
  font-size: 18px;
}

.position-item, .key-item, .matrix-item {
  background: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
