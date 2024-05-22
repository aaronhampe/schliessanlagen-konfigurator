<template>
  <div>
    <h1>Anlagen</h1>
    <ul>
      <li v-for="anlage in anlagen" :key="anlage.id">{{ anlage.data }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const anlagen = ref([]);

const fetchAnlagen = async () => {
  try {
    const response = await fetch('/api/anlagen');
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    anlagen.value = data.anlagen;
  } catch (error) {
    console.error('Error fetching anlagen:', error);
  }
};

onMounted(fetchAnlagen);
</script>
