<template>

  <div class="heading">
    <h1>Schließanlagenkonfigurator</h1>
    <div class="number">
      <h2>Anlagennummer:</h2>
      <input type="text" readonly style="width: 140px;" v-model="anlageNr" placeholder="Anlagenummer" />
    </div>
  </div>

  <div class="flex-container" style="margin:240px 0 0 240px;">
    <div class="configurator">
      <div class="checkbox-row" v-for="(row, rowIndex) in rows" :key="rowIndex">
        <div class="checkbox-item" v-for="(checkbox, colIndex) in row" :key="colIndex" v-show="colIndex < 1">
          <div class="flex-container" v-show="colIndex < 1">
            <!--Position-->
            <div>
              <h3 v-show="rowIndex < 1 && colIndex < 1"> Pos. </h3>
              <UBadge v-show="colIndex < 1" v-model="checkbox.position" color="sky" size="lg" variant="solid" style="
              width: 30px;
              display: flex;
              justify-content: center;
              align-items: center;            
            ">
                {{ rowIndex + 1 }}
              </UBadge>
            </div>
            <!--Türbezeichnung-->
            <div class="door-designation" v-show="colIndex < 1">
              <h3 v-show="rowIndex < 1 && colIndex < 1">Türbezeichnung</h3>
              <UInput v-show="colIndex < 1" v-model="checkbox.doorDesignation" color="gray" size="sm" variant="outline"
                placeholder="z.B. Haupteingang" style="width: 200px" />
            </div>
            <!--Zylinderanzahl-->
            <div class="quantity">
              <h3 v-show="rowIndex < 1">Anzahl</h3>
              <UInput v-model="checkbox.doorquantity" min="1" class="quantity-input" color="gray" size="sm"
                type="number" variant="outline" style="width: 80px" />
            </div>
            <!--Zylindertyp-->
            <div class="cylinder-type">
              <h3 v-show="rowIndex < 1">Zylinder-Typ</h3>
              <USelectMenu v-model="checkbox.type" color="gray" :options="cylinderType" placeholder="Zylinder wählen..."
                style="width: 200px" />
            </div>
            <div class="sizes" v-if="checkbox.type == 'Doppelzylinder' ||
        checkbox.type == 'Knaufzylinder (innen)'
        ">
              <div class="outside">
                <h3 v-show="rowIndex < 1">Außen</h3>
                <USelectMenu v-model="checkbox.outside" color="gray" :options="sizes" placeholder="..."
                  style="width: 80px" />
              </div>
              <div class="inside">
                <h3 v-show="rowIndex < 1">Innen</h3>
                <USelectMenu v-model="checkbox.inside" color="gray" :options="sizes" placeholder="..."
                  style="width: 80px" />
              </div>
            </div>
            <div class="sizes-halfcylinder" v-else-if="checkbox.type == 'Halbzylinder'">
              <div class="outside">
                <h3 v-show="rowIndex < 1">Außen</h3>
                <USelectMenu v-model="checkbox.outside" color="gray" :options="sizes" placeholder="..."
                  style="width: 80px" />
              </div>
              <div class="inside">
                <h3 v-show="rowIndex < 1">Innen</h3>
                <UBadge color="gray" variant="outline" size="lg" style="width: 80px">&nbsp;10&nbsp;</UBadge>
              </div>
            </div>
            <div class="sizes-empty" v-else>
              <div class="outside">
                <h3 v-show="rowIndex < 1">Außen</h3>
                <UBadge color="gray" variant="outline" size="lg" style="width: 80px">&nbsp;N/A&nbsp;</UBadge>
              </div>
              <div class="inside">
                <h3 v-show="rowIndex < 1">Innen</h3>
                <UBadge color="gray" variant="outline" size="lg" style="width: 80px">&nbsp;N/A&nbsp;</UBadge>
              </div>
            </div>
            <div class="options" v-if="checkbox.type == 'Doppelzylinder'">
              <h3 v-show="rowIndex < 1">N&G-Funktion</h3>
              <USelectMenu v-model="checkbox.options" :options="cylinderOptions" color="gray"
                placeholder="Optionen auswählen" @click="resetOptions(rowIndex)" style="width: 200px" />
            </div>
            <div class="options-empty" v-else>
              <h3 v-show="rowIndex < 1">N&G-Funktion</h3>
              <UBadge color="gray" variant="outline" size="lg" style="width: 200px">&nbsp;N/A&nbsp;</UBadge>
            </div>
            <!--Zylinder löschen & duplizieren-->
            <div class="duplicate">
              <br v-show="rowIndex < 1" />
              <UButton icon="i-heroicons-document-duplicate" size="sm" color="sky" variant="outline" :trailing="false"
                @click="duplicateRow(rowIndex)" />
            </div>
            <div class="delete">
              <br v-show="rowIndex < 1" />
              <UButton icon="i-heroicons-trash" size="sm" color="red" variant="solid" :trailing="false"
                @click="deleteRow(rowIndex)" />
            </div>
          </div>
        </div>

        <div class="checkbox-item" v-for="(checkbox, colIndex) in row" :key="colIndex">
          <input type="text" placeholder="Schlüsselname" readonly class="key-name" v-model="checkbox.keyname"
            v-show="rowIndex < 1" style="
              writing-mode: vertical-rl;
              position: absolute;
              margin-top: -20.8em;
              padding: 4px;
              height: 150px;
              cursor: default;
              border: 1px solid lightgray;
              border-radius: 8px;
              
            ">
          </input>
          <input min="1" type="number" placeholder="1" v-model="checkbox.keyquantity" v-show="rowIndex < 1" style="
              
              position: absolute;
              margin-top: -11.8em;
              width: 33px;
              height: 20px;
              font-size: 12px;
              border: 1px dotted lightblue;
              border-radius: 4px;
              "></input>
          <UButton icon="i-heroicons-pencil" v-show="rowIndex < 1" @click="openModal(colIndex)" size="sm" color="sky"
            variant="solid" :trailing="false" style="
              writing-mode: vertical-rl;
              position: absolute;
              margin-top: -4.4em;
            " />
          <ColumnModal :columnId="colIndex" v-model="modalStates[colIndex]"
            @update-column-name="updateColumnName(colIndex, $event)" @close-this-modal="closeModal(colIndex)" />
          <p v-show="rowIndex < 1">&nbsp;</p>
          <UCheckbox name="{{ rowIndex * 100 + colIndex + 1 }}" v-model="checkbox.checked" color="blue" />
          <p v-if="this.rows.length - 1 < 1">&nbsp;</p>
          <UButton @click="deleteCheckbox(colIndex)" v-show="rowIndex == this.rows.length - 1" icon="i-heroicons-trash"
            size="sm" color="red" variant="solid" :trailing="false" style="
              writing-mode: vertical-rl;
              position: absolute;
              margin-top: 5.5em;
            " />
          <UButton @click="duplicateCol(colIndex)" v-show="rowIndex == this.rows.length - 1"
            icon="i-heroicons-document-duplicate" size="sm" color="sky" variant="outline" :trailing="false" style="
              writing-mode: vertical-rl;
              position: absolute;
              margin-top: 11.4em;
            " />
        </div>
      </div>
      <div class="buttons">
        <UButton class="add-door-button" icon="i-heroicons-plus-16-solid" @click="addRow" size="sm" color="amber"
          variant="solid" :trailing="false">Tür hinzufügen</UButton>
        <!-- <UButton class="test-button" @click="test" size="sm" color="amber" variant="solid" :trailing="false">Test
        </UButton> -->
      </div>
      <div class="buttons-scnd" style="margin: 20px;">
        <UButton class="add-door-button" icon="i-heroicons-cloud-arrow-down-16-solid" @click="isOpenL = true" size="sm"
          color="amber" variant="solid" :trailing="false">Anlage laden</UButton>
        <UModal v-model="isOpenL">
          <div class="p-4">
            <div class="modal-flex-buttons-top">
              <h2>Anlage laden</h2>
              <UButton color="red" @click="isOpenL = false" style="font-weight: 600;">X</UButton>
            </div>
            <br>
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="id">Anlagennummer:</label>
                <UInput color="amber" autofocus="true" id="id" v-model="id" min="1" type="number" required />
              </div>

              <br>
              <UButton @click="loadInstallation" type="submit" color="amber" variant="solid">Laden
              </UButton>
            </form>
          </div>
        </UModal>
        <UButton class="add-door-button" icon="i-heroicons-arrow-left-start-on-rectangle-16-solid"
          @click="isOpen = true" size="sm" color="amber" variant="solid" :trailing="false">Anlage speichern</UButton>
        <UModal v-model="isOpen">
          <div class="p-4">
            <div class="modal-flex-buttons-top">
              <h2>Anlage speichern</h2>
              <UButton color="red" @click="isOpen = false" style="font-weight: 600;">X</UButton>
            </div>
            <br>
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="object">Anlagenname:</label>
                <UInput autofocus="true"color="amber" id="object" v-model="object" type="text" placeholder="z.B. Mustermann Schließung" required />
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
                <UInput color="amber" id="phone" v-model="phone" type="tel" placeholder="Optional" />
              </div>
              <div class="form-group">
                <label for="company">Firma:</label>
                <UInput color="amber" id="company" v-model="company" type="tel" placeholder="Optional" />
              </div>
              <br>
              <UButton @click="saveInstallation" type="submit" color="amber" variant="solid">Speichern und abschicken
              </UButton>
            </form>
          </div>
        </UModal>
        <!-- <UButton class="add-door-button" icon="i-heroicons-arrow-left-start-on-rectangle-16-solid"
          @click="generateRandomAnlagenNummer()" size="sm" color="amber" variant="solid" :trailing="false">Nummer
        </UButton> -->
      </div>
    </div>
    <UButton class="add-key-button" icon="i-heroicons-plus-16-solid" @click="addCheckbox" size="sm" color="amber"
      variant="solid" :trailing="false">Schlüssel hinzufügen</UButton>
  </div>
