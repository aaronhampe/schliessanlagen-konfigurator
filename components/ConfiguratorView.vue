<template>
  <div class="heading">
    <div class="first-flex">
      <h1>
        {{
          isSchliessanlage
            ? "Konfigurator für eine Schließanlage"
            : "Konfigurator für eine Gleichschließung"
        }}
      </h1>
      <div class="info-icon" @mouseenter="hoverInfo = true" @mouseleave="hoverInfo = false">
        <i class="i-heroicons-information-circle" />
        <transition name="fade">
          <div v-if="hoverInfo" class="tooltip-box">
            Bei einer Gleichschließung können alle Schlüssel alle Türen
            aufschließen, während bei einer Schließanlage die Schlüssel
            eine gezielte Zuweisung benötigen.
          </div>
        </transition>
      </div>
    </div>
    <div class="system-number">
      <h2>Anlagennummer:</h2>
      <input type="text" readonly v-model="anlageNr" placeholder="Anlagenummer" />
    </div>


    <div class="model-container">
      <h3>Modellpräferenz:</h3>
      <select :value="selectedModelLocal" @change="onModelSelect($event)">
        <option v-for="model in store.availableModels" :key="model" :value="model">
          {{ model }}
        </option>
      </select>

    </div>

    <UModal v-model="isWarningModalOpen" class="warning-modal">
      <div class="modal-header">
        <h2>Achtung!</h2>
        <button class="close-button" @click="isWarningModalOpen = false">X</button>
      </div>
      <div class="modal-body">
        <p>Beim Wechsel des Modells können alle eingegebenen Daten verloren gehen.</p>
        <p>Möchten Sie den Modellwechsel wirklich durchführen?</p>
      </div>
      <div class="modal-footer">
        <button class="confirm-button" @click="confirmChange">Ja, ändern</button>
        <button class="cancel-button" @click="cancelChange">Abbrechen</button>
      </div>
    </UModal>
  </div>

  <div class="flex-container">
    <div class="configurator">
      <div class="checkbox-row" v-for="(row, rowIndex) in rows" :key="rowIndex">
        <div class="checkbox-item" v-for="(checkbox, colIndex) in row" :key="colIndex" v-show="colIndex < 1">
          <div class="door-row" v-if="colIndex < 1">
            <div>
              <h3 v-if="rowIndex < 1 && colIndex < 1">Pos.</h3>
              <UBadge class="u-badge" v-if="colIndex < 1" v-model="checkbox.position" color="sky" size="lg"
                variant="solid">
                {{ rowIndex + 1 }}
              </UBadge>
            </div>

            <div class="door-designation" v-if="colIndex < 1">
              <h3 v-if="rowIndex < 1 && colIndex < 1">Türbezeichnung</h3>
              <UInput v-if="colIndex < 1" class="door-designation" v-model="checkbox.doorDesignation" color="sky"
                size="sm" variant="outline" placeholder="z.B. Haupteingang" />
            </div>

            <div class="quantity">
              <h3 v-if="rowIndex < 1">Anzahl</h3>
              <UInput v-model="checkbox.doorquantity" class="quantity-input" min="1" color="sky" size="sm" type="number"
                variant="outline" />
            </div>

            <div class="cylinder-type">
              <h3 v-if="rowIndex < 1">Zylinder-Typ</h3>
              <select v-model="checkbox.type" @change="onTypeChange(checkbox)" class="cylinder-type">
                <option disabled value="">Bitte Typ auswählen</option>
                <option v-for="type in store.availableTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>

            <div class="sizes">
              <div>
                <h3 v-if="rowIndex < 1">Außen</h3>
                <select class="outside" v-model.number="checkbox.outside" @change="onOutsideSizeChange(checkbox)">
                  <option value="">...</option>
                  <option v-for="size in getAvailableOutsideSizes(checkbox)" :key="size" :value="size">
                    {{ size }} mm
                  </option>
                </select>
              </div>
              <div>
                <h3 v-if="rowIndex < 1">Innen</h3>
                <select class="inside" v-model.number="checkbox.inside" @change="onInsideSizeChange(checkbox)">
                  <option value="">...</option>
                  <option v-for="size in getAvailableInsideSizes(checkbox)" :key="size" :value="size">
                    {{ size }} mm
                  </option>
                </select>
              </div>
            </div>

            <!--Optionen-->
            <div class="options">
              <h3 v-if="rowIndex < 1">Optionen</h3>
              <UButton @click="openOptionsModal(rowIndex)" variant="solid" size="sm" color="sky" class="dropdown-button"
                icon="i-heroicons-cog">
                {{ getSelectedOptionsText(checkbox) || "..." }}
              </UButton>
            </div>

            <!--Zylinder löschen & duplizieren-->
            <div class="duplicate">
              <br v-if="rowIndex < 1" />
              <UButton icon="i-heroicons-document-duplicate" size="sm" color="sky" variant="outline" :trailing="false"
                @click="duplicateRow(rowIndex)" />
            </div>
            <div class="delete">
              <br v-if="rowIndex < 1" />
              <UButton icon="i-heroicons-trash" style="color: white" size="sm" color="red" variant="solid"
                :trailing="false" @click="deleteRow(rowIndex)" />
            </div>
          </div>
        </div>

        <div class="checkbox-item" v-for="(checkbox, colIndex) in row" :key="colIndex">
          <input type="text" placeholder="Schlüsselname" readonly class="key-name" v-model="checkbox.keyname"
            v-if="rowIndex < 1" :class="isSchliessanlage ? 'default-margin' : 'gleichschliessung-margin'
          " />

          <input min="1" class="key-quantity" type="number" placeholder="1" v-model="checkbox.keyquantity"
            v-if="rowIndex < 1" />
          <UButton class="button-edit" icon="i-heroicons-pencil" v-if="rowIndex < 1" @click="openModal(colIndex)"
            size="sm" color="sky" variant="solid" :trailing="false" />
          <ColumnModal v-if="rowIndex < 1" :columnId="colIndex" v-model="modalStates[colIndex]"
            @update-column-name="updateColumnName(colIndex, $event)" @close-this-modal="closeModal(colIndex)" />
          <p v-if="rowIndex < 1">&nbsp;</p>
          <UCheckbox class="checkbox" name="{{ rowIndex * 100 + colIndex + 1 }}" v-model="checkbox.checked" color="blue"
            variant="solid" :disabled="!isSchliessanlage" :true-value="true" :false-value="false" />
          <p v-if="this.rows.length - 1 < 1">&nbsp;</p>
          <UButton @click="deleteCheckbox(colIndex)" v-if="rowIndex == this.rows.length - 1" class="button-delete"
            icon="i-heroicons-trash" size="sm" color="red" variant="solid" :trailing="false" />
          <UButton @click="duplicateCol(colIndex)" v-if="rowIndex == this.rows.length - 1" class="button-duplicate"
            icon="i-heroicons-document-duplicate" size="sm" color="sky" variant="outline" :trailing="false" />
        </div>

      </div>
      <div class="buttons">
        <UButton class="button-default" icon="i-heroicons-plus-16-solid" @click="addRow" size="sm" color="amber"
          variant="solid" :trailing="false">Tür hinzufügen</UButton>
        <UButton class="button-default" @click="navigateToSysteme" size="sm" color="amber" variant="solid">
          Zur Systemübersicht
        </UButton>
        <UButton class="button-default" icon="i-heroicons-arrow-left-start-on-rectangle-16-solid" @click="isOpen = true"
          size="sm" color="amber" variant="solid" :trailing="false">Angebot anfordern
        </UButton>

        <UModal v-model="isOpen">
          <div class="p-4">
            <div class="modal-flex-buttons-top">
              <h2 class="modal-h2">Angebot anfordern</h2>
              <UButton color="red" @click="isOpen = false" style="font-weight: 600; color: white">X
              </UButton>
            </div>
            <br />
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="object">Anlagenname:</label>
                <UInput color="amber" id="object" v-model="object" type="text" placeholder="z.B. Mustermann Schließung"
                  required />
              </div>
              <div class="form-group">
                <label for="email">E-Mail-Adresse:</label>
                <UInput color="amber" id="email" v-model="email" type="email" required />
              </div>
              <div class="form-group">
                <label for="name">Name:</label>
                <UInput color="amber" id="name" v-model="name" type="text" required />
              </div>
              <div class="form-group">
                <label for="phone">Telefonnummer:</label>
                <UInput color="amber" id="phone" v-model="phone" type="tel" required />
              </div>
              <div class="form-group">
                <label for="company">Firma:</label>
                <UInput color="amber" id="company" v-model="company" type="tel" placeholder="Optional" />
              </div>
              <br />
              <UButton @click="saveInstallation" style="color: white" type="submit" color="amber" variant="solid">
                Speichern und abschicken
              </UButton>
            </form>
          </div>
        </UModal>
      </div>
      <div class="buttons" style="margin-top: 20px">
        <UButton v-if="showLoadButton" class="button-default" icon="i-heroicons-cloud-arrow-down-16-solid"
          @click="isOpenL = true" size="sm" color="amber" variant="solid" :trailing="false">Anlage laden
        </UButton>
        <UButton v-if="showLoadButton" class="button-default" @click="test" size="sm" color="amber" variant="solid"
          :trailing="false">Test
        </UButton>
      </div>
    </div>
    <UButton class="button-add-key" icon="i-heroicons-plus-16-solid" @click="addCheckbox" size="sm" color="amber"
      variant="solid" :trailing="false">Schlüssel hinzufügen</UButton>

    <!-- Neues Modal für Optionen -->
    <UModal v-for="(row, rowIndex) in rows" :key="'options-modal-' + rowIndex" v-model="isOptionsModalOpen[rowIndex]"
      class="options-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-h2">Optionen auswählen</h2>
          <UButton class="close-button" color="red" @click="closeOptionsModal(rowIndex)">
            X
          </UButton>
        </div>
        <h6>Bitte wählen Sie die gewünschten Optionen aus.</h6>
        <div>
          <div v-for="(checkbox, colIndex) in row" :key="colIndex" v-show="colIndex < 1">
            <div v-for="option in store.getOptionsForType(checkbox.type)" :key="option" class="option-item">
              <label>
                <UCheckbox color="sky" :value="option" v-model="checkbox.optionsSelected" class="option-checkbox" />
                &nbsp{{ option }}
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <UButton class="save-button" style="color: white" color="amber" @click="closeOptionsModal(rowIndex)">
            Speichern
          </UButton>
        </div>
      </div>
    </UModal>

  </div>
  <UModal v-model="isOpenL">
    <div class="p-4">
      <div class="modal-flex-buttons-top">
        <h2 class="modal-h2">Anlage laden</h2>
        <UButton color="red" @click="isOpenL = false">X</UButton>
      </div>
      <br />
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="id">Anlagennummer:</label>
          <UInput color="amber" id="id" v-model="id" min="1" type="number" required />
        </div>
        <div class="form-group">
          <label for="id">Passwort:</label>
          <UInput color="amber" id="password" v-model="password" min="1" type="password" required />
        </div>
        <br />
        <UButton @click="loadInstallation" type="submit" color="amber" variant="solid">Laden
        </UButton>
      </form>
    </div>
  </UModal>
