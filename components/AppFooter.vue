<template>
    <div class="configurator-footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-header">
            <h2>Wie funktioniert der <span>Konfigurator?</span></h2>
          </div>
          <div class="footer-description">
            <p>
              Mit unserem <strong>Schließanlagenkonfigurator</strong> können Sie ganz einfach von
              zuhause aus einen detaillierten <strong>Schließplan erstellen</strong>. Das ist ideal
              für Umzüge, bei Schlüsselverlust oder wenn Sie besondere Wünsche für
              Ihre neue Schließanlage haben. Sie können beliebig viele <strong>Türen</strong> mit
              verschiedenen <strong>Zylindertypen</strong> und <strong>-größen</strong> kombinieren. Fügen Sie so viele
              <strong>Schlüssel</strong> hinzu, wie Sie möchten, und bestimmen Sie genau, welcher
              Schlüssel welche Tür öffnen kann.
            </p>
          </div>
          <div class="footer-steps">
            <ul>
              <li>
                <div class="step-icon"><i class="i-heroicons-pencil-square"></i></div>
                <div class="step-text">Tür benennen (z.B. "Wohnzimmer", "Garage").</div>
              </li>
              <li>
                <div class="step-icon"><i class="i-heroicons-plus-circle"></i></div>
                <div class="step-text">Weitere Türen hinzufügen mit dem <strong>"Tür hinzufügen"</strong> Button.</div>
              </li>
              <li>
                <div class="step-icon"><i class="i-heroicons-adjustments-horizontal"></i></div>
                <div class="step-text">Passenden Zylinder-Typ und Größe auswählen (z.B. Halbzylinder für die Garage).</div>
              </li>
              <li>
                <div class="step-icon"><i class="i-heroicons-key"></i></div>
                <div class="step-text">Weitere Schlüssel hinzufügen mit dem <strong>"Schlüssel hinzufügen"</strong> Button.</div>
              </li>
              <li>
                <div class="step-icon"><i class="i-heroicons-check-circle"></i></div>
                <div class="step-text">Berechtigungen der Schlüssel mit den Checkboxen festlegen.</div>
              </li>
              <li>
                <div class="step-icon"><i class="i-heroicons-envelope"></i></div>
                <div class="step-text">Konfiguration abschließen und E-Mail-Adresse angeben, um ein Angebot zu erhalten.</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style lang="scss" scoped>
  .configurator-footer {
    width: 100%;
    padding: 60px 0;
    margin-top: 60px;
    background-color: #f8f9fa;
    border-top: 1px solid #e9ecef;
    
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .footer-content {
      background-color: #fff;
      border-radius: 12px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
      padding: 40px;
      
      @media (max-width: 768px) {
        padding: 30px 20px;
      }
    }
    
    .footer-header {
      text-align: center;
      margin-bottom: 30px;
      
      h2 {
        font-size: 2rem;
        font-weight: 700;
        color: #333;
        
        span {
          color: #0ea5e9;
        }
        
        @media (max-width: 768px) {
          font-size: 1.6rem;
        }
      }
    }
    
    .footer-description {
      margin-bottom: 30px;
      
      p {
        font-size: 1.05rem;
        line-height: 1.6;
        color: #555;
        max-width: 900px;
        margin: 0 auto;
        text-align: center;
        
        @media (max-width: 768px) {
          font-size: 0.95rem;
          line-height: 1.5;
        }
        
        strong {
          color: #0ea5e9;
          font-weight: 600;
        }
      }
    }
    
    .footer-steps {
      max-width: 800px;
      margin: 0 auto;
      
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
        gap: 20px;
        
        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
        
        @media (max-width: 400px) {
          grid-template-columns: 1fr;
        }
      }
      
      li {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        padding: 15px;
        background-color: #f8fafc;
        border-radius: 8px;
        transition: transform 0.2s, box-shadow 0.2s;
        
        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
      }
      
      .step-icon {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #e0f2fe;
        display: flex;
        align-items: center;
        justify-content: center;
        
        i {
          color: #0ea5e9;
          font-size: 20px;
        }
      }
      
      .step-text {
        font-size: 0.95rem;
        line-height: 1.5;
        color: #4b5563;
        
        strong {
          color: #0ea5e9;
          font-weight: 600;
        }
      }
    }
  }
  </style>