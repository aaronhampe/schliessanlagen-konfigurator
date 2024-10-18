<template>
    <div class="centered-link">
        <UButton class="button" color="amber" @click="navigateToConfigurator(false)">Zum Konfigurator
            <UIcon name="i-heroicons-key" class="w-5 h-5" />
        </UButton>
    </div>
</template>

<script>
export default {
    methods: {
        navigateToConfigurator(isSchliessanlage) {
            this.$router.push({
                name: 'index',
                query: { isSchliessanlage: isSchliessanlage.toString() }
            });
        }
    }
};
</script>

<style scoped>
.centered-link {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>