</template>

<script>
import ColumnModal from "./ColumnModal.vue";
import { useCylinderStore } from "@/stores/cylinderStores.js";

export default {
  components: {
    ColumnModal,
  },

  data() {
    return {
      anlageNr: "",
      object: "",
      selectedModel: "",
      id: "",
      password: "",
      email: "",
      name: "",
      phone: "",
      company: "",
      typ: "",
      modalStates: {},
      isOpen: false,
      isOpenL: false,
      isDropdownOpen: {},
      isOptionsModalOpen: {},
      hoverInfo: false,
      selectedModelLocal: '',
      oldModel: '',
      isWarningModalOpen: false,
      pendingModel: null,
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
            checked: !this.isSchliessanlage,
            keyquantity: 1,
            keyname: "Schlüssel 1",
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
      return this.store.isSchliessanlage;
    },
    modelOptions() {
      return Object.keys(zylindermodelle);
    },
    selectedModel: {
      get() {
        return this.store.currentModel;
      },
      set(value) {
        this.store.setModel(value);
      },
    },
    sizesDouble() {
      return this.store.sizesDouble;
    },
    sizesKnob() {
      return this.store.sizesKnob;
    },
    sizesHalf() {
      return this.store.sizesHalf;
    },
    options() {
      return this.store.options;
    },
    cylinderType() {
      return this.store.cylinderType;
    },
    showLoadButton() {
      return true;
    },
  },
  watch: {
    'store.selectedModel': {
      immediate: true,
      handler(newVal) {
        this.selectedModelLocal = newVal;
        this.oldModel = newVal;
      }
    }
  },
  methods: {
    openOptionsModal(rowIndex) {
      this.isOptionsModalOpen[rowIndex] = true;
    },
    closeOptionsModal(rowIndex) {
      this.isOptionsModalOpen[rowIndex] = false;
    },

    toggleDropdown(rowIndex) {
      if (!this.isDropdownOpen[rowIndex]) {
        this.isDropdownOpen[rowIndex] = true;
      } else {
        this.isDropdownOpen[rowIndex] = !this.isDropdownOpen[rowIndex];
      }
    },


    getAllOptionsForType(checkbox) {
      if (this.store.selectedModel && checkbox.type) {
        const typeKey = checkbox.type.replace(/\s*\(.*?\)/g, "");
        const optionsData = this.store.getOptionsForType(typeKey);
        if (Array.isArray(optionsData)) {
          return { Optionen: optionsData };
        } else {
          return optionsData;
        }
      }
      return {};
    },


    getSelectedOptionsText(checkbox) {
      if (checkbox.optionsSelected && checkbox.optionsSelected.length) {
        // Zeige die Werte als Komma-getrennte Liste an
        return checkbox.optionsSelected.join(", ")
      }
      return ""
    },

    optionsToString(options) {
      const optionsArray = [];
      for (const category in options) {
        if (options[category]) {
          optionsArray.push(`${category}:${options[category]}`);
        }
      }
      return optionsArray.join(", ");
    },


    stringToOptions(optionsString, availableOptions) {
      const optionsArray = optionsString.split(", ").filter(Boolean);
      const options = {};
      optionsArray.forEach((optionPair) => {
        const [category, option] = optionPair.split(":");
        if (
          category &&
          option &&
          availableOptions[category]?.includes(option)
        ) {
          options[category] = option;
        } else if (availableOptions.Optionen?.includes(optionPair)) {
          options.Optionen = optionPair;
        }
      });
      return options;
    },

    closeAllDropdowns() {
      Object.keys(this.isDropdownOpen).forEach((key) => {
        this.isDropdownOpen[key] = false;
      });
    },

    handleClickOutside(event) {
      if (
        this.$refs.dropdownContainer &&
        !this.$refs.dropdownContainer.contains(event.target)
      ) {
        this.isDropdownOpen = false;
      }
    },

    changeModel() {
      this.store.setModel(this.selectedModel);
      this.rows.forEach((row) => {
        row.forEach((checkbox) => {
          checkbox.type = "";
          checkbox.inside = "";
          checkbox.outside = "";
          checkbox.options = "";
          checkbox.optionsSelected = [];
        });
      });
    },

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

    getAvailableOptions(checkbox) {
      if (this.store.selectedModel && checkbox.type) {
        const typeKey = checkbox.type.replace(/\s*\(.*?\)/g, "");
        return this.store.getOptionsForType(typeKey);
      }
      return {};
    },

    setOption(checkbox, category, value) {
      if (!checkbox.options) {
        this.$set(checkbox, "options", {});
      }
      this.$set(checkbox.options, category, value);
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

    onTypeChange(checkbox) {
      if (!this.isSchliessanlage) {
        checkbox.checked = true;
      }
      checkbox.inside = "";
      checkbox.outside = "";
      checkbox.options = {};
      checkbox.optionsSelected = [];

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
    resetOptions(rowIndex) {
      this.rows[rowIndex].options = [];
    },

    navigateToSysteme() {
      this.$router.push({
        name: "systeme",
        query: {
          anlageNr: this.anlageNr,
          isSchliessanlage: this.isSchliessanlage,
        },
      });
    },

    openModal(colIndex) {
      this.modalStates[colIndex] = true;
    },

    closeModal(colIndex) {
      this.modalStates[colIndex] = false;
    },

    updateColumnName(colIndex, newName) {
      this.rows[0][colIndex].keyname = newName;
    },

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
          // Bei Schließanlage standardmäßig false, sonst true:
          checked: !this.isSchliessanlage,
          // Schlüssel-spezifische Felder:
          keyquantity: 1,
          keyname: "Schlüssel " + (i + 1),
        });
      }

      this.rows.push(newRow);
    },

    toggleRadio(checkbox, categoryName, option) {
      if (checkbox.options[categoryName] === option) {
        this.set(checkbox.options, categoryName, null);
      } else {
        this.set(checkbox.options, categoryName, option);
      }
    },

    addCheckbox() {
      this.rows.forEach((checkbox) => {
        if (!this.isSchliessanlage) {
          checkbox.push({
            checked: true,
            keyquantity: 1,
            keyname: "Schlüssel " + (this.rows[0].length + 1),
          });
        } else
          checkbox.push({
            checked: false,
            keyquantity: 1,
            keyname: "Schlüssel " + (this.rows[0].length + 1),
          });
      });
    },

    deleteCheckbox(colIndex) {
      if (colIndex === 0) {
        alert("Die erste Spalte enthält die Hauptdaten und kann nicht entfernt werden.");
        return;
      }

      const hasMultipleColumns = this.rows.some((row) => row.length > 1);
      if (hasMultipleColumns || colIndex > 0) {
        this.rows.forEach((row) => row.splice(colIndex, 1));
      } else {
        alert("Die letzte Spalte kann nicht entfernt werden.");
      }
    },


    deleteRow(rowIndex) {
      if (this.rows.length > 1 || rowIndex > 0) {
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

    duplicateCol(colIndex) {
      this.rows.forEach((row, rowIndex) => {
        if (row[colIndex]) {
          const newCol = this.deepCopy(row[colIndex]);
          row.splice(colIndex + 1, 0, newCol);
        }
      });
    },

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
    },

    async test() {
      console.log("test");
      try {
        const response = await fetch("/api/wc-cart-add-item", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: 25012,
            price: 50,
            quantity: 1,
            billing_first_name: "Frank",
            billing_last_name: "Bose",
            billing_address_1: "Walsroder Straße 24-26",
            billing_city: "Wedemark",
            billing_postcode: "30900",
            billing_country: "DE",
            billing_email: "fb@secutimetec.de",
          }),
        });
        console.log(test);
        // https://www.stt-shop.de/warenkorb/?cocart-load-cart=t_e7d1a169c9f7858d77450e9a4927dc
        const result = await response.json();
        if (result.success) {
          console.log = "Produkt erfolgreich in den Warenkorb gelegt.";
        } else {
          console.log =
            "Fehler beim Hinzufügen des Produkts: " + result.message;
        }
      } catch (error) {
        console.log = "Es gab einen Fehler bei der Anfrage: " + error;
      }
    },

    async saveInstallation() {
      const form = document.querySelector("form");
      if (form.checkValidity()) {
        let antwort;
        if (this.anlageNr === "") {
          do {
            this.generateRandomAnlagenNummer();
            const response = await $fetch(
              "/api/sqltestanlage?ID=" + this.anlageNr,
              {
                method: "post",
              }
            );
            antwort = response.message;
          } while (antwort === "Anlagennummer existiert.");
        }

        // Schritt 1: Anlage in der Datenbank speichern
        const queryresultanlage = await $fetch("/api/sqlpostanlageneu", {
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
          },
        });

        if (queryresultanlage) {
          // Schritt 2: Positionen speichern
          const RowObject = this.rows.flatMap((row, rowIndex) =>
            row.map((col, colIndex) => ({
              POS: rowIndex + 1,
              Bezeichnung: row[0].doorDesignation || "",
              Anzahl: row[0].doorquantity || "",
              Typ: row[0].type || "",
              SizeA: row[0].outside || "",
              SizeI: row[0].inside || "",
              // Statt 'this.optionsToString(row[0].options)'
              // nimmst du jetzt das Array row[0].optionsSelected
              Option: (row[0].optionsSelected || []).join(", "),
            }))
          )


          const queryresultposition = await $fetch(
            "/api/sqlpostposition?ID=" + this.anlageNr,
            {
              method: "post",
              body: RowObject,
            }
          );

          // Schritt 3: Schlüssel speichern
          const KeyNameObject = this.rows
            .filter((_, rowIndex) => rowIndex === 0)
            .flatMap((row) =>
              row.map((col, colIndex) => ({
                keyPos: colIndex + 1,
                keyname: col.keyname,
                keyquantity: col.keyquantity || 1,
              }))
            );

          const queryresultschluessel = await $fetch(
            "/api/sqlpostschluessel?ID=" + this.anlageNr,
            {
              method: "post",
              body: KeyNameObject,
            }
          );

          // Schritt 4: Matrix speichern
          const Matrix = this.rows.flatMap((row, rowIndex) =>
            row.map((col, colIndex) => ({
              position: rowIndex + 1,
              keynr: colIndex + 1,
              checked: col.checked || false,
            }))
          );

          const queryresultmatrix = await $fetch(
            "/api/sqlpostmatrix?ID=" + this.anlageNr,
            {
              method: "post",
              body: Matrix,
            }
          );

          // Schritt 5: Navigiere zur systeme.vue Seite mit der Anlagennummer
          this.$router.push({
            name: "systeme",
            query: {
              anlageNr: this.anlageNr,
              isSchliessanlage: this.isSchliessanlage,
            },
          });
        }
      } else {
        form.reportValidity();
      }
    },

    async loadInstallation() {
      this.rows.length = 1;
      this.rows[0].length = 1;

      // Daten für die Anlage
      const queryresultanlage = await $fetch("/api/sqlgetanlage", {
        method: "post",
        body: { ID: this.id },
      });

      if (
        queryresultanlage &&
        queryresultanlage.queryresult &&
        queryresultanlage.queryresult.length > 0
      ) {
        this.anlageNr = queryresultanlage.queryresult[0].ID || "";
        this.object = queryresultanlage.queryresult[0].Objekt || "";
        this.name = queryresultanlage.queryresult[0].Name || "";
        this.email = queryresultanlage.queryresult[0].EMail || "";
        this.phone = queryresultanlage.queryresult[0].Telefon || "";
        this.company = queryresultanlage.queryresult[0].Firma || "";
        this.typ = queryresultanlage.queryresult[0].Typ || "";

        const loadedModel = queryresultanlage.queryresult[0].Modell;
        this.store.setModel(loadedModel);
      }

      const queryresultposition = await $fetch("/api/sqlgetposition", {
        method: "post",
        body: { ID: this.id },
      });
      const maxZeilePosition = Math.max(
        ...queryresultposition.queryresult.map((item) => item.POS)
      );

      for (let i = 0; i < maxZeilePosition - 1; i++) {
        const numCheckboxes = this.rows[0].length;
        const newRow = [];
        for (let j = 0; j < numCheckboxes; j++) {
          newRow.push({ checked: false, doorquantity: 1 });
        }
        this.rows.push(newRow);
      }

      queryresultposition.queryresult.forEach((item) => {
        const zeile = item.POS - 1
        this.rows[zeile][0].doorDesignation = item.Bezeichnung
        this.rows[zeile][0].doorquantity = item.Anzahl || 1
        this.rows[zeile][0].type = item.Typ || ""
        this.rows[zeile][0].outside = item.SizeA || ""
        this.rows[zeile][0].inside = item.SizeI || ""

        const loadedString = item.Option || ""
        this.rows[zeile][0].optionsSelected = loadedString
          .split(",")
          .map(s => s.trim())
          .filter(Boolean)
      })

      const queryresultschluessel = await $fetch("/api/sqlgetschluessel", {
        method: "post",
        body: { ID: this.id },
      });

      const maxSpalteSchluessel = Math.max(
        ...queryresultschluessel.queryresult.map((item) => item.KeyPOS)
      );

      while (this.rows[0].length < maxSpalteSchluessel) {
        this.addCheckbox();
      }

      queryresultschluessel.queryresult.forEach((item) => {
        const spalte = item.KeyPOS - 1;
        this.rows[0][spalte].keyname = item.Bezeichnung;
        this.rows[0][spalte].keyquantity = item.Anzahl;
      });

      const queryresultmatrix = await $fetch("/api/sqlgetmatrix", {
        method: "post",
        body: { ID: this.id },
      });

      const maxZeile = Math.max(
        ...queryresultmatrix.queryresult.map((item) => item.POSZylinder)
      );
      const maxSpalte = Math.max(
        ...queryresultmatrix.queryresult.map((item) => item.POSSchluessel)
      );

      queryresultmatrix.queryresult.forEach((item) => {
        const zeile = item.POSZylinder - 1;
        const spalte = item.POSSchluessel - 1;
        this.rows[zeile][spalte].checked = item.Berechtigung;
      });
      this.isOpenL = false;
    },

    onModelSelect(event) {
      const newlySelected = event.target.value
      if (newlySelected !== this.oldModel) {
        this.pendingModel = newlySelected
        event.target.value = this.oldModel
        this.isWarningModalOpen = true
      }
    },

    confirmChange() {
      if (this.pendingModel) {
        this.store.setModel(this.pendingModel);
        this.rows.forEach((row) => {
          row.forEach((checkbox) => {
            checkbox.type = "";
            checkbox.inside = "";
            checkbox.outside = "";
            checkbox.options = {};          // Falls noch vorhanden
            checkbox.optionsSelected = [];  // <<--- NEU: Array leeren!
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
      this.pendingModel = null
      this.isWarningModalOpen = false
    },


    mounted() {
      this.generateRandomAnlagenNummer();
      document.addEventListener("click", this.closeAllDropdowns);
      this.selectedModelLocal = this.store.selectedModel
      this.oldModel = this.store.selectedModel
    },
    beforeUnmount() {
      document.removeEventListener("click", this.closeAllDropdowns);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles/configurator.scss";
</style>
