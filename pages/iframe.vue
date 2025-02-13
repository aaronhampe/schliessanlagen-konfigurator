<template>
  <div class="iframe-page-container">
    <!-- Header -->
    <header class="iframe-page-header">
      <h1>iFrame Test</h1>
      <nav class="iframe-nav">
        <ul>
          <li><a href="#">Link 1</a></li>
          <li><a href="#">Link 2</a></li>
          <li><a href="#">Link 3</a></li>
        </ul>
      </nav>
    </header>

    <!-- Hauptbereich mit iFrame -->
    <main class="iframe-page-main">
      <div class="iframe-container">
        <iframe
          src="http://localhost:3000"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    </main>
    <section>
      <div class="text-block">
        <h2>Wie funktioniert der <span>Konfigurator</span>?</h2>
        <p>
          Mit unserem Schließanlagenkonfigurator können Sie ganz einfach von
          zuhause aus einen detaillierten Schließplan erstellen. Das ist ideal
          für Umzüge, bei Schlüsselverlust oder wenn Sie besondere Wünsche für
          Ihre neue Schließanlage haben. Sie können beliebig viele Türen mit
          verschiedenen Zylindertypen und -größen kombinieren. Fügen Sie so
          viele Schlüssel hinzu, wie Sie möchten, und bestimmen Sie genau,
          welcher Schlüssel welche Tür öffnen kann. Tür benennen (z.B.
          "Wohnzimmer", "Garage"). Weitere Türen hinzufügen mit dem "Tür
          hinzufügen" Button. Passenden Zylinder-Typ und Größe auswählen (z.B.
          Halbzylinder für die Garage). Weitere Schlüssel hinzufügen mit dem
          "Schlüssel hinzufügen" Button. Berechtigungen der Schlüssel mit den
          Checkboxen festlegen. Konfiguration abschließen und E-Mail-Adresse
          angeben, um ein Angebot zu erhalten.
        </p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="iframe-page-footer">
      <p>&copy; 2025 secutimetec GmbH. Alle Rechte vorbehalten.</p>
    </footer>
  </div>
</template>

<script setup>
// Keine ausgelagerte Komponente, alles in derselben Datei
</script>

<style lang="scss" scoped>
/* 
     Root-Container: 
     - 64% Gesamtbreite => ~18% Margin L/R (100% - 64% = 36%, /2 = 18% pro Seite) 
     - Hintergrund, flexible Höhe 
  */
.iframe-page-container {
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f9f9f9;
}

/* Header-Bereich */
.iframe-page-header {
  background-color: #263238;
  color: #fff;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  h1 {
    margin: 0;
    color: #fafafa;
  }

  .iframe-nav ul {
    list-style: none;
    display: flex;
    gap: 20px;
    margin: 0;
    padding: 0;
  }

  .iframe-nav a {
    text-decoration: none;
    color: #fff;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
}

/* Hauptinhalt => iFrame responsive */
.iframe-page-main {
  flex: 1;
  display: flex;
  margin-bottom: 20px;

  .iframe-container {
    position: relative;
    width: 100%;
    padding-bottom: 43%; /* Aspect Ratio => 43% */
    height: 0;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      min-height: 100%;
      border: 0;
    }
  }
}

/* Footer-Bereich */
.iframe-page-footer {
  background-color: #37474f;
  color: #fff;
  padding: 20px;
  text-align: center;
}

.text-block {
    border: 1px solid #ddd;
    padding: 20px;
    text-align: center;
    margin: 10% 20%;
    h2 {
        font-size: 2.5rem;
        margin-bottom: 10px;
        span {
            color: #ff5722;
        }
    }
}

/* Dunkelmodus erzwingen, falls gewünscht (z. B. override) */
@media (prefers-color-scheme: dark) {
  .iframe-page-container {
    background-color: #fff;
    color: #333;
  }
}
</style>
