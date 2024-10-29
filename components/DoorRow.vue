<template>
  <div>
    <div>
      <h3 v-if="rowIndex < 1 && colIndex < 1">Pos.</h3>
      <UBadge v-if="colIndex < 1" :color="'sky'" :size="'lg'" :variant="'solid'">{{ rowIndex + 1 }}</UBadge>
    </div>

    <div>
      <h3 v-if="rowIndex < 1 && colIndex < 1">Türbezeichnung</h3>
      <UInput v-model="checkbox.doorDesignation" placeholder="z.B. Haupteingang" />
    </div>

    <div>
      <h3 v-if="rowIndex < 1">Anzahl</h3>
      <UInput v-model="checkbox.doorquantity" min="1" type="number" />
    </div>

    <div>
      <h3 v-if="rowIndex < 1">Zylinder-Typ</h3>
      <USelectMenu v-model="checkbox.type" :options="cylinderType" placeholder="Zylinder wählen..." />
    </div>

    <div v-if="checkbox.type === 'Doppelzylinder' || checkbox.type === 'Knaufzylinder (innen)'">
      <div>
        <h3 v-if="rowIndex < 1">Außen</h3>
        <USelectMenu v-model="checkbox.outside" :options="sizes" />
      </div>
      <div>
        <h3 v-if="rowIndex < 1">Innen</h3>
        <USelectMenu v-model="checkbox.inside" :options="sizes" />
      </div>
    </div>

    <div v-else-if="checkbox.type === 'Halbzylinder'">
      <div>
        <h3 v-if="rowIndex < 1">Außen</h3>
        <USelectMenu v-model="checkbox.outside" :options="sizes" />
      </div>
      <div>
        <h3 v-if="rowIndex < 1">Innen</h3>
        <UBadge color="gray" variant="outline" size="lg">&nbsp;10&nbsp;</UBadge>
      </div>
    </div>

    <div v-else>
      <div>
        <h3 v-if="rowIndex < 1">Außen</h3>
        <UBadge color="gray" variant="outline" size="lg">&nbsp;N/A&nbsp;</UBadge>
      </div>
      <div>
        <h3 v-if="rowIndex < 1">Innen</h3>
        <UBadge color="gray" variant="outline" size="lg">&nbsp;N/A&nbsp;</UBadge>
      </div>
    </div>

    <div v-if="checkbox.type === 'Doppelzylinder'">
      <h3 v-if="rowIndex < 1">N&G-Funktion</h3>
      <USelectMenu v-model="checkbox.options" :options="cylinderOptions" @click="resetOptions" />
    </div>

    <div v-else>
      <h3 v-if="rowIndex < 1">N&G-Funktion</h3>
      <UBadge color="gray" variant="outline" size="lg">&nbsp;N/A&nbsp;</UBadge>
    </div>

    <div>
      <UButton icon="i-heroicons-document-duplicate" size="sm" color="sky" variant="outline" @click="emitDuplicate" />
    </div>

    <div>
      <UButton icon="i-heroicons-trash" size="sm" color="red" variant="solid" @click="emitDelete" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    checkbox: Object,
    rowIndex: Number,
    colIndex: Number,
    cylinderType: Array,
    sizes: Array,
    cylinderOptions: Array,
  },
  emits: ['updateField', 'resetOptions', 'duplicateRow', 'deleteRow'],
  methods: {
    resetOptions() {
      this.$emit('resetOptions', this.rowIndex);
    },
    emitDuplicate() {
      this.$emit('duplicateRow', this.rowIndex);
    },
    emitDelete() {
      this.$emit('deleteRow', this.rowIndex);
    },
  },
};
</script>
