<template>
  <div class="maintenance-page">
    <div class="maintenance-container">
      <div class="maintenance-icon">
        <i class="i-heroicons-wrench-screwdriver"></i>
      </div>
      <h1>Wartungsarbeiten</h1>
      <p>Wir führen aktuell planmäßige Wartungsarbeiten am Server durch.</p>
      <p>Der Schließanlagenkonfigurator wird in Kürze wieder verfügbar sein.</p>
      <p class="estimated-time">Voraussichtliche Dauer: ca. 2 Stunden</p>
      <div class="contact-info">
        <p>Bei Fragen erreichen Sie uns unter:</p>
        <p><a href="mailto:office@secutimetec.de">office@secutimetec.de</a> oder +49 5130 609390</p>
      </div>
      <p class="thank-you">Vielen Dank für Ihr Verständnis!</p>
      <p class="signature">Ihr stt-shop Team</p>
    </div>
  </div>
</template>

<style scoped>
.maintenance-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.maintenance-container {
  max-width: 600px;
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 1px solid #e0e4e8;
}

.maintenance-icon {
  font-size: 48px;
  color: #f59e0b;
  margin-bottom: 20px;
}

h1 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #333;
}

p {
  font-size: 16px;
  line-height: 1.6;
  color: #4b5563;
  margin-bottom: 12px;
}

.estimated-time {
  font-weight: 700;
  color: #f59e0b;
  margin: 20px 0;
}

.contact-info {
  margin: 24px 0;
  padding: 15px;
  background-color: #f9fafb;
  border-radius: 8px;
}

.contact-info a {
  color: #0ea5e9;
  text-decoration: none;
}

.thank-you {
  font-weight: 700;
  font-size: 18px;
  margin-top: 24px;
}

.signature {
  font-weight: 700;
  color: #333;
}
</style>