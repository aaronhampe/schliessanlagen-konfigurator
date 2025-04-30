<!-- Verbessertes ColumnModal.vue -->
<template>
  <UModal class="improved-column-modal" v-model="isOpenC">
    <div class="column-modal-content">
      <div class="column-modal-header">
        <div class="modal-title-wrapper">
          <i class="i-heroicons-key modal-icon"></i>
          <h6 class="modal-title">Schlüssel benennen</h6>
        </div>
        <UButton 
          class="close-button" 
          color="gray" 
          variant="ghost" 
          icon="i-heroicons-x-mark" 
          @click="closeModal" 
        />
      </div>
      
      <div class="column-modal-body">
        <div class="input-group">
          <label for="keyName" class="input-label">Schlüsselbezeichnung:</label>
          <div class="input-wrapper">
            <UInput
              id="keyName"
              autofocus
              class="key-name-input"
              v-model="columnName"
              color="amber"
              placeholder="z.B. Haustürschlüssel"
            />
            <div class="input-hint">Vergeben Sie einen eindeutigen Namen für den Schlüssel</div>
          </div>
        </div>
        
        <div class="name-suggestions" v-if="suggestions.length > 0">
          <div class="suggestions-label">Vorschläge:</div>
          <div class="suggestion-chips">
            <button 
              v-for="suggestion in suggestions" 
              :key="suggestion"
              class="suggestion-chip"
              @click="selectSuggestion(suggestion)"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="column-modal-footer">
        <UButton
          class="cancel-button"
          color="gray"
          variant="soft"
          @click="closeModal"
        >
          Abbrechen
        </UButton>
        <UButton
          class="save-button"
          color="amber"
          variant="solid"
          icon="i-heroicons-check"
          @click="saveKey"
        >
          Speichern
        </UButton>
      </div>
    </div>
  </UModal>
</template>

<script>
export default {
  name: "ColumnModal",
  props: ["columnId"],
  data() {
    return {
      isOpenC: false,
      columnName: "",
      suggestions: [
        "Hauptschlüssel",
        "Elternschlüssel", 
        "Kinderschlüssel",
        "Zweitschlüssel",
        "Ersatzschlüssel",
        "Gästeschlüssel"
      ]
    };
  },
  methods: {
    selectSuggestion(suggestion) {
      this.columnName = suggestion;
    },
    saveKey() {
      if (this.columnName.trim()) {
        this.$emit("update-column-name", this.columnName);
        this.$emit("close-this-modal", this.isOpenC);
      }
    },
    closeModal() {
      // Nur emittieren wenn ein Name eingegeben wurde
      if (this.columnName.trim()) {
        this.$emit("update-column-name", this.columnName);
      }
      this.$emit("close-this-modal", this.isOpenC);
    }
  }
};
</script>

<style scoped>
.improved-column-modal :deep(.u-modal-overlay) {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
}

.improved-column-modal :deep(.u-modal-container) {
  align-items: center;
  padding: 1rem;
}

.improved-column-modal :deep(.u-modal-content) {
  background: transparent;
  padding: 0;
  max-width: 480px;
  width: 95%;
  border-radius: 12px;
  overflow: hidden;
}

.column-modal-content {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.column-modal-header {
  background-color: #fef3c7;
  border-bottom: 1px solid #fde68a;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .modal-title-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .modal-icon {
    color: #d97706;
    font-size: 20px;
  }
  
  .modal-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #92400e;
    margin: 0;
  }
  
  .close-button {
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
}

.column-modal-body {
  padding: 24px 20px;
  
  .input-group {
    margin-bottom: 16px;
  }
  
  .input-label {
    display: block;
    font-size: 0.95rem;
    font-weight: 500;
    color: #4b5563;
    margin-bottom: 8px;
  }
  
  .input-wrapper {
    position: relative;
  }
  
  .key-name-input {
    width: 100%;
    
    :deep(.u-input__field) {
      border-color: #d1d5db;
      transition: all 0.2s ease;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 1rem;
      
      &:hover {
        border-color: #9ca3af;
      }
      
      &:focus {
        border-color: #f59e0b;
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
      }
    }
  }
  
  .input-hint {
    font-size: 0.8rem;
    color: #6b7280;
    margin-top: 6px;
  }
  
  .name-suggestions {
    margin-top: 16px;
    
    .suggestions-label {
      font-size: 0.85rem;
      font-weight: 500;
      color: #4b5563;
      margin-bottom: 8px;
    }
    
    .suggestion-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .suggestion-chip {
        background-color: #f3f4f6;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 6px 12px;
        font-size: 0.85rem;
        font-weight: 500;
        color: #4b5563;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
          background-color: #fef3c7;
          border-color: #fde68a;
          color: #92400e;
          transform: translateY(-1px);
        }
      }
    }
  }
}

.column-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  
  .save-button, .cancel-button {
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  }
  
  .save-button {
    background-color: #f59e0b;
    color: white;
    
    &:hover {
      background-color: #d97706;
    }
  }
  
  .cancel-button {
    background-color: #f3f4f6;
    color: #4b5563;
    
    &:hover {
      background-color: #e5e7eb;
    }
  }
}

/* Responsive Anpassungen */
@media (max-width: 640px) {
  .column-modal-header {
    padding: 12px 16px;
    
    .modal-title {
      font-size: 1rem;
    }
  }
  
  .column-modal-body {
    padding: 16px;
  }
  
  .column-modal-footer {
    padding: 12px 16px;
    
    .save-button, .cancel-button {
      padding: 8px 12px;
      font-size: 0.875rem;
    }
  }
  
  .name-suggestions {
    .suggestion-chips {
      .suggestion-chip {
        padding: 4px 10px;
        font-size: 0.8rem;
      }
    }
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .column-modal-content {
    background-color: #1f2937;
  }
  
  .column-modal-header {
    background-color: #fef3c7;
    border-bottom-color: #fde68a;
    
    .modal-title {
      color: #92400e;
    }
    
    .modal-icon {
      color: #d97706;
    }
  }
  
  .column-modal-body {
    .input-label {
      color: #e5e7eb;
    }
    
    .key-name-input :deep(.u-input__field) {
      background-color: #374151;
      border-color: #4b5563;
      color: #e5e7eb;
      
      &::placeholder {
        color: #9ca3af;
      }
    }
    
    .input-hint {
      color: #9ca3af;
    }
    
    .name-suggestions {
      .suggestions-label {
        color: #d1d5db;
      }
      
      .suggestion-chip {
        background-color: #374151;
        border-color: #4b5563;
        color: #e5e7eb;
        
        &:hover {
          background-color: #fef3c7;
          border-color: #fde68a;
          color: #92400e;
        }
      }
    }
  }
  
  .column-modal-footer {
    background-color: #111827;
    border-top-color: #374151;
  }
}
</style>