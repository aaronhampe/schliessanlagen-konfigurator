<script>
import NewConfigurator from "./components/NewConfigurator.vue";

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Füge CSS-Regeln hinzu oder ändere Klassen, um den Dark Mode zu ignorieren
    document.body.style.backgroundColor = 'white';
    document.body.style.color = 'black';
    // Andere Elemente entsprechend anpassen
}

</script>

<template>
  <NewConfigurator/>
  <br>
</template>

<style lang="scss">
* {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-weight: 600;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  color: rgb(51, 51, 51);
}
</style>
