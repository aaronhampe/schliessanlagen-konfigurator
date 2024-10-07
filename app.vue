<template>

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <br />
</template>

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
