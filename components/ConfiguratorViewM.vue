<template>
  <div class="mobile-container">
    <!-- Fortschrittsanzeige -->
    <div class="progress-indicator">
      <div class="progress-step" :class="{ 'active': currentStep === 1, 'completed': currentStep > 1 }"
        @click="currentStep > 1 && setStep(1)">
        <span class="step-number">1</span>
        <span class="step-label">Türen</span>
      </div>
      <div class="progress-line"></div>
      <div class="progress-step" :class="{ 'active': currentStep === 2, 'completed': currentStep > 2 }"
        @click="currentStep > 2 && setStep(2)">
        <span class="step-number">2</span>
        <span class="step-label">Schlüssel</span>
      </div>
      <div class="progress-line"></div>
      <div class="progress-step" :class="{ 'active': currentStep === 3 }">
        <span class="step-number">3</span>
        <span class="step-label">Fertig</span>
      </div>
    </div>

    <!-- Kopfbereich -->
    <div class="mobile-header">
      <h1>
        {{ isSchliessanlage ? "Schließanlage" : "Gleichschließung" }}
      </h1>
      <div class="info-icon" @click="toggleInfo">
        <i class="i-heroicons-information-circle" />
      </div>
    </div>

    <div v-if="showInfo" class="info-tooltip">
      Bei einer <strong>Gleichschließung</strong> können alle Schlüssel alle Türen öffnen, bei einer
      <strong>Schließanlage</strong> benötigen Schlüssel eine gezielte Zuweisung.
    </div>

    <!-- Anlagennummer -->
    <div class="mobile-section">
      <label>Anlagennummer:</label>
      <input type="text" readonly v-model="anlageNr" placeholder="Anlagenummer" />
    </div>

    <!-- SCHRITT 1: TÜRKONFIGURATION -->
    <div v-if="currentStep === 1">
      <!-- Modellauswahl -->
      <div class="mobile-section">
        <label>Modellauswahl:</label>
        <select :value="selectedModelLocal" @change="onModelSelect($event)">
          <option v-for="model in store.availableModels" :key="model" :value="model">
            {{ model }}
          </option>
        </select>
      </div>

      <!-- Türliste -->
      <div class="doors-list-header">
        <h2>Meine Türen</h2>
        <UButton @click="addRow" icon="i-heroicons-plus" class="add-door-button">
          Tür hinzufügen
        </UButton>
      </div>

      <!-- Türdetails (Akkordeon) -->
      <div class="mobile-accordion" v-for="(row, rowIndex) in rows" :key="rowIndex">
        <div class="accordion-header" @click="toggleAccordion(rowIndex)">
          <div class="accordion-title">
            <span class="door-number">{{ rowIndex + 1 }}</span>
            <span class="door-name">{{ getDoorName(row[0]) }}</span>
          </div>
          <i :class="accordionOpen[rowIndex] ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" />
        </div>

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
          <div class="input-group size-group">
            <label>Größen:</label>
            <div class="size-inputs">
              <div class="size-input-container">
                <label class="sublabel">Außen:</label>
                <select v-model="row[0].outside" @change="onOutsideSizeChange(row[0])">
                  <option value="">Wählen...</option>
                  <option v-for="size in getAvailableOutsideSizes(row[0])" :key="size" :value="size">
                    {{ size }} mm
                  </option>
                </select>
              </div>
              <div class="size-input-container">
                <label class="sublabel">Innen:</label>
                <select v-model="row[0].inside" @change="onInsideSizeChange(row[0])">
                  <option value="">Wählen...</option>
                  <option v-for="size in getAvailableInsideSizes(row[0])" :key="size" :value="size">
                    {{ size }} mm
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Optionen -->
          <div class="input-group">
            <label>Optionen:</label>
            <UButton @click.stop="openOptionsModal(rowIndex)" class="options-button">
              <span class="options-button-text">{{ getSelectedOptionsText(row[0]) || "Optionen auswählen" }}</span>
              <i class="i-heroicons-cog"></i>
            </UButton>
          </div>

          <!-- Aktionen (Duplizieren/Löschen) -->
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

      <!-- Weiter zu Schritt 2 Button -->
      <UButton @click="goToStep2" class="action-button next-step-button">
        Weiter zu Schlüsselkonfiguration
      </UButton>
    </div>

    <!-- SCHRITT 2: SCHLÜSSELKONFIGURATION -->
    <div v-if="currentStep === 2">
      <div class="keys-list-header">
        <h2>Meine Schlüssel</h2>
        <UButton @click="addCheckbox" icon="i-heroicons-plus" class="add-key-button">
          Schlüssel hinzufügen
        </UButton>
      </div>

      <!-- Liste der Schlüssel (nur erste Zeile) -->
      <div class="keys-list">
        <div v-for="(keyItem, colIndex) in rows[0]" :key="colIndex" class="key-card">
          <div class="key-card-header">
            <span class="key-name">{{ keyItem.keyname }}</span>
            <UButton @click="openKeyModal(colIndex)" icon="i-heroicons-pencil" class="key-edit-button" size="xs"
              color="sky" />
          </div>

          <div class="key-card-body">
            <div class="key-quantity">
              <label>Anzahl:</label>
              <UInput v-model="keyItem.keyquantity" type="number" min="1" class="quantity-input" />
            </div>

            <div v-if="isSchliessanlage" class="door-assignments">
              <label>Öffnet folgende Türen:</label>
              <div class="door-checkbox-list">
                <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="door-checkbox-item">
                  <label>
                    <input type="checkbox" v-model="rows[rowIndex][colIndex].checked" />
                    <span>{{ getDoorName(row[0]) }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div v-if="colIndex > 0" class="key-actions">
              <UButton @click="deleteCheckbox(colIndex)" icon="i-heroicons-trash" color="red" size="xs">
                Löschen
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="step-navigation">
        <UButton @click="setStep(1)" class="navigation-button back">
          <i class="i-heroicons-arrow-left"></i>
          Zurück
        </UButton>
        <UButton @click="goToStep3" class="navigation-button next">
          Weiter
          <i class="i-heroicons-arrow-right"></i>
        </UButton>
      </div>
    </div>

    <!-- SCHRITT 3: ZUSAMMENFASSUNG & SPEICHERN -->
    <div v-if="currentStep === 3" class="summary-step">
      <h2>Zusammenfassung</h2>

      <div class="summary-section">
        <h3>Allgemeine Informationen</h3>
        <div class="summary-item">
          <span class="summary-label">Modell:</span>
          <span class="summary-value">{{ selectedModelLocal }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Typ:</span>
          <span class="summary-value">{{ isSchliessanlage ? "Schließanlage" : "Gleichschließung" }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Anzahl Türen:</span>
          <span class="summary-value">{{ rows.length }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Anzahl Schlüssel:</span>
          <span class="summary-value">{{ rows[0].length }}</span>
        </div>
      </div>

      <div class="summary-section">
        <h3>Kontaktdaten</h3>
        <div class="input-group">
          <label>E-Mail-Adresse: *</label>
          <UInput v-model="email" type="email" required />
        </div>
        <div class="input-group">
          <label>Name:</label>
          <UInput v-model="name" type="text" />
        </div>
        <div class="input-group">
          <label>Telefon:</label>
          <UInput v-model="phone" type="tel" />
        </div>
      </div>

      <div class="summary-actions">
        <UButton @click="setStep(2)" class="navigation-button back">
          <i class="i-heroicons-arrow-left"></i>
          Zurück
        </UButton>
        <UButton @click="saveInstallation" class="action-button save-button">
          Konfiguration speichern und fortfahren
        </UButton>
      </div>
    </div>

    <!-- Modals -->
    <!-- Optionen Modal -->
    <div v-if="modalOptionsVisible" class="modal-overlay" @click.self="closeOptionsModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Optionen auswählen</h3>
          <button class="modal-close" @click="closeOptionsModal">×</button>
        </div>
        <div class="modal-body">
          <div v-if="activeOptionsModalIndex !== null">
            <div v-for="option in getAllOptionsForType(rows[activeOptionsModalIndex][0]).Optionen || []" :key="option"
              class="option-item">
              <label class="option-label">
                <input type="checkbox" :value="option" v-model="modalOptionsSelected" />
                <span class="option-text">{{ option }}</span>
              </label>
            </div>
            <div v-if="(getAllOptionsForType(rows[activeOptionsModalIndex][0]).Optionen || []).length === 0"
              class="no-options">
              Keine Optionen für diesen Zylindertyp verfügbar.
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <UButton @click="applyOptions" class="modal-button confirm">Übernehmen</UButton>
          <UButton @click="closeOptionsModal" class="modal-button cancel">Abbrechen</UButton>
        </div>
      </div>
    </div>

    <!-- Schlüssel Bearbeiten Modal -->
    <div v-if="isKeyModalVisible" class="modal-overlay" @click.self="closeKeyModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Schlüssel bearbeiten</h3>
          <button class="modal-close" @click="closeKeyModal">×</button>
        </div>
        <div class="modal-body">
          <div class="input-group">
            <label>Schlüsselname:</label>
            <UInput v-model="activeKeyName" placeholder="z.B. Hauptschlüssel" />
          </div>
          <div class="input-group">
            <label>Anzahl:</label>
            <UInput v-model="activeKeyQuantity" type="number" min="1" />
          </div>
        </div>
        <div class="modal-footer">
          <UButton @click="saveKeyChanges" class="modal-button confirm">Speichern</UButton>
          <UButton @click="closeKeyModal" class="modal-button cancel">Abbrechen</UButton>
        </div>
      </div>
    </div>

    <!-- Warnungsmodal für Modellwechsel -->
    <div v-if="isWarningModalOpen" class="modal-overlay">
      <div class="modal-container warning-modal">
        <div class="modal-header">
          <h3>Achtung</h3>
          <button class="modal-close" @click="cancelChange">×</button>
        </div>
        <div class="modal-body">
          <p>
            Modell wechseln? Dadurch werden alle aktuellen Einstellungen zurückgesetzt.
          </p>
        </div>
        <div class="modal-footer">
          <UButton @click="confirmChange" class="modal-button confirm">
            Ja, wechseln
          </UButton>
          <UButton @click="cancelChange" class="modal-button cancel">
            Abbrechen
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCylinderStore } from "@/stores/cylinderStores.js";

export default {
  name: "MobileConfiguratorView",
  data() {
    return {
      // Schrittweise Navigation
      currentStep: 1,

      // Basisdaten
      anlageNr: "",
      object: "",
      id: "",
      password: "",
      email: "",
      name: "",
      phone: "",
      company: "",
      typ: "",
      protect: 0,

      // UI-Status-Variablen
      showInfo: false,
      accordionOpen: [],
      modalStates: {},
      isOpenL: false,
      isOpenS: false,
      isDropdownOpen: {},

      // Modelle und Daten
      selectedModelLocal: "",
      oldModel: "",
      isWarningModalOpen: false,
      pendingModel: null,
      overrideToGleichschliessung: false,

      // Optionen Modal
      activeOptionsModalIndex: null,
      modalOptionsVisible: false,
      modalOptionsSelected: [],

      // Schlüssel Modal
      isKeyModalVisible: false,
      activeKeyIndex: null,
      activeKeyName: "",
      activeKeyQuantity: 1,

      // Alert
      alertMessage: "",
      alertType: "",

      // Hauptdaten
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
            checked: true, // Default: Schlüssel kann Tür öffnen
            keyquantity: 1,
            keyname: "Schlüssel 1",
            keycolor: "",
          },
        ],
      ],
    };
  },
  computed: {
    store() {
      return useCylinderStore();
    },
    isSchliessanlage() {
      if (this.overrideToGleichschliessung) {
        return false;
      }
      return this.store.isSchliessanlage;
    },
    finalGleichschliessungState: {
      get() {
        if (!this.store.isSchliessanlage) {
          return true;
        }
        const model = this.store.currentModel || "";
        if (model === "ABUS Ec 550") {
          return true;
        }
        return this.overrideToGleichschliessung;
      },
      set(val) {
        this.overrideToGleichschliessung = val;

        // Bei Wechsel zu Gleichschließung alle Checkboxen aktivieren
        if (val === true) {
          this.rows.forEach(row => {
            row.forEach(cell => {
              cell.checked = true;
            });
          });
        }
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
    // Navigation und UI-Methoden
    setStep(step) {
      this.currentStep = step;
    },

    goToStep2() {
      // Prüfung aller Türen
      let isValid = true;

      for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
        const { type, outside, inside } = this.rows[rowIndex][0];

        if (!type) {
          alert(`Bitte Zylinder-Typ für Tür ${rowIndex + 1} wählen.`);
          isValid = false;
          break;
        }

        if (!outside) {
          alert(`Bitte Außenmaß für Tür ${rowIndex + 1} wählen.`);
          isValid = false;
          break;
        }

        if (!inside) {
          alert(`Bitte Innenmaß für Tür ${rowIndex + 1} wählen.`);
          isValid = false;
          break;
        }
      }

      if (isValid) {
        this.setStep(2);
      }
    },

    goToStep3() {
      // Erst zu Schritt 3, wenn bei Schließanlage alle Berechtigungen korrekt sind
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
            alert(`Bitte weisen Sie dem Schlüssel "${this.rows[0][c].keyname}" mindestens eine Tür zu.`);
            return;
          }
        }
      }

      this.setStep(3);
    },

    toggleInfo() {
      this.showInfo = !this.showInfo;
    },

    toggleAccordion(index) {
      // Falls nicht initialisiert
      if (this.accordionOpen[index] === undefined) {
        // noch nicht initialisiert
        this.accordionOpen[index] = true
      } else {
        this.accordionOpen[index] = !this.accordionOpen[index]
      }

    },

    getDoorName(doorData) {
      return doorData.doorDesignation || `Tür ${doorData.position || 'Neu'}`;
    },

    // Tür-Methoden
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
          checked: !this.isSchliessanlage, // Bei Gleichschließung immer alle checked
          keyquantity: 1,
          keyname: "Schlüssel " + (i + 1),
        });
      }

      this.rows.push(newRow);

      // Neue Tür automatisch öffnen
      this.accordionOpen.splice(rowIndex + 1, 0, true);
    },

    deleteRow(rowIndex) {
      if (this.rows.length > 1) {
        this.rows.splice(rowIndex, 1);

        // Positionsnummern aktualisieren
        this.rows.forEach((row, idx) => {
          row[0].position = idx + 1;
        });
      } else {
        alert("Die letzte Tür kann nicht gelöscht werden.");
      }
    },

    duplicateRow(rowIndex) {
      const currentRow = this.rows[rowIndex];
      const newRow = this.deepCopy(currentRow);

      // Position anpassen
      newRow[0].position = this.rows.length + 1;

      // Türbezeichnung anpassen
      if (newRow[0].doorDesignation) {
        newRow[0].doorDesignation += " (Kopie)";
      }

      this.rows.splice(rowIndex + 1, 0, newRow);

      // Duplizierte Tür automatisch öffnen
      this.accordionOpen.splice(rowIndex + 1, 0, true);
    },

    // Schlüssel-Methoden
    addCheckbox() {
      const newKeyName = "Schlüssel " + (this.rows[0].length + 1);

      this.rows.forEach((row) => {
        row.push({
          checked: !this.isSchliessanlage, // Bei Gleichschließung immer true
          keyquantity: 1,
          keyname: newKeyName,
        });
      });
    },

    deleteCheckbox(colIndex) {
      if (colIndex === 0) {
        alert("Der erste Schlüssel kann nicht entfernt werden.");
        return;
      }

      if (this.rows[0].length > 1) {
        this.rows.forEach((row) => {
          row.splice(colIndex, 1);
        });
      } else {
        alert("Der letzte Schlüssel kann nicht entfernt werden.");
      }
    },

    openKeyModal(colIndex) {
      this.activeKeyIndex = colIndex;
      this.activeKeyName = this.rows[0][colIndex].keyname;
      this.activeKeyQuantity = this.rows[0][colIndex].keyquantity;
      this.isKeyModalVisible = true;
    },

    closeKeyModal() {
      this.isKeyModalVisible = false;
      this.activeKeyIndex = null;
    },

    saveKeyChanges() {
      if (this.activeKeyIndex !== null) {
        // Aktualisiere auf allen Zeilen den Schlüssel mit dem gleichen Index
        this.rows.forEach(row => {
          row[this.activeKeyIndex].keyname = this.activeKeyName;
          row[this.activeKeyIndex].keyquantity = this.activeKeyQuantity;
        });
      }

      this.closeKeyModal();
    },

    // Optionen-Modals
    openOptionsModal(rowIndex) {
      this.activeOptionsModalIndex = rowIndex;
      this.modalOptionsSelected = [...this.rows[rowIndex][0].optionsSelected];
      this.modalOptionsVisible = true;
    },

    closeOptionsModal() {
      this.modalOptionsVisible = false;
      this.activeOptionsModalIndex = null;
    },

    applyOptions() {
      if (this.activeOptionsModalIndex !== null) {
        this.rows[this.activeOptionsModalIndex][0].optionsSelected = [
          ...this.modalOptionsSelected,
        ];
      }

      this.closeOptionsModal();
    },

    // Modell-Methoden
    onModelSelect(event) {
      const newlySelected = event.target.value;

      if (newlySelected !== this.oldModel) {
        this.pendingModel = newlySelected;
        event.target.value = this.oldModel; // Zurücksetzen bis bestätigt
        this.isWarningModalOpen = true;
      }
    },

    confirmChange() {
      if (this.pendingModel) {
        this.store.setModel(this.pendingModel);

        // Alle Eingaben zurücksetzen
        this.rows.forEach((row) => {
          row.forEach((checkbox) => {
            checkbox.type = "";
            checkbox.inside = "";
            checkbox.outside = "";
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

    // Größen-Methoden
    getAvailableInsideSizes(checkbox) {
      const sizes = this.getSizesForType(checkbox.type);

      if (checkbox.outside) {
        return sizes
          .filter((size) => size.outside === Number(checkbox.outside))
          .map((size) => size.inside)
          .filter((value, index, self) => self.indexOf(value) === index);
      } else {
        return sizes
          .map((size) => size.inside)
          .filter((value, index, self) => self.indexOf(value) === index);
      }
    },

    getAvailableOutsideSizes(checkbox) {
      const sizes = this.getSizesForType(checkbox.type);

      if (checkbox.inside) {
        return sizes
          .filter((size) => size.inside === Number(checkbox.inside))
          .map((size) => size.outside)
          .filter((value, index, self) => self.indexOf(value) === index);
      } else {
        return sizes
          .map((size) => size.outside)
          .filter((value, index, self) => self.indexOf(value) === index);
      }
    },

    getSizesForType(type) {
      if (this.store.selectedModel && type) {
        const typeKey = type.replace(/\s*\(.*?\)/g, "");
        return this.store.getSizesForType(typeKey);
      }
      return [];
    },

    onTypeChange(checkbox) {
      // Bei Typänderung Maße zurücksetzen
      checkbox.inside = "";
      checkbox.outside = "";
      checkbox.options = {};
      checkbox.optionsSelected = [];

      // Bei Gleichschließung immer angehakt
      if (!this.isSchliessanlage) {
        checkbox.checked = true;
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

    // Optionen-Methoden
    getAllOptionsForType(checkbox) {
      if (this.store.selectedModel && checkbox.type) {
        const typeKey = checkbox.type.replace(/\s*\(.*?\)/g, "");
        return { Optionen: this.store.getOptionsForType(typeKey) || [] };
      }
      return { Optionen: [] };
    },

    getSelectedOptionsText(checkbox) {
      return (checkbox.optionsSelected && checkbox.optionsSelected.length > 0)
        ? checkbox.optionsSelected.join(", ")
        : "";
    },


    // Hilfsmethoden
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

    generateRandomAnlagenNummer() {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      this.anlageNr = randomNum.toString();

      // Optional: Auch gleich ein Passwort generieren
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let password = "";
      for (let i = 0; i < 6; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      this.password = password;
    },

    // Speichern und Laden
    async saveInstallation() {
      // Validiere E-Mail
      if (!this.email || !this.validateEmail(this.email)) {
        alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
        return;
      }

      // Generiere Anlagennummer, falls nicht vorhanden
      if (this.anlageNr === "") {
        let antwort;
        do {
          this.generateRandomAnlagenNummer();
          const response = await $fetch("./api/sqltestanlage?ID=" + this.anlageNr, {
            method: "post",
          });
          antwort = response.message;
        } while (antwort === "Anlagennummer existiert.");
      }

      // Speichere Anlage
      const queryresultanlage = await $fetch("./api/sqlpostanlageneu", {
        method: "post",
        body: {
          ID: this.anlageNr,
          Objekt: this.object,
          Name: this.name,
          EMail: this.email,
          Telefon: this.phone,
          Firma: this.company,
          Typ: this.typ,
          Modell: this.store.selectedModel,
          protect: this.protect,
          Password: this.password,
        },
      });

      if (queryresultanlage) {
        // Speichere Positionen (Türen)
        const RowObject = this.rows.map((row, rowIndex) => ({
          POS: rowIndex + 1,
          Bezeichnung: row[0].doorDesignation || "",
          Anzahl: row[0].doorquantity || 1,
          Typ: row[0].type || "",
          SizeA: row[0].outside || "",
          SizeI: row[0].inside || "",
          Option: (row[0].optionsSelected || []).join(", "),
        }));

        await $fetch("./api/sqlpostposition?ID=" + this.anlageNr, {
          method: "post",
          body: RowObject,
        });

        // Speichere Schlüssel
        const KeyNameObject = this.rows[0].map((col, colIndex) => ({
          keyPos: colIndex + 1,
          keyname: col.keyname || `Schlüssel ${colIndex + 1}`,
          keyquantity: col.keyquantity || 1,
          keycolor: col.keycolor || "",
        }));

        await $fetch("./api/sqlpostschluessel?ID=" + this.anlageNr, {
          method: "post",
          body: KeyNameObject,
        });

        // Speichere Matrix (welcher Schlüssel passt zu welcher Tür)
        const Matrix = this.rows.flatMap((row, rowIndex) =>
          row.map((col, colIndex) => ({
            position: rowIndex + 1,
            keynr: colIndex + 1,
            checked: col.checked || false,
          }))
        );

        await $fetch("./api/sqlpostmatrix?ID=" + this.anlageNr, {
          method: "post",
          body: Matrix,
        });

        // E-Mail senden
        await this.sendConfirmationEmails();

        // Zur Systemübersicht weiterleiten
        this.$router.push({
          name: "systeme",
          query: {
            anlageNr: this.anlageNr,
            isSchliessanlage: this.isSchliessanlage,
          },
        });
      }
    },

    async loadInstallation() {

      this.anlageNr = this.id;
      // 1) Lade alle drei Teile
      const [{ queryresult: positions },
        { queryresult: keys },
        { queryresult: matrix }] = await Promise.all([
          $fetch("./api/sqlgetposition", { method: "post", body: { ID: this.id } }),
          $fetch("./api/sqlgetschluessel", { method: "post", body: { ID: this.id } }),
          $fetch("./api/sqlgetmatrix", { method: "post", body: { ID: this.id } })
        ]);

      // Wenn gar nichts da ist, verlassen
      if (!positions.length) return;

      // 2) Dimensions ermitteln
      const numDoors = positions.length;
      const numKeys = keys.length ? Math.max(...keys.map(k => k.KeyPOS)) : 1;

      // 3) rows leeren und komplett neu aufbauen
      this.rows = [];
      for (let i = 0; i < numDoors; i++) {
        const doorData = positions.find(p => p.POS === i + 1) || {};
        this.rows[i] = [];
        for (let j = 0; j < numKeys; j++) {
          const keyData = keys.find(k => k.KeyPOS === j + 1) || {};
          const mat = matrix.find(m => m.POSZylinder === i + 1 && m.POSSchluessel === j + 1);
          this.rows[i][j] = {
            // Tür‑Felder nur in Spalte 0 füllen, in allen anderen Zellen ignorieren
            ...(j === 0 ? {
              position: i + 1,
              doorDesignation: doorData.Bezeichnung || "",
              doorquantity: doorData.Anzahl || 1,
              type: doorData.Typ || "",
              outside: doorData.SizeA || "",
              inside: doorData.SizeI || "",
              optionsSelected: (doorData.Option || "")
                .split(",")
                .map(s => s.trim())
                .filter(Boolean),
            } : {}),
            // Schlüssel‑Felder
            checked: !!mat?.Berechtigung,
            keyquantity: keyData.Anzahl || 1,
            keyname: keyData.Bezeichnung || `Schlüssel ${j + 1}`,
            keycolor: keyData.Farbe || "",
          };
        }
      }

      // 4) Erfolgsmeldung
      this.alertMessage = "Ihre Konfiguration wurde erfolgreich geladen.";
      this.alertType = "success";
      setTimeout(() => this.alertMessage = "", 3000);
    },

    // E-Mail-Versand
    async sendConfirmationEmails() {
      // E-Mail an den Kunden
      const customerMessage = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #007BFF;">Ihre Schlüssel-Konfiguration wurde gespeichert</h2>
            <p>Vielen Dank für Ihre Konfiguration. Diese wurde erfolgreich gespeichert und kann jederzeit abgerufen werden.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Anlagennummer:</strong> ${this.anlageNr}</p>
              <p style="margin: 10px 0 0;"><strong>Passwort:</strong> ${this.password}</p>
            </div>
            <p>
              Sie können Ihre Konfiguration jederzeit über unseren Konfigurator mit diesen Zugangsdaten wieder aufrufen 
              und bearbeiten.
            </p>
            <p>
              Falls Sie Fragen haben, können Sie uns gerne kontaktieren.
            </p>
            <p>
              Mit freundlichen Grüßen,<br>
              Ihr stt-shop Team
            </p>
          </body>
        </html>
      `;

      await $fetch("./api/mail", {
        method: "POST",
        body: {
          to: this.email,
          subject: "Ihre Schließanlagen-Konfiguration wurde gespeichert",
          html: customerMessage,
        },
      });

      // E-Mail an den Administrator
      const adminMessage = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #007BFF;">Neue Schließanlagen-Konfiguration</h2>
            <p>Es wurde eine neue Konfiguration erstellt:</p>
            <table style="border-collapse: collapse; width: 100%;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Anlagennummer:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${this.anlageNr}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Modell:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${this.store.selectedModel}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Typ:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${this.isSchliessanlage ? "Schließanlage" : "Gleichschließung"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${this.name || "-"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>E-Mail:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${this.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Telefon:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${this.phone || "-"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Passwort:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${this.password}</td>
              </tr>
            </table>
            <p style="margin-top: 20px;">Diese Konfiguration wurde in der Datenbank gespeichert.</p>
          </body>
        </html>
      `;

      await $fetch("./api/mail", {
        method: "POST",
        body: {
          to: "office@secutimetec.de",
          subject: "Neue Schließanlagen-Konfiguration",
          html: adminMessage,
        },
      });
    },

    // Validierungsmethoden
    validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
  },

  mounted() {
    if (this.$route.query.anlageNr) {
      this.id = this.$route.query.anlageNr;
      this.loadInstallation();
    } else {
      this.generateRandomAnlagenNummer();
    }


    // Modell aus URL laden
    this.selectedModelLocal = this.store.selectedModel;
    this.oldModel = this.store.selectedModel;

    // Anlagennummer aus URL laden
    if (this.$route.query.anlageNr) {
      this.id = this.$route.query.anlageNr;
      this.loadInstallation();
    }
  }
};
</script>

<style lang="scss" scoped>
.mobile-container {
  max-width: 100%;
  padding: 16px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  color: #333;
  background-color: #f8f9fa;
}

/* Fortschrittsanzeige */
.progress-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 10px 0;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: default;

  .step-number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #ddd;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-bottom: 4px;
  }

  .step-label {
    font-size: 14px;
    color: #666;
  }

  &.active {
    .step-number {
      background-color: #0ea5e9;
      color: white;
    }

    .step-label {
      color: #0ea5e9;
      font-weight: bold;
    }
  }

  &.completed {
    cursor: pointer;

    .step-number {
      background-color: #10b981;
      color: white;
    }

    .step-label {
      color: #10b981;
    }
  }
}

.progress-line {
  flex-grow: 1;
  height: 2px;
  background-color: #ddd;
  margin: 0 8px;
  margin-bottom: 15px;
}

/* Header */
.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h1 {
    font-size: 24px;
    margin: 0;
    color: #333;
  }

  .info-icon {
    cursor: pointer;
    font-size: 24px;
    color: #0ea5e9;
  }
}

.info-tooltip {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  line-height: 1.4;
}

/* Allgemeine Sektionen */
.mobile-section {
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: 600;
    margin-bottom: 6px;
    font-size: 16px;
  }

  input,
  select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    background-color: white;
  }

  &.toggle-section {
    display: flex;
    align-items: center;

    label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
  }
}

/* Listenbereiche */
.doors-list-header,
.keys-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  h2 {
    margin: 0;
    font-size: 20px;
  }

  .add-door-button,
  .add-key-button {
    font-size: 14px;
  }
}

/* Akkordeon für Türen */
.mobile-accordion {
  background-color: white;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: white;
  cursor: pointer;
  border-bottom: 1px solid transparent;

  .accordion-title {
    display: flex;
    align-items: center;
    gap: 10px;

    .door-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: #0ea5e9;
      color: white;
      font-size: 14px;
      font-weight: 600;
    }

    .door-name {
      font-weight: 600;
    }
  }

  i {
    color: #0ea5e9;
    font-size: 18px;
  }
}

