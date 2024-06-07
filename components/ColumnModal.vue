<template>
    <UModal class="modal" v-model="isOpenC">
        <div class="p-4">
            <div class="modal-flex-buttons-top pb-6">
                <h2 class="modal-h2">Schlüssel benennen</h2>
                <UButton color="red" @click="closeModal" style="font-weight: 600;">X</UButton>
            </div>
            <label for="input">Schlüsselbezeichnung:</label>
            <UInput autofocus class="input pb-6" v-model="columnName" color="amber" />
            <UButton class="button" @click="closeModal" color="amber">Speichern</UButton>
        </div>

    </UModal>
</template>

<script>
export default {
    props: ['columnId'],
    data() {
        return {
            isOpenC: false,
            columnName: '',
        };
    },
    methods: {
        closeModal() {
            // Hier können Sie die Logik hinzufügen, um den neuen Namen der Spalte zu speichern
            this.$emit('update-column-name', this.columnName);
            this.$emit('close-this-modal', this.isOpenC);
        },
    },
};
</script>

<style>

.modal-h2 {
  font-size: 1.4rem;
}

.modal-flex-buttons-top {
    display: flex;
    justify-content: space-between;
}
</style>