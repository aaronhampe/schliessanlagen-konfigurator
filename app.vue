<template>
  
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <!--MaintenanceMessage />-->
  <br />
</template>

<script>
export default {
  mounted() {
    this.sendHeight(); // Direkt Höhe senden
    this.intervalId = setInterval(this.sendHeight, 500); // Alle 500ms die Höhe senden
  },
  beforeUnmount() {
    clearInterval(this.intervalId); // Intervall beenden
  },
  methods: {
    sendHeight() {
      if (typeof window !== "undefined") {
        const height = document.body.scrollHeight; // Nutze body.scrollHeight für korrekte Höhe
        window.parent.postMessage({ type: "resize", height }, "*");
      }
    }
  }
};
</script>

<style lang="scss">
* {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-weight: 600;
  background: inherit;
  overflow: hidden;

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
