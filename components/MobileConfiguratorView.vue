<template>
    <div class="mobile-container">
      <!-- Kopfbereich -->
      <div class="mobile-header">
        <h1>
          {{ isSchliessanlage ? "Schließanlage Konfigurator" : "Gleichschließung Konfigurator" }}
        </h1>
        <div class="info-icon" @click="toggleInfo">
          <i class="i-heroicons-information-circle" />
        </div>
      </div>
  
      <div v-if="showInfo" class="info-tooltip">
        Bei einer Gleichschließung können alle Schlüssel alle Türen öffnen,
        bei einer Schließanlage benötigen Schlüssel eine gezielte Zuweisung.
      </div>
  
      <!-- Anlagennummer -->
      <div class="mobile-section">
        <label>Anlagennummer:</label>
        <input type="text" readonly v-model="anlageNr" placeholder="Anlagenummer" />
      </div>
  
      <!-- Modellauswahl -->
      <div class="mobile-section">
        <label>Modellauswahl:</label>
        <select :value="selectedModelLocal" @change="onModelSelect($event)">
          <option v-for="model in store.availableModels" :key="model" :value="model">
            {{ model }}
          </option>
        </select>
      </div>
  
      <!-- Gleichschließung Toggle -->
      <div class="mobile-section">
        <label class="flex-row">
          <span>Gleichschließung aktivieren:</span>
          <UToggle color="sky" v-model="finalGleichschliessungState" :disabled="disableGleichToggle" />
        </label>
      </div>
  
      <!-- TÜR-BEREICHE (Akkordeons) -->
      <div
        class="mobile-accordion"
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
      >
        <!-- Header (Tür Titel + Auf/Zu) -->
        <div class="accordion-header" @click="toggleAccordion(rowIndex)">
          <h3>Tür {{ rowIndex + 1 }}</h3>
          <i :class="accordionOpen[rowIndex] ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" />
        </div>
  
        <!-- Accordion-Inhalt -->
        <div v-if="accordionOpen[rowIndex]" class="accordion-content">
          <!-- Türbezeichnung -->
          <div class="input-group">
            <label>Türbezeichnung:</label>
            <UInput v-model="row[0].doorDesignation" placeholder="z.B. Haupteingang" />
          </div>
  
          <!-- Anzahl -->
          <div class="input-group">
            <label>Anzahl:</label>
            <UInput v-model="row[0].doorquantity" type="number" min="1" />
          </div>
  
          <!-- Zylinder-Typ -->
          <div class="input-group">
            <label>Zylinder-Typ:</label>
            <select v-model="row[0].type" @change="onTypeChange(row[0])">
              <option disabled value="">Bitte auswählen</option>
              <option v-for="type in store.availableTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
  
          <!-- Größen (Außen/Innen) -->
          <div class="input-group">
            <label>Größen:</label>
            <div class="size-inputs">
              <select v-model="row[0].outside" @change="onOutsideSizeChange(row[0])">
                <option value="">Außen</option>
                <option
                  v-for="size in getAvailableOutsideSizes(row[0])"
                  :key="size"
                  :value="size"
                >
                  {{ size }} mm
                </option>
              </select>
              <select v-model="row[0].inside" @change="onInsideSizeChange(row[0])">
                <option value="">Innen</option>
                <option
                  v-for="size in getAvailableInsideSizes(row[0])"
                  :key="size"
                  :value="size"
                >
                  {{ size }} mm
                </option>
              </select>
            </div>
          </div>
  
          <!-- Optionen -->
          <div class="input-group">
            <label>Optionen:</label>
            <UButton @click="openOptionsModal(rowIndex)" icon="i-heroicons-cog">
              {{ getSelectedOptionsText(row[0]) || "Optionen auswählen" }}
            </UButton>
          </div>
  
          <!-- Aktionen (Duplizieren / Löschen) -->
          <div class="action-buttons">
            <UButton @click="duplicateRow(rowIndex)" icon="i-heroicons-document-duplicate">
              Duplizieren
            </UButton>
            <UButton @click="deleteRow(rowIndex)" icon="i-heroicons-trash" color="red">
              Löschen
            </UButton>
          </div>
        </div>
      </div>
  
      <!-- Schlüssel hinzufügen -->
      <div class="mobile-section">
        <UButton @click="addCheckbox" icon="i-heroicons-plus" class="full-width-button">
          Schlüssel hinzufügen
        </UButton>
      </div>
  
      <!-- Weitere Aktionen -->
      <div class="mobile-section">
        <UButton @click="addRow" icon="i-heroicons-plus" class="full-width-button">
          Tür hinzufügen
        </UButton>
        <UButton @click="saveInstallation" class="full-width-button">
          Weiter zu den Angeboten
        </UButton>
      </div>
  
      <!-- Optionen-Modal (Beispiel) -->
      <ColumnModal
        v-if="isOptionsModalOpen[rowIndex]"
        :options="getAllOptionsForType(rows[rowIndex][0])"
        @close="closeOptionsModal(rowIndex)"
        @update-options="setSingleOption(rows[rowIndex][0], $event)"
      />
      
      <!-- Warnungs-Modal, falls Modell gewechselt wird -->
      <div v-if="isWarningModalOpen" class="warning-modal">
        <div class="warning-modal-content">
          <p>Modell ändern? Dadurch werden bereits gewählte Zylinder-Einstellungen zurückgesetzt.</p>
          <div class="modal-buttons">
            <UButton @click="confirmChange">Ja, ändern</UButton>
            <UButton @click="cancelChange" color="red">Abbrechen</UButton>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ColumnModal from "./ColumnModal.vue";
  import { useCylinderStore } from "@/stores/cylinderStores.js";
  
  export default {
    name: "MobileConfiguratorView",
    components: {
      ColumnModal,
    },
    data() {
      return {
        anlageNr: "",
        object: "",
        id: "",
        password: "",
        email: "",
        name: "",
        phone: "",
        company: "",
        typ: "",
        modalStates: {},
        isDropdownOpen: {},
        isOptionsModalOpen: {},
        showInfo: false,
        // Lokale Modellauswahl
        selectedModelLocal: "",
        oldModel: "",
        pendingModel: null,
        isWarningModalOpen: false,
        overrideToGleichschliessung: false,
        // Hauptstruktur: rows[rowIndex][colIndex]
        // rowIndex = Tür / colIndex = Schlüssel
        rows: [
          [
            {
              position: 1,
              doorDesignation: "",
              doorquantity: 1,
              type: "",
              outside: "",
              inside: "",
              options: {},
              optionsSelected: [],
              checked: false,
              keyquantity: 1,
              keyname: "Schlüssel 1",
              keycolor: "",
            },
          ],
        ],
        accordionOpen: [], // steuert, ob Akkordeon offen/geschlossen ist
      };
    },
    computed: {
      store() {
        return useCylinderStore();
      },
      isSchliessanlage() {
        // Falls override aktiv => immer Gleichschließung = false
        if (this.overrideToGleichschliessung) {
          return false;
        }
        return this.store.isSchliessanlage;
      },
      finalGleichschliessungState: {
        get() {
          // 1) Falls im Store gar keine Schließanlage => always true
          if (!this.store.isSchliessanlage) {
            return true;
          }
          // 2) Falls das Modell z.B. ABUS Ec 550 => immer Gleichschließung
          const model = this.store.currentModel || "";
          if (model === "ABUS Ec 550") {
            return true;
          }
          // 3) Sonst: nutze override, falls gesetzt
          return this.overrideToGleichschliessung;
        },
        set(val) {
          this.overrideToGleichschliessung = val;
        },
      },
      disableGleichToggle() {
        if (!this.store.isSchliessanlage) {
          return true;
        }
        if (this.store.currentModel === "ABUS Ec 550") {
          return true;
        }
        return false;
      },
    },
    watch: {
      "store.selectedModel": {
        immediate: true,
        handler(newVal) {
          this.selectedModelLocal = newVal;
          this.oldModel = newVal;
        },
      },
      "$route.query.anlageNr": {
        handler(newVal) {
          if (newVal) {
            this.id = newVal;
            this.loadInstallation();
          }
        },
        immediate: true,
      },
    },
    methods: {
      /* ------------------- UI/Accordion ------------------- */
      toggleInfo() {
        this.showInfo = !this.showInfo;
      },
      toggleAccordion(index) {
        this.$set(this.accordionOpen, index, !this.accordionOpen[index]);
      },
  
      /* ------------------- Modellwechsel ------------------- */
      onModelSelect(event) {
        const newlySelected = event.target.value;
        if (newlySelected !== this.oldModel) {
          this.pendingModel = newlySelected;
          // Temporär zurücksetzen, bis User bestätigt
          event.target.value = this.oldModel;
          this.isWarningModalOpen = true;
        }
      },
      confirmChange() {
        if (this.pendingModel) {
          this.store.setModel(this.pendingModel);
          // Reset der Daten pro Zeile/Spalte
          this.rows.forEach((row) => {
            row.forEach((checkbox) => {
              checkbox.type = "";
              checkbox.outside = "";
              checkbox.inside = "";
              checkbox.options = {};
              checkbox.optionsSelected = [];
              checkbox.checked = !this.isSchliessanlage;
            });
          });
          this.selectedModelLocal = this.pendingModel;
          this.oldModel = this.pendingModel;
          this.isWarningModalOpen = false;
          this.pendingModel = null;
        }
      },
      cancelChange() {
        this.pendingModel = null;
        this.isWarningModalOpen = false;
      },
  
      /* ------------------- Türen / Zeilen ------------------- */
      addRow() {
        const numCheckboxes = this.rows[0].length;
        const newRow = [];
        for (let i = 0; i < numCheckboxes; i++) {
          newRow.push({
            position: this.rows.length + 1,
            doorDesignation: "",
            doorquantity: 1,
            type: "",
            outside: "",
            inside: "",
            options: {},
            optionsSelected: [],
            checked: !this.isSchliessanlage,
            keyquantity: 1,
            keyname: "Schlüssel " + (i + 1),
            keycolor: "",
          });
        }
        this.rows.push(newRow);
      },
      deleteRow(rowIndex) {
        if (this.rows.length > 1) {
          this.rows.splice(rowIndex, 1);
        } else {
          alert("Die letzte Zeile kann nicht entfernt werden.");
        }
      },
      duplicateRow(rowIndex) {
        const currentRow = this.rows[rowIndex];
        const newRow = this.deepCopy(currentRow);
        this.rows.splice(rowIndex + 1, 0, newRow);
      },
  
      /* ------------------- Schlüssel / Spalten ------------------- */
      addCheckbox() {
        // Füge jeder "Tür-Zeile" eine weitere "Spalte" hinzu
        this.rows.forEach((checkboxRow) => {
          checkboxRow.push({
            position: checkboxRow[0].position,
            doorDesignation: "",
            doorquantity: 1,
            type: "",
            outside: "",
            inside: "",
            options: {},
            optionsSelected: [],
            checked: !this.isSchliessanlage,
            keyquantity: 1,
            keyname: "Schlüssel " + (checkboxRow.length + 1),
          });
        });
      },
      deleteCheckbox(colIndex) {
        if (colIndex === 0) {
          alert("Die erste Spalte (Hauptdaten) kann nicht entfernt werden.");
          return;
        }
        const hasMultipleColumns = this.rows.some((row) => row.length > 1);
        if (hasMultipleColumns || colIndex > 0) {
          this.rows.forEach((row) => row.splice(colIndex, 1));
        } else {
          alert("Die letzte Spalte kann nicht entfernt werden.");
        }
      },
  
      /* ------------------- Größen / Type / Optionen ------------------- */
      onTypeChange(checkbox) {
        if (!this.isSchliessanlage) {
          checkbox.checked = true;
        }
        checkbox.inside = "";
        checkbox.outside = "";
        checkbox.options = {};
        checkbox.optionsSelected = [];
      },
      getAvailableInsideSizes(checkbox) {
        const sizes = this.getSizesForType(checkbox.type);
        if (checkbox.outside) {
          return sizes
            .filter((size) => size.outside === Number(checkbox.outside))
            .map((size) => size.inside)
            .filter((v, i, self) => self.indexOf(v) === i);
        } else {
          return sizes
            .map((size) => size.inside)
            .filter((v, i, self) => self.indexOf(v) === i);
        }
      },
      getAvailableOutsideSizes(checkbox) {
        const sizes = this.getSizesForType(checkbox.type);
        if (checkbox.inside) {
          return sizes
            .filter((size) => size.inside === Number(checkbox.inside))
            .map((size) => size.outside)
            .filter((v, i, self) => self.indexOf(v) === i);
        } else {
          return sizes
            .map((size) => size.outside)
            .filter((v, i, self) => self.indexOf(v) === i);
        }
      },
      onInsideSizeChange(checkbox) {
        if (!this.isSizeCombinationValid(checkbox)) {
          checkbox.outside = "";
        }
      },
      onOutsideSizeChange(checkbox) {
        if (!this.isSizeCombinationValid(checkbox)) {
          checkbox.inside = "";
        }
      },
      isSizeCombinationValid(checkbox) {
        const sizes = this.getSizesForType(checkbox.type);
        return sizes.some(
          (size) =>
            size.inside === Number(checkbox.inside) &&
            size.outside === Number(checkbox.outside)
        );
      },
      getSizesForType(type) {
        if (this.store.selectedModel && type) {
          const typeKey = type.replace(/\s*\(.*?\)/g, "");
          return this.store.getSizesForType(typeKey);
        }
        return [];
      },
  
      /* ------------------- Optionen-Modal ------------------- */
      openOptionsModal(rowIndex) {
        this.$set(this.isOptionsModalOpen, rowIndex, true);
      },
      closeOptionsModal(rowIndex) {
        this.$set(this.isOptionsModalOpen, rowIndex, false);
      },
      getAllOptionsForType(checkbox) {
        if (this.store.selectedModel && checkbox.type) {
          const typeKey = checkbox.type.replace(/\s*\(.*?\)/g, "");
          return this.store.getOptionsForType(typeKey);
        }
        return [];
      },
      setSingleOption(checkbox, value) {
        checkbox.options = value;
      },
      getSelectedOptionsText(checkbox) {
        if (checkbox.optionsSelected && checkbox.optionsSelected.length) {
          return checkbox.optionsSelected.join(", ");
        }
        return "";
      },
  
      /* ------------------- DB-Speicherlogik / Laden ------------------- */
      async saveInstallation() {
        // Beispielhafte Validierung: Type, Außen, Innen nicht leer
        for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
          const { type, outside, inside } = this.rows[rowIndex][0];
          if (!type) {
            alert(`Bitte Zylinder-Typ in Zeile ${rowIndex + 1} wählen.`);
            return;
          }
          if (!outside) {
            alert(`Bitte Außenmaß in Zeile ${rowIndex + 1} wählen.`);
            return;
          }
          if (!inside) {
            alert(`Bitte Innenmaß in Zeile ${rowIndex + 1} wählen.`);
            return;
          }
        }
  
        // Wenn isSchliessanlage: pro Spalte mind. 1 "checked"
        if (this.isSchliessanlage) {
          const colCount = this.rows[0].length;
          for (let c = 0; c < colCount; c++) {
            let foundAtLeastOne = false;
            for (let r = 0; r < this.rows.length; r++) {
              if (this.rows[r][c].checked) {
                foundAtLeastOne = true;
                break;
              }
            }
            if (!foundAtLeastOne) {
              alert(
                `Bitte mindestens eine Berechtigung in Spalte #${c + 1} auswählen.`
              );
              return;
            }
          }
        }
  
        // Falls anlageNr leer => generiere
        if (this.anlageNr === "") {
          this.generateRandomAnlagenNummer();
        }
  
        // Dann DB-Speicherung hier ausführen oder axios/fetch usen
        // ...
        // Anschließend Weiterleitung:
        this.$router.push({
          name: "systeme",
          query: {
            anlageNr: this.anlageNr,
            isSchliessanlage: this.isSchliessanlage,
          },
        });
      },
      async loadInstallation() {
        // Hier Daten via $fetch / axios nachladen.
        // rows etc. befüllen.
      },
      generateRandomAnlagenNummer() {
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        this.anlageNr = randomNum.toString();
      },
  
      /* ------------------- Hilfsfunktionen ------------------- */
      deepCopy(obj) {
        if (typeof obj !== "object" || obj === null) {
          return obj;
        }
        const copy = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            copy[key] = this.deepCopy(obj[key]);
          }
        }
        return copy;
      },
    },
    mounted() {
      // Beispiel: Wenn wir in der URL die anlageNr haben, laden wir diese
      if (this.$route.query.anlageNr) {
        this.id = this.$route.query.anlageNr;
        this.loadInstallation();
      } else {
        // Neue anlageNr generieren
        this.generateRandomAnlagenNummer();
      }
    },
  };
  </script>
  
  <style lang="scss">
  .mobile-container {
    padding: 16px;
  }
  
  .mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  
  .info-icon {
    cursor: pointer;
  }
  
  .info-tooltip {
    background: #f0f0f0;
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 16px;
  }
  
  .mobile-section {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
  }
  
  .mobile-section label {
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .full-width-button {
    width: 100%;
    margin-top: 8px;
  }
  
  /* Accordion */
  .mobile-accordion {
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 12px;
  }
  
  .accordion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    cursor: pointer;
  }
  
  .accordion-content {
    padding: 12px;
    border-top: 1px solid #ddd;
  }
  
  .input-group {
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }
  
  /* Modal-Beispiel */
  .warning-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.4);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .warning-modal-content {
    background: #fff;
    padding: 16px;
    border-radius: 8px;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  
  .size-inputs {
    display: flex;
    gap: 8px;
  }
  </style>
  