.accordion-content {
  padding: 16px;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
}

/* Input-Gruppen innerhalb von Akkordeon */
.input-group {
  margin-bottom: 16px;

  label {
    display: block;
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 14px;
  }

  .sublabel {
    font-weight: normal;
    font-size: 12px;
    color: #666;
  }

  select,
  input {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 15px;
  }

  &.size-group {
    .size-inputs {
      display: flex;
      gap: 12px;

      .size-input-container {
        flex: 1;
      }
    }
  }
}

/* Buttons für Optionen */
.options-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 6px;

  .options-button-text {
    flex: 1;
    color: #333;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 8px;
  }

  i {
    font-size: 16px;
    color: #0ea5e9;
  }
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.action-button {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  background-color: #0ea5e9;
  color: white;
  cursor: pointer;
  text-align: center;
  margin-top: 16px;

  &.next-step-button {
    background-color: #10b981;
  }

  &.save-button {
    background-color: #f59e0b;
  }
}

/* Schlüsselkarten */
.keys-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.key-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .key-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background-color: #f3f4f6;
    border-bottom: 1px solid #ddd;

    .key-name {
      font-weight: 600;
      font-size: 14px;
    }
  }

  .key-card-body {
    padding: 12px;

    .key-quantity {
      margin-bottom: 12px;

      label {
        display: block;
        font-size: 12px;
        margin-bottom: 4px;
        color: #666;
      }

      .quantity-input {
        width: 60px;
        padding: 4px 8px;
        font-size: 14px;
      }
    }

    .door-assignments {
      label {
        display: block;
        font-size: 12px;
        margin-bottom: 4px;
        color: #666;
      }
    }

    .door-checkbox-list {
      max-height: 150px;
      overflow-y: auto;
      border: 1px solid #eee;
      border-radius: 4px;
      padding: 4px;
      margin-bottom: 8px;

      .door-checkbox-item {
        margin-bottom: 4px;

        label {
          display: flex;
          align-items: center;
          font-size: 13px;
          color: #333;

          input[type="checkbox"] {
            margin-right: 6px;
          }
        }
      }
    }
  }
}