</template>

<script>
import ColumnModal from './ColumnModal.vue';

export default {

  components: {

    ColumnModal,

  },

  data() {

    return {

      // Daten über die Anlage
      anlageNr: '',
      object: ref([]),
      id: ref([]),
      email: ref([]),
      name: ref([]),
      phone: ref([]),
      company: ref([]),

      // Zum Öffnen und Schließen aller Modale
      modalStates: {},
      isOpen: false,
      isOpenL: false,

      // Das Row Objekt mit Daten über die Konfiguration pro Zeile
      rows: [
        [
          {
            position: 1,
            doorDesignation: "",
            doorquantity: 1,
            type: "",
            outside: "",
            inside: "",
            options: "",
            checked: false,
            keyname: "",
            keyquantity: 1,
          },
        ],
      ],

      // Auswahlmöglichkeiten an Zylindern
      cylinderType: [
        "Doppelzylinder",
        "Knaufzylinder (innen)",
        "Halbzylinder",
        "Vorhangschloss 50mm",
        "Vorhangschloss 80mm",
        "Briefkastenschloss",
      ],

      // Größe und Optionen
      sizes: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
      selectedOptions: ref([]),
      cylinderOptions: ["Not- & Gefahrenfunktion"],

    };
  },

  methods: {

    // Zurücksetzen des angeklickten Selects
    resetOptions(rowIndex) {
      this.rows[rowIndex].options = [];
    },

    // Öffnet das ColumnModal, abhängig vom Column Index
    openModal(colIndex) {
      this.modalStates[colIndex] = true;
    },

    closeModal(colIndex) {
      this.modalStates[colIndex] = false;
    },

    // Zum Benennen der Schlüssel
    updateColumnName(colIndex, newName) {
      this.rows[0][colIndex].keyname = newName;
    },

    // Neues Row Objekt hinzufügen
    addRow() {
      // Anzahl der Checkboxen
      const numCheckboxes = this.rows[0].length;
      const newRow = [];
      for (let i = 0; i < numCheckboxes; i++) {
        // Neue Zeile mit gleicher Anzahl an Checkboxen 
        newRow.push({ checked: false, doorquantity: 1 });
      }
      // Neue Zeile 
      this.rows.push(newRow);
    },

    // Neue Checkboxen hinzufügen
    addCheckbox() {
      this.rows.forEach((checkbox) => {
        // Fügt eine Checkbox an jede Reihe an
        checkbox.push({ checked: false, keyquantity: 1 });
      });
    },

    // Checkbox löschen
    deleteCheckbox(colIndex) {
      this.rows.forEach((row) => {
        if (row.length > 1) {
          row.splice(colIndex, 1);
        }
      });
    },

    // Zeile löschen
    deleteRow(rowIndex) {
      if (rowIndex > 0) {
        this.rows.splice(rowIndex, 1);
      }
      else {
        alert("Hier ist Schluss!");
      }
    },

    // Zeile duplizieren
    duplicateRow(rowIndex) {
      const currentRow = this.rows[rowIndex];
      const newRow = this.deepCopy(currentRow);
      this.rows.splice(rowIndex + 1, 0, newRow);
    },

    // Spalte duplizieren
    duplicateCol(colIndex) {
      this.rows.forEach((row, rowIndex) => {
        if (row[colIndex]) {
          const newCol = this.deepCopy(row[colIndex]);
          row.splice(colIndex + 1, 0, newCol);
        }
      });
    },

    // Funktion um ein Array tief zu kopieren
    deepCopy(obj) {
      if (typeof obj !== "object" || obj === null) {
        // Rückgabe des Objekts selbst, wenn es kein Objekt ist oder null ist
        return obj;
      }
      // Erstellen eines leeren Arrays für Arrays oder eines leeren Objekts für Objekte
      const copy = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          // Rekursives Kopieren von Eigenschaften des Objekts
          copy[key] = this.deepCopy(obj[key]);
        }
      }
      // Rückgabe der tiefen Kopie des Objekts
      return copy;
    },

    // Erstellen einer Random Number
    generateRandomAnlagenNummer() {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      this.anlageNr = randomNum.toString();
    },

    // Zum Testen der API
    async test() {
      const columnStructure = {
        checked: false,
        keyquantity: 1,
      };
      this.rows = [];

      for (let i = 0; i < 4; i++) {
        const row = [];
        for (let j = 0; j < 4; j++) {
          const column = { ...columnStructure };
          column.keyname = `Schlüssel ${j + 1}`;

          row.push(column);
        }
        this.rows.push(row);
      }
    },

    // Anlage speichern 
    async saveInstallation() {
      const queryresultanlage = await $fetch('/api/sqlpostanlageneu', {
        method: 'post',
        body: { ID: 12345, Objekt: this.object, Name: this.name, EMail: this.email, Firma: this.company }
      })
      
      
      const queryresultposition = await $fetch('/api/sqlpostposition', {
        method: 'post',
        body:  
          [{
          "ID": 12345,
      "POS": 1,
      "Bezeichnung": "Haupteingang",
      "Anzahl": "2",
      "Typ": "Doppelzylinder",
      "SizeA": "30",
      "SizeI": "35",
      "Option": ""
          },
          {
            "ID": 12345,
      "POS": 2,
      "Bezeichnung": "Haupteingang",
      "Anzahl": "2",
      "Typ": "Doppelzylinder",
      "SizeA": "30",
      "SizeI": "35",
      "Option": ""
          }

          
        
      ]
      })

      //Schließen des Modals
      this.isOpen = false;
    },

    // Anlage laden
    async loadInstallation() {

      this.rows.length = 1;

      const queryresultanlage = await $fetch('/api/sqlgetanlage', {
        method: 'post',
        body: { ID: this.id }
      })
      this.anlageNr = queryresultanlage.queryresult[0].ID;
      this.object = queryresultanlage.queryresult[0].Objekt;
      this.name = queryresultanlage.queryresult[0].Name;
      this.email = queryresultanlage.queryresult[0].EMail;
      this.company = queryresultanlage.queryresult[0].Firma;

      // Zeilenanzahle 
      const queryresultposition = await $fetch('/api/sqlgetposition', {
        method: 'post',
        body: { ID: this.id }
      })

      // Ermitteln Anzahl der Positionen der geladenen Anlage
      var maxPosition = 0;
      queryresultposition.queryresult.forEach(entry => {
        // Aktualisiere den größten Positionswert, wenn der aktuelle Eintrag eine größere Position hat
        if (entry.POS > maxPosition) {
          maxPosition = entry.POS;
        }
      });

      // Setzen der Zeilen und Checkboxen
      for (let i = 0; i < maxPosition - 1; i++) {
        const numCheckboxes = this.rows[0].length;
        const newRow = [];
        for (let j = 0; j < numCheckboxes; j++) {
          // Neue Zeile mit gleicher Anzahl an Checkboxen 
          newRow.push({ checked: false, doorquantity: 1 });
        }
        // Neue Zeile 
        this.rows.push(newRow);

      }

      // Beschreiben der Positionswerte
      for (let i = 0; i < maxPosition; i++) {
        this.rows[i][0].doorDesignation = queryresultposition.queryresult[i].Bezeichnung;
        this.rows[i][0].doorquantity = queryresultposition.queryresult[i].Anzahl;
        this.rows[i][0].type = queryresultposition.queryresult[i].Typ;
        this.rows[i][0].outside = queryresultposition.queryresult[i].SizeA;
        this.rows[i][0].inside = queryresultposition.queryresult[i].SizeI;
        this.rows[i][0].options = queryresultposition.queryresult[i].Option;
      }

      //Schließen des Modals
      this.isOpenL = false;
    },

    mounted() {
      this.generateRandomAnlagenNummer();
    },
  },
};
</script>

