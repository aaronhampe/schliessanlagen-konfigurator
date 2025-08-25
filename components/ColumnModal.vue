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
            <input
              id="keyName"
              autofocus
              class="key-name-input"
              v-model="columnName"
              color="amber"
              placeholder="z.B. Haustürschlüssel"
            />
            <div class="input-hint">
              Vergeben Sie einen eindeutigen Namen für den Schlüssel
            </div>
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
        "Gästeschlüssel",
      ],
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
    },
  },
};
</script>

<style scoped>
@import "@/styles/column-modal.scss";
</style>
