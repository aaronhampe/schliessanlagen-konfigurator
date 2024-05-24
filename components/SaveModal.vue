<template>
    <UModal class="modal" v-model="isOpen">
        <UInput v-model="columnName" color="sky" placeholder="Anlagenname" />
        <UButton @click="closeModal" color="sky">Speichern</UButton>
    </UModal>
</template>

<script>
export default {
    props: ['columnId'],
    data() {
        return {
            isOpen: false,
            columnName: '',
        };
    },
    methods: {
        closeModal() {
            this.isOpen = false;
            // Hier können Sie die Logik hinzufügen, um den neuen Namen der Spalte zu speichern
            this.$emit('update-column-name', this.columnName);
        },
    },
};
</script>

<style>

</style>