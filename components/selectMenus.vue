<!-- SelectMenus.vue -->
<template>
    <div class="select-menus">
      <!-- Modell Auswahl -->
      <select v-model="store.selectedModel" @change="store.setModel($event.target.value)">
        <option value="" disabled>Wählen Sie ein Modell</option>
        <option v-for="model in store.availableModels" :key="model" :value="model">
          {{ model }}
        </option>
      </select>
  
      <!-- Typ Auswahl -->
      <select v-if="store.availableTypes.length" v-model="store.selectedType" @change="store.setType($event.target.value)">
        <option value="" disabled>Wählen Sie einen Typ</option>
        <option v-for="type in store.availableTypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
  
      <!-- Innengröße Auswahl -->
      <select 
        v-if="store.availableInsideSizes.length"
        v-model="store.selectedInsideSize" 
        @change="store.setInsideSize(parseInt($event.target.value))"
      >
        <option value="" disabled>Wählen Sie eine Innengröße</option>
        <option v-for="size in store.availableInsideSizes" :key="size" :value="size">
          {{ size }} mm
        </option>
      </select>
  
      <!-- Außengröße Auswahl -->
      <select 
        v-if="store.availableOutsideSizes.length"
        v-model="store.selectedOutsideSize" 
        @change="store.setOutsideSize(parseInt($event.target.value))"
      >
        <option value="" disabled>Wählen Sie eine Außengröße</option>
        <option v-for="size in store.availableOutsideSizes" :key="size" :value="size">
          {{ size }} mm
        </option>
      </select>
  
      <!-- Optionen Auswahl -->
      <template v-for="(values, category) in store.availableOptions" :key="category">
        <select 
          v-model="store.selectedOptions[category]"
          @change="store.setOption(category, $event.target.value)"
        >
          <option :value="null" disabled>Wählen Sie {{ category }}</option>
          <option v-for="value in values" :key="value" :value="value">
            {{ value }}
          </option>
        </select>
      </template>
    </div>
  </template>
  
  <script setup>
  import { useCylinderStore } from './stores/cylinderStores.js'
  
  const store = useCylinderStore()
  </script>
  