<template>
    <div>
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
                <div>
                  <h3 v-show="rowIndex < 1 && colIndex < 1"> Pos. </h3>
                  <UBadge v-show="colIndex < 1" v-model="checkbox.position" color="sky" size="lg" variant="solid" style="width: 30px; display: flex; justify-content: center; align-items: center;">
                    {{ rowIndex + 1 }}
                  </UBadge>
                </div>
                <div class="door-designation" v-show="colIndex < 1">
                  <h3 v-show="rowIndex < 1 && colIndex < 1">Türbezeichnung</h3>
                  <UInput v-show="colIndex < 1" v-model="checkbox.doorDesignation" color="gray" size="sm" variant="outline" placeholder="z.B. Haupteingang" style="width: 200px" />
                </div>
                <div class="quantity">
                  <h3 v-show="rowIndex < 1">Anzahl</h3>
                  <UInput v-model="checkbox.doorquantity" min="1" class="quantity-input" color="gray" size="sm" type="number" variant="outline" style="width: 80px" />
                </div>
                <div class="cylinder-type">
                  <h3 v-show="rowIndex < 1">Zylinder-Typ</h3>
                  <USelectMenu v-model="checkbox.type" color="gray" :options="cylinderType" placeholder="Zylinder wählen..." style="width: 200px" />
                </div>
                <div class="sizes" v-if="checkbox.type == 'Doppelzylinder' || checkbox.type == 'Knaufzylinder (innen)'">
                  <div class="outside">
                    <h3 v-show="rowIndex < 1">Außen</h3>
                    <USelectMenu v-model="checkbox.outside" color="gray" :options="sizes" placeholder="..." style="width: 80px" />
                  </div>
                  <div class="inside">
                    <h3 v-show="rowIndex < 1">Innen</h3>
                    <USelectMenu v-model="checkbox.inside" color="gray" :options="sizes" placeholder="..." style="width: 80px" />
                  </div>
                </div>
                <div class="sizes-halfcylinder" v-else-if="checkbox.type == 'Halbzylinder'">
                  <div class="outside">
                    <h3 v-show="rowIndex < 1">Außen</h3>
                    <USelectMenu v-model="checkbox.outside" color="gray" :options="sizes" placeholder="..." style="width: 80px" />
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
                  <USelectMenu v-model="checkbox.options" :options="cylinderOptions" color="gray" placeholder="Optionen auswählen" @click="resetOptions(rowIndex)" style="width: 200px" />
                </div>
                <div class="options-empty" v-else>
                  <h3 v-show="rowIndex < 1">N&G-Funktion</h3>
                  <UBadge color="gray" variant="outline" size="lg" style="width: 200px">&nbsp;N/A&nbsp;</UBadge>
                </div>
                <div class="duplicate">
                  <br v-show="rowIndex < 1" />
                  <UButton icon="i-heroicons-document-duplicate" size="sm" color="sky" variant="outline" :trailing="false" @click="duplicateRow(rowIndex)" />
                </div>
                <div class="delete">
                  <br v-show="rowIndex < 1" />
                  <UButton icon="i-heroicons-trash" size="sm" color="red" variant="solid" :trailing="false" @click="deleteRow(rowIndex)" />
                </div>
              </div>
            </div>
            <div class="checkbox-item" v-for="(checkbox, colIndex) in row" :key="colIndex">
              <input type="text" placeholder="Schlüsselname" readonly class="key-name" v-model="checkbox.keyname" v-show="rowIndex < 1" style="writing-mode: vertical-rl; position: absolute; margin-top: -20.8em; padding: 4px; height: 150px; cursor: default; border: 1px solid lightgray; border-radius: 8px;" />
              <input min="1" type="number" placeholder="1" v-model="checkbox.keyquantity" v-show="rowIndex < 1" style="position: absolute; margin-top: -11.8em; width: 33px; height: 20px; font-size: 12px; border: 1px dotted lightblue; border-radius: 4px;" />
              <UButton icon="i-heroicons-pencil" v-show="rowIndex < 1" @click="openModal(colIndex)" size="sm" color="sky" variant="solid" :trailing="false" style="writing-mode: vertical-rl; position: absolute; margin-top: -4.4em;" />
              <ColumnModal :columnId="colIndex" v-model="modalStates[colIndex]" @update-column-name="updateColumnName(colIndex, $event)" />
              <p v-show="rowIndex < 1">&nbsp;</p>
              <UCheckbox name="{{ rowIndex * 100 + colIndex + 1 }}" v-model="checkbox.checked" color="blue" />
              <p v-if="this.rows.length - 1 < 1">&nbsp;</p>
              <UButton @click="deleteCheckbox(colIndex)" v-show="rowIndex == this.rows.length - 1" icon="i-heroicons-trash" size="sm" color="red" variant="solid" :trailing="false" style="writing-mode: vertical-rl; position: absolute; margin-top: 5.5em;" />
              <UButton @click="duplicateCol(colIndex)" v-show="rowIndex == this.rows.length - 1" icon="i-heroicons-document-duplicate" size="sm" color="sky" variant="outline" :trailing="false" style="writing-mode: vertical-rl; position: absolute; margin-top: 11.4em;" />
            </div>
          </div>
          <div class="buttons">
            <UButton class="add-door-button" icon="i-heroicons-plus-16-solid" @click="addRow" size="sm" color="amber" variant="solid" :trailing="false">Tür hinzufügen</UButton>
            <UButton class="test-button" @click="addTestData" size="sm" color="gray" variant="solid">Test Daten</UButton>
            <UButton class="save-button" @click="saveData" size="sm" color="green" variant="solid">Speichern</UButton>
          </div>
        </div>
        <div class="key-plan">
          <h1>Schlüsselplan</h1>
          <div class="table-container">
            <table class="key-table" v-if="columns.length > 1 && rows.length > 1">
              <thead>
                <tr>
                  <th></th>
                  <th v-for="(column, columnIndex) in columns" :key="columnIndex" v-if="columnIndex > 0">
                    <input type="text" v-model="column.keyname" readonly style="writing-mode: vertical-rl; position: absolute; margin-top: -20.8em; padding: 4px; height: 150px; cursor: default; border: 1px solid lightgray; border-radius: 8px;" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in rows" :key="rowIndex" v-if="rowIndex > 0">
                  <td v-for="(checkbox, colIndex) in row" :key="colIndex" :class="{ 'empty-cell': rowIndex > 0 && colIndex < 1 }">
                    <input type="text" v-model="checkbox.keyname" v-if="rowIndex > 0 && colIndex < 1" readonly class="key-name" style="writing-mode: vertical-rl; padding: 4px; cursor: default; border: 1px solid lightgray; border-radius: 8px;" />
                    <UCheckbox name="{{ rowIndex * 100 + colIndex + 1 }}" v-model="checkbox.checked" color="blue" v-if="colIndex > 0" />
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else>
              <p>Fügen Sie Türen und Schlüssel hinzu, um den Schlüsselplan zu sehen.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
 
  import ColumnModal from './ColumnModal.vue';
  
  const rows = reactive([
    [{ position: '', doorDesignation: '', doorquantity: 1, type: '', outside: '', inside: '', options: '', checked: false, keyname: '', keyquantity: 1 }]
  ]);
  const columns = reactive([{ keyname: '', keyquantity: 1 }]);
  const modalStates = ref([]);
  const anlageNr = ref('');
  const cylinderType = [{ label: 'Doppelzylinder', value: 'Doppelzylinder' }, { label: 'Knaufzylinder (innen)', value: 'Knaufzylinder (innen)' }, { label: 'Halbzylinder', value: 'Halbzylinder' }];
  const sizes = ['30', '35', '40', '45', '50', '55'];
  const cylinderOptions = ['mit Not- und Gefahrenfunktion'];
  
  const duplicateRow = (rowIndex) => {
    rows.splice(rowIndex + 1, 0, JSON.parse(JSON.stringify(rows[rowIndex])));
  };
  const deleteRow = (rowIndex) => {
    rows.splice(rowIndex, 1);
  };
  const addRow = () => {
    rows.push([{ position: '', doorDesignation: '', doorquantity: 1, type: '', outside: '', inside: '', options: '', checked: false, keyname: '', keyquantity: 1 }]);
  };
  const openModal = (colIndex) => {
    modalStates.value[colIndex] = true;
  };
  const updateColumnName = (colIndex, newName) => {
    columns[colIndex].keyname = newName;
  };
  const addTestData = () => {
    // Hier Test-Daten hinzufügen
    rows.push([
      { position: '', doorDesignation: 'Haupteingang', doorquantity: 2, type: 'Doppelzylinder', outside: '35', inside: '35', options: 'mit Not- und Gefahrenfunktion', checked: true, keyname: 'Schlüssel A', keyquantity: 2 }
    ]);
    columns.push({ keyname: 'Schlüssel A', keyquantity: 2 });
  };
  const duplicateCol = (colIndex) => {
    columns.splice(colIndex + 1, 0, JSON.parse(JSON.stringify(columns[colIndex])));
  };
  const deleteCheckbox = (colIndex) => {
    columns.splice(colIndex, 1);
  };
  const saveData = async () => {
    const response = await useFetch('saveURL', { method: 'POST', body: JSON.stringify(rows) });
    console.log(response);
  };
  
  // Daten laden
  const loadData = async () => {
    const response = await useFetch('/api/sql', {
    method: 'post',
    body: { ID: 12345 }
  });
    if (response) {
      // Assuming response is an array of data that matches the structure of rows
      rows.push(...response.rows);
      columns.push(...response.columns);
    }
  };
  
  onMounted(() => {
    loadData();
  });
  
  watch(rows, (newRows) => {
    console.log('Rows changed:', newRows);
  });
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

.number{
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
  