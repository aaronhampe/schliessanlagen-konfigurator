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
                            <UBadge v-show="colIndex < 1" v-model="checkbox.position" color="sky" size="lg"
                                variant="solid" style="
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
                            <UInput v-show="colIndex < 1" v-model="checkbox.doorDesignation" color="gray" size="sm"
                                variant="outline" placeholder="z.B. Haupteingang" style="width: 200px" />
                        </div>
                        <!--Zylinderanzahl-->
                        <div class="quantity">
                            <h3 v-show="rowIndex < 1">Anzahl</h3>
                            <UInput v-model="checkbox.doorquantity" min="1" class="quantity-input" color="gray"
                                size="sm" type="number" variant="outline" style="width: 80px" />
                        </div>
                        <!--Zylindertyp-->
                        <div class="cylinder-type">
                            <h3 v-show="rowIndex < 1">Zylinder-Typ</h3>
                            <USelectMenu v-model="checkbox.type" color="gray" :options="cylinderType"
                                placeholder="Zylinder wählen..." style="width: 200px" />
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
                                <UBadge color="gray" variant="outline" size="lg" style="width: 80px">&nbsp;10&nbsp;
                                </UBadge>
                            </div>
                        </div>
                        <div class="sizes-empty" v-else>
                            <div class="outside">
                                <h3 v-show="rowIndex < 1">Außen</h3>
                                <UBadge color="gray" variant="outline" size="lg" style="width: 80px">&nbsp;N/A&nbsp;
                                </UBadge>
                            </div>
                            <div class="inside">
                                <h3 v-show="rowIndex < 1">Innen</h3>
                                <UBadge color="gray" variant="outline" size="lg" style="width: 80px">&nbsp;N/A&nbsp;
                                </UBadge>
                            </div>
                        </div>
                        <div class="options" v-if="checkbox.type == 'Doppelzylinder'">
                            <h3 v-show="rowIndex < 1">N&G-Funktion</h3>
                            <USelectMenu v-model="checkbox.options" :options="cylinderOptions" color="gray"
                                placeholder="Optionen auswählen" @click="resetOptions(rowIndex)" style="width: 200px" />
                        </div>
                        <div class="options-empty" v-else>
                            <h3 v-show="rowIndex < 1">N&G-Funktion</h3>
                            <UBadge color="gray" variant="outline" size="lg" style="width: 200px">&nbsp;N/A&nbsp;
                            </UBadge>
                        </div>
                        <!--Zylinder löschen & duplizieren-->
                        <div class="duplicate">
                            <br v-show="rowIndex < 1" />
                            <UButton icon="i-heroicons-document-duplicate" size="sm" color="sky" variant="outline"
                                :trailing="false" @click="duplicateRow(rowIndex)" />
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
                    <input min="1" type="number" placeholder="1" v-model="checkbox.keyquantity" v-show="rowIndex < 1"
                        style="
                position: absolute;
                margin-top: -11.8em;
                width: 33px;
                height: 20px;
                font-size: 12px;
                border: 1px dotted lightblue;
                border-radius: 4px;
                "></input>
                    <UButton icon="i-heroicons-pencil" v-show="rowIndex < 1" @click="openModal(colIndex)" size="sm"
                        color="sky" variant="solid" :trailing="false" style="
                writing-mode: vertical-rl;
                position: absolute;
                margin-top: -4.4em;
              " />
                    <ColumnModal :columnId="colIndex" v-model="modalStates[colIndex]"
                        @update-column-name="updateColumnName(colIndex, $event)"
                        @close-this-modal="closeModal(colIndex)" />
                    <p v-show="rowIndex < 1">&nbsp;</p>
                    <UCheckbox name="{{ rowIndex * 100 + colIndex + 1 }}" v-model="checkbox.checked" color="blue" />
                    <p v-if="this.rows.length - 1 < 1">&nbsp;</p>
                    <UButton @click="deleteCheckbox(colIndex)" v-show="rowIndex == this.rows.length - 1"
                        icon="i-heroicons-trash" size="sm" color="red" variant="solid" :trailing="false" style="
                writing-mode: vertical-rl;
                position: absolute;
                margin-top: 5.5em;
              " />
                    <UButton @click="duplicateCol(colIndex)" v-show="rowIndex == this.rows.length - 1"
                        icon="i-heroicons-document-duplicate" size="sm" color="sky" variant="outline" :trailing="false"
                        style="
                writing-mode: vertical-rl;
                position: absolute;
                margin-top: 11.4em;
              " />
                </div>
            </div>
            <div class="buttons">
                <UButton class="add-door-button" icon="i-heroicons-plus-16-solid" @click="addRow" size="sm"
                    color="amber" variant="solid" :trailing="false">Tür hinzufügen</UButton>
                <!-- <UButton class="test-button" @click="test" size="sm" color="amber" variant="solid" :trailing="false">Test
          </UButton> -->
            </div>
            <div class="buttons-scnd" style="margin: 20px;">
                <UButton class="add-door-button" icon="i-heroicons-cloud-arrow-down-16-solid" @click="isOpenL = true"
                    size="sm" color="amber" variant="solid" :trailing="false">Anlage laden</UButton>
                <UModal v-model="isOpenL">
                    <div class="p-4">
                        <div class="modal-flex-buttons-top">
                            <h2 class="modal-h2">Anlage laden</h2>
                            <UButton color="red" @click="isOpenL = false" style="font-weight: 600;">X</UButton>
                        </div>
                        <br>
                        <form @submit.prevent="handleSubmit">
                            <div class="form-group">
                                <label for="id">Anlagennummer:</label>
                                <UInput color="amber" autofocus id="id" v-model="id" min="1" type="number" required />
                            </div>
                            <div class="form-group">
                                <label for="id">Passwort:</label>
                                <UInput color="amber" id="password" v-model="password" min="1" type="password"
                                    required />
                            </div>
                            <br>
                            <UButton @click="loadInstallation" type="submit" color="amber" variant="solid">Laden
                            </UButton>
                        </form>
                    </div>
                </UModal>
                <UButton class="add-door-button" icon="i-heroicons-arrow-left-start-on-rectangle-16-solid"
                    @click="isOpen = true" size="sm" color="amber" variant="solid" :trailing="false">Anlage speichern
                </UButton>
                <UModal v-model="isOpen">
                    <div class="p-4">
                        <div class="modal-flex-buttons-top">
                            <h2 class="modal-h2">Anlage speichern</h2>
                            <UButton color="red" @click="isOpen = false" style="font-weight: 600;">X</UButton>
                        </div>
                        <br>
                        <form @submit.prevent="handleSubmit">
                            <div class="form-group">
                                <label for="object">Anlagenname:</label>
                                <UInput autofocus color="amber" id="object" v-model="object" type="text"
                                    placeholder="z.B. Mustermann Schließung" required />
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
                                <UInput color="amber" id="company" v-model="company" type="tel"
                                    placeholder="Optional" />
                            </div>
                            <br>
                            <UButton @click="saveInstallation" type="submit" color="amber" variant="solid">Speichern und
                                abschicken
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
            anlageNr: '',
            object: '',
            id: '',
            password: '',
            email: '',
            name: '',
            phone: '',
            company: '',
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
                        options: "",
                        checked: false,
                        keyname: "",
                        keyquantity: 1,
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
            cylinderOptions: ["Not- & Gefahrenfunktion"],
        };
    },

    methods: {



        resetOptions(rowIndex) {
            this.rows[rowIndex].options = [];
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
                    checked: false, doorquantity: 1, positionition: this.rows.length + 1


                });
            }
            this.rows.push(newRow);
        },

        addCheckbox() {
            this.rows.forEach((checkbox) => {
                checkbox.push({ checked: false, keyquantity: 1 });
            });
        },

        deleteCheckbox(colIndex) {
            this.rows.forEach((row) => {
                if (row.length > 1) {
                    row.splice(colIndex, 1);
                }
            });
        },

        deleteRow(rowIndex) {
            if (rowIndex > 0) {
                this.rows.splice(rowIndex, 1);
            } else {
                alert("Hier ist Schluss!");
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

        async saveInstallation() {

            const form = document.querySelector('form');
            if (form.checkValidity()) {
                let antwort;
                if (this.anlageNr === '') {
                    do {
                        this.generateRandomAnlagenNummer();
                        const response = await $fetch('/api/sqltestanlage?ID=' + this.anlageNr, {
                            method: 'post'
                        });
                        antwort = response.message;
                        //console.log(antwort)
                    } while (antwort === 'Anlagennummer existiert.')
                }


                //Schickt die Anlagendaten per API in MYSQL_Datenbank
                const queryresultanlage = await $fetch('/api/sqlpostanlageneu', {
                    method: 'post',
                    body: { ID: this.anlageNr, Objekt: this.object, Name: this.name, EMail: this.email, Firma: this.company }
                });


                // Erstellt das JSON für die Übergabe der Positionen an MYSQL_Datenbank
                const RowObject = this.rows.flatMap((row, rowIndex) => row.map((col, colIndex) => ({
                    POS: rowIndex + 1, // Set position to the current row index
                    Bezeichnung: row[0].doorDesignation || '',
                    Anzahl: row[0].doorquantity || '',
                    Typ: row[0].type || '',
                    SizeA: row[0].outside || '',
                    SizeI: row[0].inside || '',
                    Option: row[0].options || ''
                })));



                // Schickt die Positionsdaten per API in MYSQL_Datenbank
                const queryresultposition = await $fetch('/api/sqlpostposition?ID=' + this.anlageNr, {
                    method: 'post',
                    body: RowObject
                });


                // Erstellt das JSON für die Übergabe der Schlüssel an MYSQL_Datenbank 
                const KeyNameObject = this.rows
                    .filter((_, rowIndex) => rowIndex === 0)
                    .flatMap((row, rowIndex) => row.map((col, colIndex) => ({
                        keyPos: colIndex + 1,
                        keyname: col.keyname,
                        keyquantity: col.keyquantity || 1,
                    })));
                // console.log(JSON.stringify(this.rows));
                //console.log(JSON.stringify(KeyNameObject));

                // Schickt die Schluesseldaten per API in MYSQL_Datenbank
                const queryresultschluessel = await $fetch('/api/sqlpostschluessel?ID=' + this.anlageNr, {
                    method: 'post',
                    body: KeyNameObject
                });

                // Erstellt das JSON für die Übergabe der Matrix an MYSQL_Datenbank
                const Matrix = this.rows.flatMap((row, rowIndex) => row.map((col, colIndex) => ({
                    position: rowIndex + 1, // Set position to the current row index
                    keynr: colIndex + 1, // Set keynr to the current column index
                    checked: col.checked || false, // Default checked to false if missing
                })));

                //console.log(JSON.stringify(Matrix, null,2 ));
                // Schickt die Matrixdaten per API in MYSQL_Datenbank
                const queryresultmatrix = await $fetch('/api/sqlpostmatrix?ID=' + this.anlageNr, {
                    method: 'post',
                    body: Matrix
                });


                this.isOpen = false;
            } else {
                // Zeige Validierungsfehler an
                form.reportValidity();
            }
        },

        async loadInstallation() {
            this.rows.length = 1;


            // Daten für die Anlage
            const queryresultanlage = await $fetch('/api/sqlgetanlage', {
                method: 'post',
                body: { ID: this.id }
            });

            if (queryresultanlage && queryresultanlage.queryresult && queryresultanlage.queryresult.length > 0) {
                this.anlageNr = queryresultanlage.queryresult[0].ID || '';
                this.object = queryresultanlage.queryresult[0].Objekt || '';
                this.name = queryresultanlage.queryresult[0].Name || '';
                this.email = queryresultanlage.queryresult[0].EMail || '';
                this.company = queryresultanlage.queryresult[0].Firma || '';
            }

            // Positionsdaten 
            const queryresultposition = await $fetch('/api/sqlgetposition', {
                method: 'post',
                body: { ID: this.id }
            });

            if (queryresultposition && queryresultposition.queryresult) {
                let maxPosition = 0;
                queryresultposition.queryresult.forEach(entry => {
                    if (entry.POS > maxPosition) {
                        maxPosition = entry.POS;
                    }
                });

                for (let i = 0; i < maxPosition - 1; i++) {
                    const numCheckboxes = this.rows[0].length;
                    const newRow = [];
                    for (let j = 0; j < numCheckboxes; j++) {
                        newRow.push({ checked: false, doorquantity: 1 });
                    }
                    this.rows.push(newRow);
                }

                for (let i = 0; i < maxPosition; i++) {
                    const positionData = queryresultposition.queryresult[i];
                    if (positionData) {
                        this.rows[i][0].doorDesignation = positionData.Bezeichnung || '';
                        this.rows[i][0].doorquantity = positionData.Anzahl || 1;
                        this.rows[i][0].type = positionData.Typ || '';
                        this.rows[i][0].outside = positionData.SizeA || '';
                        this.rows[i][0].inside = positionData.SizeI || '';
                        this.rows[i][0].options = positionData.Option || '';
                    }
                }
            }

            // Schlüsseldaten 

            const queryresultschluessel = await $fetch('/api/sqlgetschluessel', {
                method: 'post',
                body: { ID: this.id }
            });

            if (queryresultschluessel && queryresultschluessel.queryresult) {
                const numCheckboxes = queryresultschluessel.queryresult.length;
                while (this.rows[0].length < numCheckboxes) {
                    this.addCheckbox();
                }

                for (let i = 0; i < numCheckboxes; i++) {
                    const keyData = queryresultschluessel.queryresult[i];
                    if (keyData) {
                        this.rows[0][i].keyname = keyData.keyname;
                        this.rows[0][i].keyquantity = keyData.keyquantity;
                    }
                }
            }


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

.modal-h2 {
    font-size: 1.4rem;
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