<style scoped>
.heading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.heading h1 {
  font-size: 1.8em;
}

.flex-container {
  display: flex;
  flex-direction: row;
  gap: 10px;

}

.checkbox-row {
  display: flex;
  /* Display rows horizontally */
  margin-bottom: 10px;
  /* Spacing between rows */
  gap: 10px;
}

.checkbox-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Display rows vertically */
  align-items: center;
  margin-right: 10px;
  /* Spacing between checkboxes */
  padding-bottom: -10px;
}

.buttons,
.sizes-empty,
.sizes-halfcylinder,
.sizes,
.buttons-scnd,
.number {
  display: flex;
  /* Display buttons horizontally */
  justify-content: flex-start;
  /* Align buttons to the right */
  gap: 10px;
  /* Spacing between buttons */
}

.number {
  font-size: 20px;
}

.number input {
  width: 80px;
}

.add-door-button {
  display: flex;
  justify-content: center;
  font-weight: 600;
  height: 36px;
  width: 200px;
}

.test-button {
  height: auto;
}

.modal-flex-buttons-top {
  display: flex;
  justify-content: space-between;
}

.add-key-button {
  margin: 23px 0 0 2px;
  writing-mode: vertical-rl;
  display: flex;
  justify-content: center;
  /* Align buttons to the right */
  font-weight: 600;
  height: 200px;
}

.key-name {
  width: 30px;
  overflow: hidden;
}
</style>
