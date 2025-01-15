<template>
    <div class="button-page">
        <button class="btn btn--primary" @click="goToConfigurator">
            Jetzt konfigurieren
        </button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToConfigurator() {
    router.push({
        path: '/',            
        query: { model: 'KESO 8000 Omega' },
    })
}
</script>

<style scoped>
@import "@/styles/buttonStyles.scss";
</style>