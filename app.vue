<template>
  
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <!--MaintenanceMessage />-->
  <br />
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

function sendHeight() {
  // Only send from the Konfigurator page
  if (route.name !== 'index') return
  if (typeof window !== "undefined") {
    const height = document.body.scrollHeight; // Nutze body.scrollHeight für korrekte Höhe
    window.parent.postMessage({ type: "resize", height }, "*");
  }
}

// Control starting/stopping any listeners/observers that trigger sendHeight
let heightSyncActive = false
function startHeightSync() {
  if (heightSyncActive) return
  window.addEventListener('resize', sendHeight)
  heightSyncActive = true
  sendHeight()
}
function stopHeightSync() {
  if (!heightSyncActive) return
  window.removeEventListener('resize', sendHeight)
  heightSyncActive = false
}

// Initialize once and react to route changes
onMounted(() => {
  if (route.name === 'index') startHeightSync()
})

watch(() => route.name, (name) => {
  if (name === 'index') startHeightSync()
  else stopHeightSync()
})

onBeforeUnmount(() => {
  stopHeightSync()
})
</script>

<style lang="scss">
* {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-weight: 600;
  background: inherit;

  @media(prefers-color-scheme: dark) {
    body {
      background-color: #ffffff;
      color: #333333;
    }
  }
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: rgb(52, 51, 51);
}
</style>
