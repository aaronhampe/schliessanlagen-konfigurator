<template>
    <div class="key-column">
      <!-- Schlüsselname -->
      <input
        type="text"
        readonly
        class="key-name"
        v-model="keyItem.keyname"
        :style="keyNameStyle"
      />
  
      <!-- Schlüsselanzahl -->
      <input
        v-if="isSchliessanlage && isFirstRow"
        type="number"
        min="1"
        class="key-quantity"
        v-model="keyItem.keyquantity"
        :style="keyQuantityStyle"
      />
  
      <!-- Bearbeiten Button -->
      <UButton
        v-if="isFirstRow"
        icon="i-heroicons-pencil"
        size="sm"
        color="sky"
        variant="solid"
        @click="openModal"
        :style="editButtonStyle"
      />
  
      <!-- Checkbox -->
      <UCheckbox
        v-model="keyItem.checked"
        color="blue"
        variant="solid"
        :disabled="!isSchliessanlage"
      />
  
      <!-- Aktionen -->
      <div v-if="isLastRow" class="key-actions">
        <UButton
          icon="i-heroicons-trash"
          size="sm"
          color="red"
          variant="solid"
          @click="deleteKey"
          :style="deleteButtonStyle"
        />
        <UButton
          icon="i-heroicons-document-duplicate"
          size="sm"
          color="sky"
          variant="outline"
          @click="duplicateKey"
          :style="duplicateButtonStyle"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits, computed } from 'vue';
  import { UButton, UCheckbox } from 'nuxt-ui';
  
  interface KeyItem {
    keyname: string;
    keyquantity: number;
    checked: boolean;
  }
  
  const props = defineProps<{
    keyItem: KeyItem;
    rowIndex: number;
    colIndex: number;
    isFirstRow: boolean;
    isLastRow: boolean;
    isSchliessanlage: boolean;
  }>();
  
  const emits = defineEmits<['openModal', 'deleteKey', 'duplicateKey']>();
  
  function openModal() {
    emits('openModal', props.colIndex);
  }
  
  function deleteKey() {
    emits('deleteKey', props.colIndex);
  }
  
  function duplicateKey() {
    emits('duplicateKey', props.colIndex);
  }
  
  const keyNameStyle = computed(() => ({
    writingMode: 'vertical-rl',
    position: 'absolute',
    marginTop: props.isSchliessanlage ? '-20.8em' : '-16em',
    padding: '4px',
    height: '150px',
    cursor: 'default',
    border: '1px solid lightgray',
    borderRadius: '8px',
  }));
  
  const keyQuantityStyle = {
    position: 'absolute',
    marginTop: '-11.8em',
    width: '33px',
    height: '20px',
    fontSize: '12px',
    border: '1px dotted lightblue',
    borderRadius: '4px',
  };
  
  const editButtonStyle = {
    writingMode: 'vertical-rl',
    position: 'absolute',
    marginTop: '-4.4em',
    color: 'white',
  };
  
  const deleteButtonStyle = {
    writingMode: 'vertical-rl',
    position: 'absolute',
    marginTop: '5.5em',
    color: 'white',
  };
  
  const duplicateButtonStyle = {
    writingMode: 'vertical-rl',
    position: 'absolute',
    marginTop: '11.4em',
  };
  </script>
  
  <style scoped>
  .key-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  
  .key-name {
    width: 30px;
    overflow: hidden;
    text-align: center;
    border: none;
    background: none;
  }
  
  .key-quantity {
    width: 33px;
    text-align: center;
  }
  
  .key-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  </style>
  