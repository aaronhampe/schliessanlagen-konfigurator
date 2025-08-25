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
/* CSS Custom Properties für bessere Dark Mode Unterstützung */
:root {
  --modal-bg: #ffffff;
  --modal-header-bg: #fef3c7;
  --modal-header-border: #fde68a;
  --modal-footer-bg: #f9fafb;
  --modal-footer-border: #e5e7eb;
  --text-primary: #1f2937;
  --text-secondary: #4b5563;
  --text-hint: #6b7280;
  --input-border: #d1d5db;
  --input-border-hover: #9ca3af;
  --suggestion-bg: #f3f4f6;
  --suggestion-border: #e5e7eb;
  --cancel-button-bg: #f3f4f6;
  --cancel-button-text: #4b5563;
  --cancel-button-hover: #e5e7eb;
}

@media (prefers-color-scheme: dark) {
  :root {
    --modal-bg: #1f2937;
    --modal-header-bg: #374151;
    --modal-header-border: #4b5563;
    --modal-footer-bg: #111827;
    --modal-footer-border: #374151;
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
    --text-hint: #9ca3af;
    --input-border: #4b5563;
    --input-border-hover: #6b7280;
    --suggestion-bg: #374151;
    --suggestion-border: #4b5563;
    --cancel-button-bg: #374151;
    --cancel-button-text: #d1d5db;
    --cancel-button-hover: #4b5563;
  }
}

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
  background-color: var(--modal-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.column-modal-header {
  background-color: var(--modal-header-bg);
  border-bottom: 1px solid var(--modal-header-border);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .modal-title-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .modal-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }
  
  .modal-icon {
    color: #d97706;
    font-size: 20px;
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
    color: var(--text-secondary);
    margin-bottom: 8px;
  }
  
  .input-wrapper {
    position: relative;
  }
  
  .key-name-input {
    width: 100%;
    
    :deep(.u-input__field) {
      background-color: var(--modal-bg);
      border-color: var(--input-border);
      color: var(--text-primary);
      transition: all 0.2s ease;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 1rem;
      
      &::placeholder {
        color: var(--text-hint);
      }
      
      &:hover {
        border-color: var(--input-border-hover);
      }
      
      &:focus {
        border-color: #f59e0b;
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
      }
    }
  }
  
  .input-hint {
    font-size: 0.8rem;
    color: var(--text-hint);
    margin-top: 6px;
  }
  
  .name-suggestions {
    margin-top: 16px;
    
    .suggestions-label {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }
    
    .suggestion-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .suggestion-chip {
        background-color: var(--suggestion-bg);
        border: 1px solid var(--suggestion-border);
        border-radius: 16px;
        padding: 6px 12px;
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--text-secondary);
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
  background-color: var(--modal-footer-bg);
  border-top: 1px solid var(--modal-footer-border);
  
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
    background-color: var(--cancel-button-bg);
    color: var(--cancel-button-text);
    
    &:hover {
      background-color: var(--cancel-button-hover);
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

/* Dark Mode Support - Entfernen der alten Implementierung */
@media (prefers-color-scheme: dark) {
  .improved-column-modal :deep(.u-modal-overlay) {
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(4px);
  }
  
  .column-modal-content {
    box-shadow: 0 20px 25px -5px rgba(255, 255, 255, 0.3), 0 10px 10px -5px rgba(255, 255, 255, 0.2);
  }
  
  .column-modal-header {
    .close-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>