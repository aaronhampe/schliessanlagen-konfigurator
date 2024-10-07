<template>
    <div class="systeme-page">
      <h2>Systemübersicht</h2>
      <div v-if="anlageNr">
        <p>Zuletzt erstellte Anlagennummer: <strong>{{ anlageNr }}</strong></p>
      </div>
      <div v-if="positionData.length">
        <h3>Türpositionen:</h3>
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
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import { useFetch } from 'nuxt/app';
  
  const route = useRoute();
  const anlageNr = route.query.anlageNr || '';
  const positionData = ref([]);
  
  onMounted(async () => {
    if (anlageNr) {
      const { data: positionResponse } = await useFetch(`/api/sqlgetposition`, {
        method: 'POST',
        body: { ID: anlageNr }
      });
      positionData.value = positionResponse.value?.queryresult || [];
    }
  });
  </script>
  
  <style scoped>
  .systeme-page {
    margin: 50px;
    font-size: 18px;
  }
  .position-item {
    background: #f4f4f4;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
  }
  </style>
  