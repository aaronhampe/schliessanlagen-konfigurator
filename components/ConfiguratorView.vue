<template>
  <!-- HEADING -->
  <div class="heading">
    <h1>
      {{
        isSchliessanlage
          ? "Konfigurator für eine Schließanlage"
          : "Konfigurator für eine Gleichschließung"
      }}
    </h1>
    <div class="system-number">
      <h2>Anlagennummer:</h2>
      <input
        type="text"
        readonly
        v-model="anlageNr"
        placeholder="Anlagenummer"
      />
    </div>
  </div>

  <div class="flex-container">
    <div class="configurator">
      <div class="checkbox-row" v-for="(row, rowIndex) in rows" :key="rowIndex">
        <div
          class="checkbox-item"
          v-for="(checkbox, colIndex) in row"
          :key="colIndex"
          v-show="colIndex < 1"
        >
          <div class="door-row" v-if="colIndex < 1">
            <!--Position-->
            <div>
              <h3 v-if="rowIndex < 1 && colIndex < 1">Pos.</h3>
              <UBadge
                class="u-badge"
                v-if="colIndex < 1"
                v-model="checkbox.position"
                color="sky"
                size="lg"
                variant="solid"
              >
                {{ rowIndex + 1 }}
              </UBadge>
            </div>
            <!--Türbezeichnung-->
            <div class="door-designation" v-if="colIndex < 1">
              <h3 v-if="rowIndex < 1 && colIndex < 1">Türbezeichnung</h3>
              <UInput
                v-if="colIndex < 1"
                class="door-designation"
                v-model="checkbox.doorDesignation"
                color="blue"
                size="sm"
                variant="outline"
                placeholder="z.B. Haupteingang"
              />
            </div>
            <!--Zylinderanzahl-->
            <div class="quantity">
              <h3 v-if="rowIndex < 1">Anzahl</h3>
              <UInput
                v-model="checkbox.doorquantity"
                class="quantity-input"
                min="1"
                color="blue"
                size="sm"
                type="number"
                variant="outline"
              />
            </div>
            <!--Zylindertyp-->
            <div class="cylinder-type">
              <h3 v-if="rowIndex < 1">Zylinder-Typ</h3>
              <USelectMenu
                v-model="checkbox.type"
                class="cylinder-type"
                color="blue"
                :options="cylinderType"
                placeholder="Zylinder wählen..."
              />
            </div>
            <div
              class="sizes"
              v-if="
                checkbox.type == 'Doppelzylinder' ||
                checkbox.type == 'Knaufzylinder (innen)'
              "
            >
              <div class="outside">
                <h3 v-if="rowIndex < 1">Außen</h3>
                <USelectMenu
                  v-model="checkbox.outside"
                  color="blue"
                  :options="sizes"
                  placeholder="..."
                />
              </div>
              <div class="inside">
                <h3 v-if="rowIndex < 1">Innen</h3>
                <USelectMenu
                  v-model="checkbox.inside"
                  color="blue"
                  :options="sizes"
                  placeholder="..."
                />
              </div>
            </div>
            <div
              class="sizes-halfcylinder"
              v-else-if="checkbox.type == 'Halbzylinder'"
            >
              <div class="outside">
                <h3 v-if="rowIndex < 1">Außen</h3>
                <USelectMenu
                  v-model="checkbox.outside"
                  color="blue"
                  :options="sizes"
                  placeholder="..."
                />
              </div>
              <div class="inside">
                <h3 v-if="rowIndex < 1">Innen</h3>
                <UBadge
                  class="u-badge"
                  color="gray"
                  variant="outline"
                  size="lg"
                >
                  &nbsp;10&nbsp;
                </UBadge>
              </div>
            </div>
            <div class="sizes-empty" v-else>
              <div class="outside">
                <h3 v-if="rowIndex < 1">Außen</h3>
                <UBadge
                  class="u-badge"
                  color="gray"
                  variant="outline"
                  size="lg"
                >
                  &nbsp;N/A&nbsp;
                </UBadge>
              </div>
              <div class="inside">
                <h3 v-if="rowIndex < 1">Innen</h3>
                <UBadge
                  class="u-badge"
                  color="gray"
                  variant="outline"
                  size="lg"
                >
                  &nbsp;N/A&nbsp;
                </UBadge>
              </div>
            </div>
            <div class="options" v-if="checkbox.type == 'Doppelzylinder'">
              <h3 v-if="rowIndex < 1">N&G-Funktion</h3>
              <USelectMenu
                v-model="checkbox.options"
                :options="cylinderOptions"
                color="blue"
                placeholder="Optionen auswählen"
                @click="resetOptions(rowIndex)"
              />
            </div>
            <div class="options" v-else>
              <h3 v-if="rowIndex < 1">N&G-Funktion</h3>
              <UBadge class="u-badge" color="gray" variant="outline" size="lg"
                >&nbsp;N/A&nbsp;
              </UBadge>
            </div>
            <!--Zylinder löschen & duplizieren-->
            <div class="duplicate">
              <br v-if="rowIndex < 1" />
              <UButton
                icon="i-heroicons-document-duplicate"
                size="sm"
                color="sky"
                variant="outline"
                :trailing="false"
                @click="duplicateRow(rowIndex)"
              />
            </div>
            <div class="delete">
              <br v-if="rowIndex < 1" />
              <UButton
                icon="i-heroicons-trash"
                style="color: white"
                size="sm"
                color="red"
                variant="solid"
                :trailing="false"
                @click="deleteRow(rowIndex)"
              />
            </div>
          </div>
        </div>

        <div
          class="checkbox-item"
          v-for="(checkbox, colIndex) in row"
          :key="colIndex"
        >
          <input
            type="text"
            placeholder="Schlüsselname"
            readonly
            class="key-name"
            v-model="checkbox.keyname"
            v-if="rowIndex < 1"
            :class="
              isSchliessanlage ? 'default-margin' : 'gleichschliessung-margin'
            "
          />

          <input
            min=" 1"
            class="key-quantity"
            type="number"
            placeholder="1"
            :disabled="!isSchliessanlage"
            v-model="checkbox.keyquantity"
            v-if="rowIndex < 1 && isSchliessanlage"
          />
          <UButton
            class="button-edit"
            icon="i-heroicons-pencil"
            v-if="rowIndex < 1"
            @click="openModal(colIndex)"
            size="sm"
            color="sky"
            variant="solid"
            :trailing="false"
          />
          <ColumnModal
            v-if="rowIndex < 1"
            :columnId="colIndex"
            v-model="modalStates[colIndex]"
            @update-column-name="updateColumnName(colIndex, $event)"
            @close-this-modal="closeModal(colIndex)"
          />
          <p v-if="rowIndex < 1">&nbsp;</p>
          <UCheckbox
            class="checkbox"
            name="{{ rowIndex * 100 + colIndex + 1 }}"
            v-model="checkbox.checked"
            color="blue"
            variant="solid"
            :disabled="!isSchliessanlage"
            :true-value="true"
            :false-value="false"
          />
          <p v-if="this.rows.length - 1 < 1">&nbsp;</p>
          <UButton
            @click="deleteCheckbox(colIndex)"
            v-if="rowIndex == this.rows.length - 1"
            class="button-delete"
            icon="i-heroicons-trash"
            size="sm"
            color="red"
            variant="solid"
            :trailing="false"
          />
          <UButton
            @click="duplicateCol(colIndex)"
            v-if="rowIndex == this.rows.length - 1"
            class="button-duplicate"
            icon="i-heroicons-document-duplicate"
            size="sm"
            color="sky"
            variant="outline"
            :trailing="false"
          />
        </div>
      </div>
      <div class="buttons">
        <UButton
          class="button-default"
          icon="i-heroicons-plus-16-solid"
          @click="addRow"
          size="sm"
          color="amber"
          variant="solid"
          :trailing="false"
          >Tür hinzufügen</UButton
        >
        <UButton
          class="button-default"
          @click="navigateToSysteme"
          size="sm"
          color="amber"
          variant="solid"
        >
          Zur Systemübersicht
        </UButton>
        <UButton
          class="button-default"
          icon="i-heroicons-arrow-left-start-on-rectangle-16-solid"
          @click="isOpen = true"
          size="sm"
          color="amber"
          variant="solid"
          :trailing="false"
          >Angebot anfordern
        </UButton>

        <UModal v-model="isOpen">
          <div class="p-4">
            <div class="modal-flex-buttons-top">
              <h2 class="modal-h2">Angebot anfordern</h2>
              <UButton
                color="red"
                @click="isOpen = false"
                style="font-weight: 600; color: white"
                >X
              </UButton>
            </div>
            <br />
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="object">Anlagenname:</label>
                <UInput
                  color="amber"
                  id="object"
                  v-model="object"
                  type="text"
                  placeholder="z.B. Mustermann Schließung"
                  required
                />
              </div>
              <div class="form-group">
                <label for="email">E-Mail-Adresse:</label>
                <UInput
                  color="amber"
                  id="email"
                  v-model="email"
                  type="email"
                  required
                />
              </div>
              <div class="form-group">
                <label for="name">Name:</label>
                <UInput
                  color="amber"
                  id="name"
                  v-model="name"
                  type="text"
                  required
                />
              </div>
              <div class="form-group">
                <label for="phone">Telefonnummer:</label>
                <UInput
                  color="amber"
                  id="phone"
                  v-model="phone"
                  type="tel"
                  required
                />
              </div>
              <div class="form-group">
                <label for="company">Firma:</label>
                <UInput
                  color="amber"
                  id="company"
                  v-model="company"
                  type="tel"
                  placeholder="Optional"
                />
              </div>
              <br />
              <UButton
                @click="saveInstallation"
                style="color: white"
                type="submit"
                color="amber"
                variant="solid"
                >Speichern und abschicken
              </UButton>
            </form>
          </div>
        </UModal>
      </div>
      <div class="buttons" style="margin-top: 20px">
        <UButton
          v-if="showLoadButton"
          class="button-default"
          icon="i-heroicons-cloud-arrow-down-16-solid"
          @click="isOpenL = true"
          size="sm"
          color="amber"
          variant="solid"
          :trailing="false"
          >Anlage laden
        </UButton>
        <UButton
          v-if="showLoadButton"
          class="button-default"
          @click="test"
          size="sm"
          color="amber"
          variant="solid"
          :trailing="false"
          >Test
        </UButton>
        <UModal v-model="isOpenL">
          <div class="p-4">
            <div class="modal-flex-buttons-top">
              <h2 class="modal-h2">Anlage laden</h2>
              <UButton
                color="red"
                @click="isOpenL = false"
                >X</UButton
              >
            </div>
            <br />
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="id">Anlagennummer:</label>
                <UInput
                  color="amber"
                  id="id"
                  v-model="id"
                  min="1"
                  type="number"
                  required
                />
              </div>
              <div class="form-group">
                <label for="id">Passwort:</label>
                <UInput
                  color="amber"
                  id="password"
                  v-model="password"
                  min="1"
                  type="password"
                  required
                />
              </div>
              <br />
              <UButton
                @click="loadInstallation"
                type="submit"
                color="amber"
                variant="solid"
                >Laden
              </UButton>
            </form>
          </div>
        </UModal>
      </div>
    </div>
    <UButton
      class="button-add-key"
      icon="i-heroicons-plus-16-solid"
      @click="addCheckbox"
      size="sm"
      color="amber"
      variant="solid"
      :trailing="false"
      >Schlüssel hinzufügen</UButton
    >
  </div>
