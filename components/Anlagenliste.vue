<!-- 
<template>
  <UDialog v-model:localVisible="localVisible">
    <template #activator="{ on, attrs }">
      <UButton v-bind="attrs" v-on="on" icon="i-heroicons-arrow-left-start-on-rectangle-16-solid" size="sm" color="amber" variant="solid">
        Anlage speichern
      </UButton>
    </template>
    <div class="modal-content">
      <h2>Anlage speichern</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">E-Mail-Adresse:</label>
          <UInput id="email" v-model="email" type="email" required />
        </div>
        <div class="form-group">
          <label for="name">Name:</label>
          <UInput id="name" v-model="name" type="text" required />
        </div>
        <div class="form-group">
          <label for="phone">Telefonnummer:</label>
          <UInput id="phone" v-model="phone" type="tel" required />
        </div>
        <UButton type="submit" color="amber" variant="solid">Speichern und abschicken</UButton>
      </form>
    </div>
  </UDialog>
</template>

<script>
import UDialog from 'path-to-your-udialog-component'; // Passen Sie den Pfad an

export default {
  components: {
    UDialog,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      localVisible: this.visible,
      email: '',
      name: '',
      phone: '',
    };
  },
  watch: {
    visible(newVal) {
      this.localVisible = newVal;
    },
    localVisible(newVal) {
      this.$emit('update:visible', newVal);
    },
  },
  methods: {
    handleSubmit() {
      const formData = {
        email: this.email,
        name: this.name,
        phone: this.phone,
      };
      this.$emit('submit', formData);
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style scoped>
.modal-content {
  padding: 20px;
}
.form-group {
  margin-bottom: 15px;
}
</style>
 -->