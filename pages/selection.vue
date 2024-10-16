<template>
    <div class="selection-page">
      <h1>Was möchten Sie konfigurieren?</h1>
      <p>
        Wählen Sie zwischen einer <strong>Schließanlage</strong> oder einer <strong>Gleichschließung</strong>:
      </p>
      
      <div class="info-section">
        <div class="info-box">
          <h2>Schließanlage</h2>
          <p>Mit einer Schließanlage können Sie Schlüssel spezifischen Türen zuordnen. Dies ist besonders nützlich für Vermieter, Büros oder Familien, da jeder Schlüssel unterschiedliche Berechtigungen haben kann.</p>
          <UButton class="button" color="amber" @click="navigateToConfigurator(true)">Zum Konfigurator <UIcon name="i-heroicons-key" class="w-5 h-5" /></UButton>
        </div>
        
        <div class="info-box">
          <h2>Gleichschließung</h2>
          <p>Bei einer Gleichschließung öffnen alle Schlüssel sämtliche Türen gleichermaßen. Dies ist ideal für private Haushalte oder kleinere Unternehmen, die einen  Zugang zu allen Türen mit nur einem Schlüssel wünschen.</p>
          <UButton class="button" color="amber" @click="navigateToConfigurator(false)">Zum Konfigurator <UIcon name="i-heroicons-key" class="w-5 h-5" /></UButton>
        </div>
      </div>
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
  .selection-page {
    margin: 50px;
    font-size: 18px;
    text-align: center;
  }
  
  .info-section {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }
  
  .info-box {
    background: #f8f9fa;
    padding: 50px;
    border: 1px solid #ddd;
    border-radius: 10px;
    width: 45%;
    text-align: center; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .info-box h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .info-box p {
    font-size: 16px;
    margin-bottom: 20px;
    padding: 10px 70px;
  }
  
  .button{
    color: white;
  }
  
  .button:hover {
    background-color: #bb7814;
    transition: 300ms;
  }
  </style>
  