</template>

<script>
import IsGleichschliessung from "../pages/isGleichschliessung.vue";
import ColumnModal from "./ColumnModal.vue";

export default {
  props: {
    isSchliessanlage: {
      type: Boolean,
      required: true,
      default: true,
    },
  },

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
      modalStates: {},
      isOpen: false,
      isOpenL: false,
      rows: [
        [
          {
            position: 1,
            doorDesignation: "",
            doorquantity: 1,
            type: "",
            outside: "",
            inside: "",
            options: "keine Option",
            checked: !this.isSchliessanlage,
            keyquantity: 1,
            keyname: "Schlüssel 1",
          },
        ],
      ],
      cylinderType: [
        "Doppelzylinder",
        "Knaufzylinder (innen)",
        "Halbzylinder",
        "Vorhangschloss 50mm",
        "Vorhangschloss 80mm",
        "Briefkastenschloss",
      ],
      sizes: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
      selectedOptions: ref([]),
      cylinderOptions: ["keine Option", "Not- & Gefahrenfunktion"],
    };
  },
  computed: {
    showLoadButton() {
      //return this.$route.path.includes('/admin/');
      return true;
    },
  },
  methods: {
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
        if (!this.isSchliessanlage) {
          newRow.push({
            checked: true,
            doorquantity: 1,
            position: this.rows.length + 1,
          });
        } else
          newRow.push({
            checked: false,
            doorquantity: 1,
            position: this.rows.length + 1,
          });
      }
      this.rows.push(newRow);
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
      if (colIndex > 0) {
        this.rows.forEach((row) => {
          if (row.length > 1) {
            row.splice(colIndex, 1);
          }
        });
      } else {
        alert("Die erste Spalte kann nicht entfernt werden.");
      }
    },

    deleteRow(rowIndex) {
      if (rowIndex > 0) {
        this.rows.splice(rowIndex, 1);
      } else {
        alert("Die erste Zeile kann nicht entfernt werden.");
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
              Option: row[0].options || "",
            }))
          );

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
      }

      // Positionsdaten
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
        const zeile = item.POS - 1; // Annahme: POSZylinder beginnt bei 1
        this.rows[zeile][0].doorDesignation = item.Bezeichnung;
        this.rows[zeile][0].doorquantity = item.Anzahl || 1;
        this.rows[zeile][0].type = item.Typ || "";
        this.rows[zeile][0].outside = item.SizeA || "";
        this.rows[zeile][0].inside = item.SizeI || "";
        this.rows[zeile][0].options = item.Option || "";
      });

      // Schlüsseldaten

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
        const spalte = item.KeyPOS - 1; // Annahme: POSSchluessel beginnt bei 1
        this.rows[0][spalte].keyname = item.Bezeichnung;
        this.rows[0][spalte].keyquantity = item.Anzahl;
      });

      // Matrix

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
        const zeile = item.POSZylinder - 1; // Annahme: POSZylinder beginnt bei 1
        const spalte = item.POSSchluessel - 1; // Annahme: POSSchluessel beginnt bei 1
        this.rows[zeile][spalte].checked = item.Berechtigung;
      });

      //console.log(JSON.stringify(queryresultmatrix, null,2 ));

      this.isOpenL = false;
    },

    mounted() {
      this.generateRandomAnlagenNummer();
    },
  },
};
</script>

