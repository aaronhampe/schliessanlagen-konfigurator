<template>
    <div>
      <pre>{{ data.test[0].Name }}</pre>
      <div>{{ data.test[0] }}</div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useFetch } from '@/composables/useFetch'; // Passen Sie den Pfad entsprechend an
  
  export default {
    name: 'Anlagenliste',
    setup() {
      const data = ref(null);
  
      const fetchData = async () => {
        try {
          const response = await useFetch('/api/sql', {
            method: 'post',
            body: { ID: 12345 }
          });
          data.value = response;
        } catch (error) {
          console.error('Fehler beim Abrufen der Daten:', error);
        }
      };
  
      onMounted(() => {
        fetchData();
      });
  
      return {
        data
      };
    }
  };
  </script>
  
  <style scoped>
  /* Fügen Sie Ihre Stile hier hinzu */
  </style>
  