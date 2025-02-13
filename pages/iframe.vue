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
        <iframe
          src="http://localhost:3000/"
          width="100%"
          height="100%"
          class="iframe-content"
        ></iframe>
      </main>
  
      <!-- Footer -->
      <footer class="iframe-page-footer">
        <p>&copy; 2025 secutimetec GmbH. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  </template>
  
  <script setup>
  // Keine ausgelagerte Komponente, alles in derselben Datei
  </script>
  
  <style lang="scss">
  /* Container für die ganze Seite */
  .iframe-page-container {
    /* Der zentrale Trick: 20% links & rechts => 60% mittig */
    margin: 0 auto;
    width: 64%; /* Du kannst auch max-width verwenden, s.u. */
    min-height: 100vh; /* Falls du willst, dass es die volle Höhe bedeckt */
    display: flex;
    flex-direction: column;
    /* Optional: etwas Hintergrund, um klarer zu sehen, wo man ist */
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
      color: #fff;
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
  
  /* Hauptinhalt */
  .iframe-page-main {
    flex: 1;
    display: flex;
    margin-bottom: 20px;
  
    /* Das Iframe füllt den Bereich aus */
    .iframe-content {
      border: 1px solid #ccc; /* oder none, ganz nach Geschmack */
      min-height: 800px; /* damit man etwas Scroll-Länge hat */
    }
  }
  
  /* Footer-Bereich */
  .iframe-page-footer {
    background-color: #37474f;
    color: #fff;
    padding: 20px;
    text-align: center;
  }
  </style>
  