/* Navigation zwischen Schritten */
.step-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;

  .navigation-button {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    border-radius: 6px;
    font-weight: 600;

    &.back {
      background-color: #f3f4f6;
      color: #333;

      i {
        margin-right: 8px;
      }
    }

    &.next {
      background-color: #10b981;
      color: white;

      i {
        margin-left: 8px;
      }
    }
  }
}

/* Zusammenfassung */
.summary-step {
  h2 {
    margin-bottom: 20px;
  }

  .summary-section {
    background-color: white;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    h3 {
      margin-top: 0;
      margin-bottom: 12px;
      font-size: 18px;
      color: #0ea5e9;
      border-bottom: 1px solid #eee;
      padding-bottom: 8px;
    }
  }

  .summary-item {
    display: flex;
    margin-bottom: 8px;

    .summary-label {
      width: 150px;
      font-weight: 600;
    }
  }

  .summary-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  max-height: 90vh;
  overflow: visible !important;

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #eee;

    h3 {
      margin: 0;
      font-size: 18px;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #999;

      &:hover {
        color: #333;
      }
    }
  }

  .modal-body {
    padding: 16px;
    max-height: 50vh;
    overflow-y: auto;

    .option-item {
      margin-bottom: 10px;

      .option-label {
        display: flex;
        align-items: center;
        cursor: pointer;

        input[type="checkbox"] {
          margin-right: 8px;
        }
      }
    }

    .no-options {
      color: #666;
      font-style: italic;
    }
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 12px 16px;
    border-top: 1px solid #eee;
    gap: 8px;

    .modal-button {
      padding: 8px 16px;
      border-radius: 6px;
      flex: 0 0 auto;
      /* kein Stretchen */
      width: auto !important;

      &.confirm {
        background-color: #0ea5e9;
        color: white;
      }

      &.cancel {
        background-color: #f3f4f6;
        color: #333;
      }
    }
  }
}
</style>