<style lang="scss" scoped>
//HEADING AND SYSTEMBUMER -------------------------------------------------------------------------------------------------
.heading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  h1 {
    font-size: 1.8em;
  }
  .system-number {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    font-size: 20px;
    input {
      width: 180px;
    }
  }
}

.flex-container {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin: 240px 0 0 340px;

  .checkbox-row {
    display: flex;
    margin-bottom: 8px;
    gap: 8px;
  }

  //DOORROW ELEMENT -----------------------------------------------------------------------------------
  .door-row {
    display: flex;
    flex-direction: row;
    gap: 10px;
    .u-badge {
      width: 30px;
      display: flex;
      justify-content: center;
    }
    .door-designation {
      width: 200px;
      color: #333333;
    }
    .quantity-input {
      width: 60px;
      color: #333333;
    }
    .cylinder-type {
      width: 200px;
      color: #333333;
    }
    .sizes {
      display: flex;
      justify-content: flex-start;
      gap: 10px;

      .outside {
        width: 80px;
        color: #333333;
      }
      .inside {
        width: 80px;
        color: #333333;
      }
    }
    .sizes-halfcylinder {
      display: flex;
      justify-content: flex-start;
      gap: 10px;

      .outside {
        width: 80px;
        color: #333333;
      }
      .inside {
        color: #333333;
        .u-badge {
          width: 80px;
        }
      }
    }
    .sizes-empty {
      display: flex;
      justify-content: flex-start;
      gap: 10px;

      .outside {
        color: #333333;
        .u-badge {
          width: 80px;
        }
      }
      .inside {
        color: #333333;
        .u-badge {
          width: 80px;
        }
      }
    }
    .options {
      width: 200px;
      color: #333333;
      .u-badge {
        width: 200px;
      }
    }
  }

  //CHECKBOX ELEMENT -------------------------------------------------------------------------------
  .checkbox-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    padding-bottom: -10px;
    .key-name {
      width: 32px;
      overflow: hidden;
      writing-mode: vertical-rl;
      position: absolute;
      padding: 4px;
      height: 150px;
      cursor: default;
      border: 1px solid lightgray;
      border-radius: 8px;
      &.default-margin {
        margin-top: -20.8em;
      }
      &.gleichschliessung-margin {
        margin-top: -16.4em;
      }
    }

    .key-quantity {
      position: absolute;
      margin-top: -11.8em;
      width: 33px;
      height: 20px;
      font-size: 12px;
      border: 1px dotted lightblue;
      border-radius: 4px;
    }
    .key-name:focus,
    .key-quantity:focus {
      outline: none;
      border-color: rgb(126, 126, 192);
      box-shadow: 0 0 0 2px rgba(94, 94, 167, 0.5);
    }
    .button-edit {
      writing-mode: vertical-rl;
      position: absolute;
      margin-top: -4.4em;
      color: white;
    }
    .button-delete {
      writing-mode: vertical-rl;
      position: absolute;
      margin-top: 5.5em;
      color: white;
    }
    .button-duplicate {
      writing-mode: vertical-rl;
      position: absolute;
      margin-top: 11.4em;
    }
  }
  .button-add-key {
    margin: 23px 0 0 2px;
    writing-mode: vertical-rl;
    display: flex;
    justify-content: center;
    font-weight: 600;
    height: 200px;
  }
  .buttons {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    .button-default {
      display: flex;
      justify-content: center;
      font-weight: 600;
      height: 36px;
      width: 200px;
      color: #ffffff;
    }
    .modal-h2 {
      font-size: 1.44rem;
    }
  }
}
</style>
