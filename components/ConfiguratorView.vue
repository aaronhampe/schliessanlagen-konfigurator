<template>
  <!-- Neuer stylischer Header-Bereich ohne Hintergrund -->
  <div class="configurator-header">
    <div class="header-content">
      <!-- Titel mit integriertem Progress Tracker -->
      <div class="title-progress-section">
        <h1>
          {{
            isSchliessanlage
              ? "Konfigurator für eine Schließanlage"
              : "Konfigurator für eine Gleichschließung"
          }}
        </h1>

        <!-- Kompakter Progress Tracker -->
        <div class="compact-progress">
          <div class="progress-step" :class="{ active: activeStep >= 1, completed: activeStep > 1 }">
            <div class="step-indicator">
              <span v-if="activeStep > 1" class="checkmark">✓</span>
              <span v-else>1</span>
            </div>
            <span class="step-label">Konfiguration</span>
          </div>
          <div class="progress-connector" :class="{ active: activeStep > 1 }"></div>
          <div class="progress-step" :class="{ active: activeStep >= 2 }">
            <div class="step-indicator">2</div>
            <span class="step-label">Angebote</span>
          </div>
        </div>
      </div>

      <!-- Kompakte Info- und Aktions-Leiste -->
      <div class="header-actions">
        <!-- Anlagennummer + Laden Button -->
        <div class="anlage-section">
          <span class="label">Anlage:</span>
          <span class="anlage-number">{{ anlageNr || 'Neu' }}</span>
          <UButton class="action-btn" icon="i-heroicons-folder-open" size="xs" color="sky" variant="ghost"
            @click="isOpenL = true" title="Anlage laden">
            Laden
          </UButton>
        </div>

        <!-- Support-Link -->
        <div class="support-section">
          <i class="i-heroicons-phone support-icon"></i>
          <div class="support-text">
            <span class="support-label">Benötigen Sie Hilfe?</span>
            <a href="tel:+4951306093900" class="support-link">
              +49 5130 609390
            </a>
          </div>
        </div>
      </div>

      <!-- Vorlagen-Bereich -->
      <div class="templates-section">
        <div class="templates-header">
          <i class="i-heroicons-template template-icon"></i>
          <span>Schnellstart mit Vorlage:</span>
        </div>
        <div class="template-buttons">
          <UButton v-for="template in templates" :key="template.id" @click="applyTemplate(template.id)"
            class="template-btn" :color="template.color" variant="soft" size="sm">
            <i :class="template.icon"></i>
            {{ template.name }}
          </UButton>
        </div>
      </div>
    </div>
  </div>

  <!-- Modernisiertes Template Modal -->
  <UModal v-model="isTemplateModalOpen" class="template-modal">
    <div class="modal-container">
      <div class="modal-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="i-heroicons-document-duplicate-16-solid"></i>
          </div>
          <div class="header-text">
            <h2 class="modal-h2">Vorlage anwenden</h2>
            <p class="template-name">{{ selectedTemplate?.name }}</p>
          </div>
        </div>
        <UButton class="close-button" color="red" icon="i-heroicons-x-mark" @click="isTemplateModalOpen = false"
          variant="ghost">
        </UButton>
      </div>

      <div class="modal-body">
        <!-- Warnung bei bestehender Konfiguration -->
        <div v-if="rows.length > 1 || (rows.length === 1 && hasDataInFirstRow)" class="warning-section">
          <div class="warning-icon">
            <i class="i-heroicons-exclamation-triangle-16-solid"></i>
          </div>
          <div class="warning-content">
            <h3>Achtung: Bestehende Konfiguration</h3>
            <p>
              Das Anwenden dieser Vorlage wird Ihre aktuelle Konfiguration vollständig ersetzen.
              Alle bisher eingetragenen Türen und Schlüssel gehen verloren.
            </p>
            <div class="current-config-info">
              <span><strong>{{ rows.length }}</strong> konfigurierte Türen</span>
              <span><strong>{{ rows[0]?.length || 0 }}</strong> Schlüssel</span>
            </div>
          </div>
        </div>

        <!-- Bestätigung ohne bestehende Konfiguration -->
        <div v-else class="confirmation-section">
          <div class="confirmation-icon">
            <i class="i-heroicons-sparkles-16-solid"></i>
          </div>
          <div class="confirmation-content">
            <h3>Vorlage wird geladen</h3>
            <p>
              Die Vorlage <strong>"{{ selectedTemplate?.name }}"</strong> wird in Ihren Konfigurator geladen
              und Sie können direkt mit der Anpassung beginnen.
            </p>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <div class="footer-actions">
          <UButton @click="isTemplateModalOpen = false" class="cancel-button" color="gray" variant="outline">
            Abbrechen
          </UButton>
          <UButton @click="confirmApplyTemplate" class="confirm-button"
            :color="(rows.length > 1 || (rows.length === 1 && hasDataInFirstRow)) ? 'red' : 'green'" variant="solid"
            :icon="(rows.length > 1 || (rows.length === 1 && hasDataInFirstRow)) ? 'i-heroicons-arrow-path-16-solid' : 'i-heroicons-check-16-solid'">
            {{ (rows.length > 1 || (rows.length === 1 && hasDataInFirstRow)) ? 'Überschreiben und fortfahren' :
            'Vorlage anwenden' }}
          </UButton>
        </div>
      </div>
    </div>
  </UModal>

  <div class="flex-container">
    <div class="section-divider">
      <span>Türkonfiguration</span>
    </div>
    <div class="configurator">
      <div class="checkbox-row" v-for="(row, rowIndex) in rows" :key="rowIndex">
        <div class="checkbox-item" v-for="(checkbox, colIndex) in row" :key="colIndex" v-show="colIndex < 1">
          <div class="door-row" v-if="colIndex < 1">
            <div>
              <h3 v-if="rowIndex < 1 && colIndex < 1">Pos.</h3>
              <UBadge class="u-badge" v-if="colIndex < 1" v-model="checkbox.position" color="sky" size="lg"
                variant="solid">
                {{ rowIndex + 1 }}
              </UBadge>
            </div>

            <div class="door-designation" v-if="colIndex < 1">
              <h3 v-if="rowIndex < 1 && colIndex < 1">Türbezeichnung</h3>
              <UInput v-if="colIndex < 1" class="door-designation" v-model="checkbox.doorDesignation" color="sky"
                size="sm" variant="outline" placeholder="z.B. Haupteingang" />
            </div>

            <div class="quantity">
              <h3 v-if="rowIndex < 1">Anzahl</h3>
              <UInput v-model="checkbox.doorquantity" class="quantity-input" min="1" color="sky" size="sm" type="number"
                variant="outline" />
            </div>

            <div class="cylinder-type">
              <h3 v-if="rowIndex < 1">Zylinder-Typ</h3>
              <select v-model="checkbox.type" @change="onTypeChange(checkbox)" class="cylinder-type">
                <option disabled value="">Bitte Typ auswählen</option>
                <option v-for="type in store.availableTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>

            <div class="sizes">
              <div>
                <h3 v-if="rowIndex < 1">Außen</h3>
                <select class="outside" v-model.number="checkbox.outside" @change="onOutsideSizeChange(checkbox)">
                  <option value="">...</option>
                  <option v-for="size in getAvailableOutsideSizes(checkbox)" :key="size" :value="size">
                    {{ size }} mm
                  </option>
                </select>
              </div>
              <div>
                <h3 v-if="rowIndex < 1">Innen</h3>
                <select class="inside" v-model.number="checkbox.inside" @change="onInsideSizeChange(checkbox)">
                  <option value="">...</option>
                  <option v-for="size in getAvailableInsideSizes(checkbox)" :key="size" :value="size">
                    {{ size }} mm
                  </option>
                </select>
              </div>
            </div>

            <!--Optionen-->
            <div class="options">
              <h3 v-if="rowIndex < 1">Optionen</h3>
              <UButton @click="openOptionsModal(rowIndex)" variant="solid" size="sm" color="sky" class="dropdown-button"
                icon="i-heroicons-cog">
                {{ getSelectedOptionsText(checkbox) || "..." }}
              </UButton>
            </div>

            <!--Zylinder löschen & duplizieren-->
            <div class="duplicate">
              <br v-if="rowIndex < 1" />
              <UButton icon="i-heroicons-document-duplicate" size="sm" color="sky" variant="outline" :trailing="false"
                @click="duplicateRow(rowIndex)" />
            </div>
            <div class="delete">
              <br v-if="rowIndex < 1" />
              <UButton icon="i-heroicons-trash" style="color: white" size="sm" color="red" variant="solid"
                :trailing="false" @click="deleteRow(rowIndex)" />
            </div>
          </div>
        </div>

        <div class="checkbox-item" v-for="(checkbox, colIndex) in row" :key="colIndex">
          <input type="text" placeholder="Schlüsselname" readonly class="key-name" v-model="checkbox.keyname"
            v-if="rowIndex < 1" :class="isSchliessanlage ? 'default-margin' : 'gleichschliessung-margin'
            " />

          <input min="1" class="key-quantity" type="number" placeholder="1" v-model="checkbox.keyquantity"
            v-if="rowIndex < 1" />
          <UButton class="button-edit" icon="i-heroicons-pencil" v-if="rowIndex < 1" @click="openModal(colIndex)"
            size="sm" color="sky" variant="solid" :trailing="false" />
          <ColumnModal v-if="rowIndex < 1" :columnId="colIndex" v-model="modalStates[colIndex]"
            @update-column-name="updateColumnName(colIndex, $event)" @close-this-modal="closeModal(colIndex)" />
          <p v-if="rowIndex < 1">&nbsp;</p>
          <UCheckbox class="checkbox" name="{{ rowIndex * 100 + colIndex + 1 }}" v-model="checkbox.checked" color="blue"
            variant="solid" :disabled="!isSchliessanlage" :true-value="true" :false-value="false" />
          <p v-if="this.rows.length - 1 < 1">&nbsp;</p>
          <UButton @click="deleteCheckbox(colIndex)" v-if="rowIndex == this.rows.length - 1" class="button-delete"
            icon="i-heroicons-trash" size="sm" color="red" variant="solid" :trailing="false" />
          <UButton @click="duplicateCol(colIndex)" v-if="rowIndex == this.rows.length - 1" class="button-duplicate"
            icon="i-heroicons-document-duplicate" size="sm" color="sky" variant="outline" :trailing="false" />
        </div>
      </div>
      <div class="section-divider">
        <span>Aktionen</span>
      </div>
      <div class="buttons">
        <UButton class="button-default" icon="i-heroicons-plus-16-solid" @click="addRow" size="sm" color="amber"
          variant="solid" :trailing="false">
          Tür hinzufügen
        </UButton>

        <!-- Verbesserter Call-to-Action Button -->
        <UButton class="button-cta" @click="handleWeiterZuAngeboten" size="md" color="green" variant="solid"
          icon="i-heroicons-shopping-cart">
          Zur Modellauswahl und den Preisen
        </UButton>


      </div>
      <div class="buttons" style="margin-top: 20px">


        <a class="button-secondary" target="_blank" href="https://www.youtube.com/watch?v=sgfnnyLsAXk&t=2s">Tutorial
          auf&nbsp;YouTube</a>


      </div>
    </div>
    <UButton class="button-add-key" icon="i-heroicons-plus-16-solid" @click="addCheckbox" size="sm" color="amber"
      variant="solid" :trailing="false">Schlüssel hinzufügen</UButton>




    <!-- ///////////////////////////////////////////////////////////////
                        MODALE 
    ///////////////////////////////////////////////////////////////////////-->
    <!-- Modernisiertes Optionen Modal -->
    <UModal v-for="(row, rowIndex) in rows" :key="'options-modal-' + rowIndex" v-model="isOptionsModalOpen[rowIndex]"
      class="options-modal">
      <div class="modal-container">
        <div class="modal-header">
          <div class="header-content">
            <div class="header-icon">
              <i class="i-heroicons-cog-6-tooth-16-solid"></i>
            </div>
            <div class="header-text">
              <h2 class="modal-h2">Optionen konfigurieren</h2>
              <p class="modal-subtitle">Tür {{ rowIndex + 1 }}: {{ row[0]?.doorname || 'Unbenannte Tür' }}</p>
            </div>
          </div>
          <UButton class="close-button" icon="i-heroicons-x-mark" color="red" @click="closeOptionsModal(rowIndex)"
            variant="ghost">
          </UButton>
        </div>

        <div class="modal-body">
          <div class="info-section">
            <i class="i-heroicons-information-circle-16-solid"></i>
            <p>Wählen Sie die gewünschten Zusatzoptionen für diesen Zylinder aus. Alle Optionen sind optional.</p>
          </div>

          <div class="options-container">
            <div v-for="(checkbox, colIndex) in row" :key="colIndex" v-show="colIndex < 1">
              <!-- Prüfung ob Optionen verfügbar sind -->
              <div v-if="store.getOptionsForType(checkbox.type)?.length > 0" class="options-grid">
                <div v-for="option in store.getOptionsForType(checkbox.type)" :key="option" class="option-item">
                  <label class="option-label">
                    <UCheckbox color="blue" :value="option" v-model="checkbox.optionsSelected"
                      class="option-checkbox" />
                    <div class="option-content">
                      <span class="option-text">{{ option }}</span>
                      <!-- Hier könnte später eine Beschreibung ergänzt werden -->
                      <!-- <span class="option-description">Zusätzliche Informationen zur Option</span> -->
                    </div>
                  </label>
                </div>
              </div>

              <!-- Fallback wenn keine Optionen verfügbar -->
              <div v-else class="no-options">
                <div class="no-options-icon">
                  <i class="i-heroicons-archive-box-x-mark-16-solid"></i>
                </div>
                <h3>Keine Optionen verfügbar</h3>
                <p>Für den gewählten Zylindertyp <strong>"{{ checkbox.type }}"</strong> sind derzeit keine
                  Zusatzoptionen verfügbar.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="footer-content">
            <div class="selected-count" v-if="getSelectedOptionsCount(row[0]) > 0">
              <i class="i-heroicons-check-circle-16-solid"></i>
              <span>{{ getSelectedOptionsCount(row[0]) }} Option(en) ausgewählt</span>
            </div>
            <div class="footer-actions">

              <UButton class="save-button" color="blue" variant="solid" @click="closeOptionsModal(rowIndex)"
                icon="i-heroicons-check-16-solid">
                Optionen übernehmen
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UModal>
  </div>


  <!-- Modernisiertes Anlage laden Modal -->
  <UModal v-model="isOpenL" class="load-modal">
    <div class="p-4 modal-container">
      <div class="modal-header">
        <h2 class="modal-h2">Gespeicherte Anlage laden</h2>
        <UButton color="red" @click="isOpenL = false" icon="i-heroicons-x-mark" class="close-button"></UButton>
      </div>

      <div class="modal-content">
        <!-- Info Section mit Icon -->
        <div class="info-section">
          <div class="info-icon">
            <i class="i-heroicons-folder-open-16-solid"></i>
          </div>
          <p class="modal-description">
            Laden Sie Ihre zuvor gespeicherte Schließanlage mit den per E-Mail erhaltenen Zugangsdaten.
          </p>
        </div>

        <!-- Formular -->
        <form @submit.prevent="handleSubmit" class="load-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="id">
                <i class="i-heroicons-hashtag-16-solid"></i>
                Anlagennummer
              </label>
              <UInput color="amber" id="id" v-model="id" type="number" min="1" required placeholder="z.B. 12345"
                class="input-field" />
            </div>

            <div class="form-group">
              <label for="passwordinput">
                <i class="i-heroicons-lock-closed-16-solid"></i>
                Passwort
              </label>
              <UInput color="amber" id="passwordinput" v-model="passwordinput" type="password" required
                placeholder="Ihr Passwort" class="input-field" />
            </div>
          </div>

          <!-- Fehleranzeige -->
          <transition name="slide-down">
            <div v-if="passwordwarning" class="error-message">
              <i class="i-heroicons-exclamation-triangle-16-solid"></i>
              <span>Die eingegebenen Zugangsdaten sind nicht korrekt. Bitte überprüfen Sie Ihre Eingaben.</span>
            </div>
          </transition>

          <!-- Action Button -->
          <UButton @click="buttonladen" type="submit" color="blue" variant="solid" class="load-button" size="lg"
            icon="i-heroicons-arrow-down-tray-16-solid">
            Anlage laden
          </UButton>

          <!-- Hilfe-Hinweis -->
          <div class="help-section">
            <i class="i-heroicons-information-circle-16-solid"></i>
            <p>
              Die Zugangsdaten haben Sie per E-Mail erhalten, als Sie Ihre Anlage gespeichert haben.
              <a href="mailto:office@stt-shop.de" class="help-link">Hilfe benötigt?</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </UModal>

  <!-- Modernisiertes Modal: Fokus auf Design und UX -->
  <UModal v-model="isOfferModalOpen" class="offer-modal">
    <div class="p-4 modal-container">
      <div class="modal-header">
        <UButton color="red" @click="isOfferModalOpen = false" icon="i-heroicons-x-mark" class="close-button"></UButton>
      </div>

      <div class="modal-content">
        <!-- Success Icon und Beschreibung -->
        <div class="success-section">
          <div class="success-icon">
            <i class="i-heroicons-check-circle-solid"></i>
          </div>
          <h2 class="modal-h2">Zum Preisvergleich</h2><br>
          <p class="modal-description">

            Möchten Sie Ihre Konfiguration <b>speichern und später wieder laden</b>? Dann hinterlassen Sie einfach Ihre
            E-Mail –
            Sie erhalten dann Anlagennummer und Passwort.
          </p>
        </div>

        <!-- Kontaktformular -->
        <form @submit.prevent="saveAndProceed" class="contact-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="offer-email">
                <i class="i-heroicons-envelope-16-solid"></i>
                E-Mail
                <span class="optional-badge">optional</span>
              </label>
              <UInput color="amber" id="offer-email" v-model="email" type="email" placeholder="ihre@email.de" />
            </div>

            <div class="form-group">
              <label for="offer-name">
                <i class="i-heroicons-user-16-solid"></i>
                Name
                <span class="optional-badge">optional</span>
              </label>
              <UInput color="amber" id="offer-name" v-model="name" type="text" placeholder="Max Mustermann" />
            </div>

            <div class="form-group">
              <label for="offer-phone">
                <i class="i-heroicons-phone-16-solid"></i>
                Telefon
                <span class="optional-badge">optional</span>
              </label>
              <UInput color="amber" id="offer-phone" v-model="phone" type="tel" placeholder="+49 123 456789" />
            </div>
          </div>

          <!-- CTA Button -->
          <UButton type="submit" color="green" variant="solid" class="cta-button" size="lg"
            icon="i-heroicons-arrow-right-16-solid">
            Zu der Preisübersicht
          </UButton>

          <!-- Hinweis -->
          <p class="form-hint">
            <i class="i-heroicons-information-circle-16-solid"></i>
            Sie können auch ohne Angaben fortfahren und die Angebote direkt einsehen.
          </p>
        </form>
      </div>
    </div>
  </UModal>

  <transition name="fade">
    <div v-if="alertMessage" :class="['alert', alertType]">
      <i v-if="alertType === 'error'" class="i-heroicons-exclamation-circle"></i>
      <i v-if="alertType === 'success'" class="i-heroicons-check-circle"></i>
      <span>{{ alertMessage }}</span>
    </div>
  </transition>



  <UModal v-model="isOpenS">
    <div class="p-4 modal-container">
      <div class="modal-header">
        <h2 class="modal-h2">Anlage speichern</h2>
        <UButton color="red" @click="isOpenS = false" icon="i-heroicons-x-mark" class="close-button"></UButton>
      </div>
      <p class="modal-info">
        Bitte überprüfen Sie Ihre Angaben und geben Sie Ihre E-Mail-Adresse ein. Eine Bestätigungsmail wird Ihnen
        zugeschickt.
      </p>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">E-Mail:</label>
          <UInput color="amber" id="email" v-model="email" min="1" type="email" required />
        </div>
        <UButton @click="buttonspeichern" type="submit" color="amber" variant="solid" class="modal-button">
          Speichern
        </UButton>
      </form>
    </div>
  </UModal>

</template>

<script>
import ColumnModal from "./ColumnModal.vue";
import { useCylinderStore } from "@/stores/cylinderStores.js";

export default {
  components: {
    ColumnModal,
  },

  data() {
    return {
      ///////////////////////////////////
      anlageNr: "",
      object: "",
      id: "",
      password: "",
      email: "",
      name: "",
      phone: "",
      company: "",
      typ: "",
      ///////////////////////////////////
      protect: 0,
      modalStates: {},
      passwordinput: "",
      passwordwarning: false,
      ///////////////////////////////////
      isOpen: false,
      isOpenL: false,
      isOpenS: false,
      isDropdownOpen: {},
      isOptionsModalOpen: {},
      isOfferModalOpen: false,
      ///////////////////////////////////
      hoverInfo: false,
      selectedModelLocal: "",
      oldModel: "",
      isWarningModalOpen: false,
      pendingModel: null,
      overrideToGleichschliessung: false,
      ///////////////////////////////////
      alertMessage: "",
      alertType: "",
      ///////////////////////////////////
      showIntroText: true,
      activeStep: 1,
      ///////////////////////////////////
      isTemplateModalOpen: false,
      selectedTemplateId: null,
      templates: [
        {
          id: 'einfamilienhaus',
          name: 'Einfamilienhaus',
          icon: 'i-heroicons-home',
          color: 'green',
          doors: [
            { position: 1, name: 'Haustür', type: 'Doppelzylinder', outside: 40, inside: 40, options: [] },
            { position: 2, name: 'Kellertür', type: 'Doppelzylinder', outside: 35, inside: 35, options: [] },
            { position: 3, name: 'Terrassentür', type: 'Doppelzylinder', outside: 35, inside: 40, options: [] },
            { position: 4, name: 'Gartentür', type: 'Doppelzylinder', outside: 30, inside: 30, options: [] },
            { position: 5, name: 'Garage', type: 'Halbzylinder', outside: 30, inside: 10, options: [] }
          ],
          keys: [
            { id: 1, name: 'Hauptschlüssel' },
            { id: 2, name: 'Elternschlüssel' },
            { id: 3, name: 'Kinderschlüssel' }
          ],
          matrix: [
            [true, true, true],
            [true, true, false],
            [true, true, true],
            [true, true, false],
            [true, false, false]
          ]
        },
        {
          id: 'mehrfamilienhaus',
          name: 'Mehrfamilienhaus',
          icon: 'i-heroicons-building-office-2',
          color: 'blue',
          doors: [
            { position: 1, name: 'Haupteingang', type: 'Doppelzylinder', outside: 40, inside: 40, options: ["Not- & Gefahrenfunktion"] },
            { position: 2, name: 'Kellertür', type: 'Doppelzylinder', outside: 35, inside: 35, options: [] },
            { position: 3, name: 'Wohnung 1', type: 'Doppelzylinder', outside: 35, inside: 40, options: [] },
            { position: 4, name: 'Wohnung 2', type: 'Doppelzylinder', outside: 35, inside: 40, options: [] },
            { position: 5, name: 'Wohnung 3', type: 'Doppelzylinder', outside: 35, inside: 40, options: [] },
            { position: 6, name: 'Hintereingang', type: 'Doppelzylinder', outside: 35, inside: 35, options: [] },
            { position: 7, name: 'Fahrradkeller', type: 'Doppelzylinder', outside: 30, inside: 30, options: [] }
          ],
          keys: [
            { id: 1, name: 'Hausmeister' },
            { id: 2, name: 'Wohnung 1' },
            { id: 3, name: 'Wohnung 2' },
            { id: 4, name: 'Wohnung 3' }
          ],
          matrix: [
            [true, true, true, true],
            [true, true, true, true],
            [false, true, false, false],
            [false, false, true, false],
            [false, false, false, true],
            [true, true, true, true],
            [true, true, true, true]
          ]
        },
        {
          id: 'betriebsgebaeude',
          name: 'Betriebsgebäude',
          icon: 'i-heroicons-building-office',
          color: 'indigo',
          doors: [
            { position: 1, name: 'Haupteingang', type: 'Doppelzylinder', outside: 45, inside: 45, options: ["Not- & Gefahrenfunktion"] },
            { position: 2, name: 'Personaleingang', type: 'Doppelzylinder', outside: 40, inside: 40, options: [] },
            { position: 3, name: 'Büro Geschäftsführer', type: 'Doppelzylinder', outside: 35, inside: 40, options: [] },
            { position: 4, name: 'Büro Verwaltung', type: 'Doppelzylinder', outside: 35, inside: 40, options: [] },
            { position: 5, name: 'Serverraum', type: 'Doppelzylinder', outside: 35, inside: 35, options: ["Erhöhter Bohrschutz"] },
            { position: 6, name: 'Lager', type: 'Doppelzylinder', outside: 40, inside: 40, options: [] },
            { position: 7, name: 'Werkstatt', type: 'Doppelzylinder', outside: 40, inside: 40, options: [] },
            { position: 8, name: 'Außentür Hof', type: 'Doppelzylinder', outside: 40, inside: 40, options: ["Seewasserfest"] }
          ],
          keys: [
            { id: 1, name: 'Generalschlüssel' },
            { id: 2, name: 'Geschäftsführer' },
            { id: 3, name: 'Büropersonal' },
            { id: 4, name: 'Werkstattpersonal' },
            { id: 5, name: 'IT-Admin' }
          ],
          matrix: [
            [true, true, true, true, true],
            [true, true, true, true, true],
            [true, true, false, false, false],
            [true, true, true, false, false],
            [true, true, false, false, true],
            [true, true, true, true, false],
            [true, true, false, true, false],
            [true, true, true, true, false]
          ]
        },
        {
          id: 'einzelhandel',
          name: 'Einzelhandel',
          icon: 'i-heroicons-shopping-bag',
          color: 'orange',
          doors: [
            { position: 1, name: 'Haupteingang', type: 'Doppelzylinder', outside: 40, inside: 40, options: ["Not- & Gefahrenfunktion"] },
            { position: 2, name: 'Hintereingang', type: 'Doppelzylinder', outside: 35, inside: 35, options: [] },
            { position: 3, name: 'Büro', type: 'Doppelzylinder', outside: 35, inside: 40, options: [] },
            { position: 4, name: 'Lager', type: 'Doppelzylinder', outside: 40, inside: 40, options: [] },
            { position: 5, name: 'Personalraum', type: 'Doppelzylinder', outside: 35, inside: 35, options: [] },
            { position: 6, name: 'Tresor/Wertsachen', type: 'Doppelzylinder', outside: 35, inside: 35, options: ["Erhöhter Bohrschutz"] }
          ],
          keys: [
            { id: 1, name: 'Inhaber' },
            { id: 2, name: 'Filialleiter' },
            { id: 3, name: 'Mitarbeiter' }
          ],
          matrix: [
            [true, true, true],
            [true, true, true],
            [true, true, false],
            [true, true, true],
            [true, true, true],
            [true, true, false]
          ]
        }
      ],
      ///////////////////////////////////
      rows: [

        [
          {
            position: 1,
            doorDesignation: "",
            doorquantity: 1,
            type: "",
            outside: "",
            inside: "",
            options: {},
            optionsSelected: [],
            checked: !this.isSchliessanlage,
            keyquantity: 1,
            keyname: "Schlüssel 1",
            keycolor: "",
          },

        ],
      ],
    };
  },

  computed: {
    selectedTemplate() {
      return this.templates.find(template => template.id === this.selectedTemplateId);
    },
    hasDataInFirstRow() {
      if (this.rows.length === 0) return false;
      const firstRow = this.rows[0][0];
      return !!(firstRow.doorDesignation || firstRow.type || firstRow.outside || firstRow.inside);
    },
    store() {
      return useCylinderStore();
    },
    isSchliessanlage() {
      // falls override aktiv ist => return false
      if (this.overrideToGleichschliessung) {
        return false;
      }
      // sonst den Wert aus dem Store
      return this.store.isSchliessanlage;
    },

    modelOptions() {
      return Object.keys(zylindermodelle);
    },

    finalGleichschliessungState: {
      get() {
        // 1) Falls im Store gar keine Schließanlage gesetzt => immer Gleichschließung
        if (!this.store.isSchliessanlage) {
          return true;
        }

        // 2) Falls das Modell z.B. ABUS Ec 550 => immer Gleichschließung
        const model = this.store.currentModel || "";
        if (model === "ABUS Ec 550") {
          return true;
        }

        // 3) sonst: nutze den (vom Nutzer) toggelbaren Wert
        return this.overrideToGleichschliessung;
      },
      set(val) {
        this.overrideToGleichschliessung = val;
      },
    },

    disableGleichToggle() {
      if (!this.store.isSchliessanlage) {
        // => schon Gleichschließung => nichts zu toggeln
        return true;
      }
      if (this.store.currentModel === "ABUS Ec 550") {
        // => immer Gleichschließung => nichts zu toggeln
        return true;
      }
      return false;
    },

    effectiveIsSchliessanlage() {
      // Wir wollen: Schließanlage == NICHT Gleichschließung
      // Also:
      return !this.finalGleichschliessungState;
    },
    selectedModel: {
      get() {
        return this.store.currentModel;
      },
      set(value) {
        this.store.setModel(value);
      },
    },
    sizesDouble() {
      return this.store.sizesDouble;
    },
    sizesKnob() {
      return this.store.sizesKnob;
    },
    sizesHalf() {
      return this.store.sizesHalf;
    },
    options() {
      return this.store.options;
    },
    cylinderType() {
      return this.store.cylinderType;
    },
    showLoadButton() {
      return this.$route.path.includes("/admin");
    },
  },
  created() {
    // direkt beim Erzeugen des Components
    // — falls im Store schon “Kein bestimmtes Modell” steht, nimm das,
    //   ansonsten nimm den ersten Wert aus availableModels
    this.selectedModelLocal =
      this.store.currentModel ||
      (this.store.availableModels.length > 0
        ? this.store.availableModels[0]
        : "");
    this.oldModel = this.selectedModelLocal;

    // Setze optional auch im Store den Default, falls noch leer
    if (!this.store.currentModel) {
      this.store.setModel(this.selectedModelLocal);
    }
  },
  watch: {
    "store.selectedModel": {
      immediate: true,
      handler(newVal) {
        this.selectedModelLocal = newVal;
        this.oldModel = newVal;
        // Aktualisiere den aktiven Schritt, wenn ein Modell ausgewählt wurde
        if (newVal && newVal !== "Kein bestimmtes Modell") {
          this.activeStep = 2;
        }
      },
    },
    'store.currentModel': {
      immediate: true,
      handler(v) {
        this.selectedModelLocal = v;
        this.oldModel = v;
      }
    },
    "$route.query.anlageNr": {
      handler(newVal) {
        if (newVal) {
          this.id = newVal;
          this.loadInstallation();
        }
      },
      immediate: true,
    },
  },
  methods: {

    getSelectedOptionsCount(checkbox) {
      if (!checkbox || !checkbox.optionsSelected) return 0;
      return checkbox.optionsSelected.length;
    },

    // Alle Optionen einer Tür abwählen
    clearAllOptions(checkbox) {
      if (checkbox && checkbox.optionsSelected) {
        checkbox.optionsSelected = [];
      }
    },

    // Optional: Schnellauswahl für häufige Kombinationen
    selectCommonOptions(checkbox, type) {
      // Beispiel für häufige Optionen je nach Zylindertyp
      const commonOptions = {
        'Profilzylinder': ['Gleichschließend', 'Sicherheitskarte'],
        'Halbzylinder': ['Gleichschließend'],
        'Knaufzylinder': ['Gleichschließend', 'Sicherheitskarte'],
        // Weitere Typen nach Bedarf
      };

      if (checkbox && commonOptions[type]) {
        checkbox.optionsSelected = [...commonOptions[type]];
      }
    },
    applyTemplate(templateId) {
      this.selectedTemplateId = templateId;
      this.isTemplateModalOpen = true;
    },
    confirmApplyTemplate() {
      const template = this.selectedTemplate;
      if (!template) return;

      // 1. Modell explizit auf "Kein bestimmtes Modell" setzen
      this.store.setModel("Kein bestimmtes Modell");
      this.selectedModelLocal = "Kein bestimmtes Modell";
      this.oldModel = "Kein bestimmtes Modell";

      // 2. Alte Daten löschen und neue Türen hinzufügen
      this.rows = [];

      // Für jede Tür in der Vorlage
      template.doors.forEach((door, doorIndex) => {
        const newRow = [];

        // Für jeden Schlüssel in der Vorlage
        template.keys.forEach((key, keyIndex) => {
          if (doorIndex === 0) {
            // Erste Zeile mit allen Details
            newRow.push({
              position: door.position,
              doorDesignation: door.name,
              doorquantity: 1,
              type: door.type,
              outside: door.outside,
              inside: door.inside,
              options: {},
              optionsSelected: door.options || [],
              checked: template.matrix[doorIndex][keyIndex],
              keyquantity: 1,
              keyname: key.name,
              keycolor: "",
            });
          } else {
            // Weitere Zeilen nur mit Checkbox-Status
            newRow.push({
              position: door.position,
              doorDesignation: door.name,
              doorquantity: 1,
              type: door.type,
              outside: door.outside,
              inside: door.inside,
              options: {},
              optionsSelected: door.options || [],
              checked: template.matrix[doorIndex][keyIndex],
            });
          }
        });

        this.rows.push(newRow);
      });

      // Modal schließen
      this.isTemplateModalOpen = false;

      // Erfolgs-Meldung anzeigen
      this.alertMessage = `Vorlage "${template.name}" erfolgreich angewendet! Das Modell wurde auf "Kein bestimmtes Modell" zurückgesetzt.`;
      this.alertType = "success";
      setTimeout(() => {
        this.alertMessage = "";
        this.alertType = "";
      }, 3000);
    },

    openOptionsModal(rowIndex) {
      this.isOptionsModalOpen[rowIndex] = true;
    },
    closeOptionsModal(rowIndex) {
      this.isOptionsModalOpen[rowIndex] = false;
    },

    toggleDropdown(rowIndex) {
      if (!this.isDropdownOpen[rowIndex]) {
        this.isDropdownOpen[rowIndex] = true;
      } else {
        this.isDropdownOpen[rowIndex] = !this.isDropdownOpen[rowIndex];
      }
    },

    getAllOptionsForType(checkbox) {
      if (this.store.selectedModel && checkbox.type) {
        const typeKey = checkbox.type.replace(/\s*\(.*?\)/g, "");
        const optionsData = this.store.getOptionsForType(typeKey);
        if (Array.isArray(optionsData)) {
          return { Optionen: optionsData };
        } else {
          return optionsData;
        }
      }
      return {};
    },

    getSelectedOptionsText(checkbox) {
      if (checkbox.optionsSelected && checkbox.optionsSelected.length) {
        // Zeige die Werte als Komma-getrennte Liste an
        return checkbox.optionsSelected.join(", ");
      }
      return "";
    },

    optionsToString(options) {
      const optionsArray = [];
      for (const category in options) {
        if (options[category]) {
          optionsArray.push(`${category}:${options[category]}`);
        }
      }
      return optionsArray.join(", ");
    },

    stringToOptions(optionsString, availableOptions) {
      const optionsArray = optionsString.split(", ").filter(Boolean);
      const options = {};
      optionsArray.forEach((optionPair) => {
        const [category, option] = optionPair.split(":");
        if (
          category &&
          option &&
          availableOptions[category]?.includes(option)
        ) {
          options[category] = option;
        } else if (availableOptions.Optionen?.includes(optionPair)) {
          options.Optionen = optionPair;
        }
      });
      return options;
    },

    closeAllDropdowns() {
      Object.keys(this.isDropdownOpen).forEach((key) => {
        this.isDropdownOpen[key] = false;
      });
    },

    handleClickOutside(event) {
      if (
        this.$refs.dropdownContainer &&
        !this.$refs.dropdownContainer.contains(event.target)
      ) {
        this.isDropdownOpen = false;
      }
    },

    changeModel() {
      this.store.setModel(this.selectedModel);
      this.rows.forEach((row) => {
        row.forEach((checkbox) => {
          checkbox.type = "";
          checkbox.inside = "";
          checkbox.outside = "";
          checkbox.options = "";
          checkbox.optionsSelected = [];
        });
      });
    },

    getAvailableInsideSizes(checkbox) {
      const sizes = this.getSizesForType(checkbox.type);
      if (checkbox.outside) {
        return sizes
          .filter((size) => size.outside === Number(checkbox.outside))
          .map((size) => size.inside)
          .filter((value, index, self) => self.indexOf(value) === index);
      } else {
        return sizes
          .map((size) => size.inside)
          .filter((value, index, self) => self.indexOf(value) === index);
      }
    },

    getAvailableOutsideSizes(checkbox) {
      const sizes = this.getSizesForType(checkbox.type);
      if (checkbox.inside) {
        return sizes
          .filter((size) => size.inside === Number(checkbox.inside))
          .map((size) => size.outside)
          .filter((value, index, self) => self.indexOf(value) === index);
      } else {
        return sizes
          .map((size) => size.outside)
          .filter((value, index, self) => self.indexOf(value) === index);
      }
    },

    getSizesForType(type) {
      if (this.store.selectedModel && type) {
        const typeKey = type.replace(/\s*\(.*?\)/g, "");
        return this.store.getSizesForType(typeKey);
      }
      return [];
    },

    getAvailableOptions(checkbox) {
      if (this.store.selectedModel && checkbox.type) {
        const typeKey = checkbox.type.replace(/\s*\(.*?\)/g, "");
        return this.store.getOptionsForType(typeKey);
      }
      return {};
    },

    setOption(checkbox, category, value) {
      if (!checkbox.options) {
        this.$set(checkbox, "options", {});
      }
      this.$set(checkbox.options, category, value);
    },
    getAllOptionsForType(checkbox) {
      if (this.store.selectedModel && checkbox.type) {
        const typeKey = checkbox.type.replace(/\s*\(.*?\)/g, "");
        return this.store.getOptionsForType(typeKey);
      }
      return [];
    },
    setSingleOption(checkbox, value) {
      checkbox.options = value;
    },

    onTypeChange(checkbox) {
      if (!this.isSchliessanlage) {
        checkbox.checked = true;
      }
      checkbox.inside = "";
      checkbox.outside = "";
      checkbox.options = {};
      checkbox.optionsSelected = [];
    },

    onInsideSizeChange(checkbox) {
      if (!this.isSizeCombinationValid(checkbox)) {
        checkbox.outside = "";
      }
    },

    onOutsideSizeChange(checkbox) {
      if (!this.isSizeCombinationValid(checkbox)) {
        checkbox.inside = "";
      }
    },

    isSizeCombinationValid(checkbox) {
      const sizes = this.getSizesForType(checkbox.type);
      return sizes.some(
        (size) =>
          size.inside === Number(checkbox.inside) &&
          size.outside === Number(checkbox.outside)
      );
    },
    resetOptions(rowIndex) {
      this.rows[rowIndex].options = [];
    },

    navigateToSysteme() {
      this.$router.push({
        name: "systeme",
        query: {
          anlageNr: this.anlageNr,
          isSchliessanlage: this.store.isSchliessanlage,
        },
      });
    },

    openModal(colIndex) {
      this.modalStates[colIndex] = true;
    },

    closeModal(colIndex) {
      this.modalStates[colIndex] = false;
    },

    updateColumnName(colIndex, newName) {
      this.rows[0][colIndex].keyname = newName;
    },

    addRow() {
      const numCheckboxes = this.rows[0].length;
      const newRow = [];

      for (let i = 0; i < numCheckboxes; i++) {
        newRow.push({
          position: this.rows.length + 1,
          doorDesignation: "",
          doorquantity: 1,
          type: "",
          outside: "",
          inside: "",
          options: {},
          optionsSelected: [],
          checked: !this.isSchliessanlage,
          keyquantity: 1,
          keyname: "Schlüssel " + (i + 1),
        });
      }

      this.rows.push(newRow);
    },

    toggleRadio(checkbox, categoryName, option) {
      if (checkbox.options[categoryName] === option) {
        this.set(checkbox.options, categoryName, null);
      } else {
        this.set(checkbox.options, categoryName, option);
      }
    },

    addCheckbox() {
      this.rows.forEach((checkbox) => {
        if (!this.isSchliessanlage) {
          checkbox.push({
            checked: true,
            keyquantity: 1,
            keyname: "Schlüssel " + (this.rows[0].length + 1),
          });
        } else
          checkbox.push({
            checked: false,
            keyquantity: 1,
            keyname: "Schlüssel " + (this.rows[0].length + 1),
          });
      });
    },

    deleteCheckbox(colIndex) {
      if (colIndex === 0) {
        alert(
          "Die erste Spalte enthält die Hauptdaten und kann nicht entfernt werden."
        );
        return;
      }

      const hasMultipleColumns = this.rows.some((row) => row.length > 1);
      if (hasMultipleColumns || colIndex > 0) {
        this.rows.forEach((row) => row.splice(colIndex, 1));
      } else {
        alert("Die letzte Spalte kann nicht entfernt werden.");
      }
    },

    deleteRow(rowIndex) {
      if (this.rows.length > 1 || rowIndex > 0) {
        this.rows.splice(rowIndex, 1);
      } else {
        alert("Die letzte Zeile kann nicht entfernt werden.");
      }
    },

    duplicateRow(rowIndex) {
      const currentRow = this.rows[rowIndex];
      const newRow = this.deepCopy(currentRow);
      this.rows.splice(rowIndex + 1, 0, newRow);
    },

    duplicateCol(colIndex) {
      this.rows.forEach((row, rowIndex) => {
        if (row[colIndex]) {
          const newCol = this.deepCopy(row[colIndex]);
          row.splice(colIndex + 1, 0, newCol);
        }
      });
    },

    deepCopy(obj) {
      if (typeof obj !== "object" || obj === null) {
        return obj;
      }
      const copy = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          copy[key] = this.deepCopy(obj[key]);
        }
      }
      return copy;
    },

    generateRandomAnlagenNummer() {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      this.anlageNr = randomNum.toString();
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let password = "";
      for (let i = 0; i < 6; i++) {
        password += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      this.password = password;
      console.log(this.password);
    },

    async test() {
      console.log("test");
      try {
        const response = await fetch("./api/wc-cart-add-item", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: 25012,
            price: 50,
            quantity: 1,
            Anlage: this.anlageNr,
            billing_first_name: "Frank",
            billing_last_name: "Bose",
            billing_address_1: "Walsroder Straße 24-26",
            billing_city: "Wedemark",
            billing_postcode: "30900",
            billing_country: "DE",
            billing_email: "fb@secutimetec.de",
          }),
        });
        console.log(test);
        // https://www.stt-shop.de/warenkorb/?cocart-load-cart=t_e7d1a169c9f7858d77450e9a4927dc
        const result = await response.json();
        if (result.success) {
          console.log = "Produkt erfolgreich in den Warenkorb gelegt.";
        } else {
          console.log =
            "Fehler beim Hinzufügen des Produkts: " + result.message;
        }
      } catch (error) {
        console.log = "Es gab einen Fehler bei der Anfrage: " + error;
      }
    },

    async saveAndProceed() {

      await this.buttonspeichern();

      this.$router.push({
        name: "systeme",
        query: {
          anlageNr: this.anlageNr,
          isSchliessanlage: this.store.isSchliessanlage,
        },
      });

      // Schließe das Modal und leite weiter
      this.isOfferModalOpen = false;
      // Falls in buttonspeichern() noch nicht enthalten, kannst du hier die Weiterleitung ausführen:
      // this.$router.push({ name: "systeme", query: { anlageNr: this.anlageNr, isSchliessanlage: this.store.isSchliessanlage } });
    },


    validateConfiguration() {
      /* 1) Prüfe, ob alle Pflichtfelder der Türen ausgefüllt sind */
      for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
        const { type, outside, inside } = this.rows[rowIndex][0];
        if (!type) {
          alert(`Bitte Zylinder-Typ in Zeile ${rowIndex + 1} wählen.`);
          return false;
        }
        if (!outside) {
          alert(`Bitte Außenmaß in Zeile ${rowIndex + 1} wählen.`);
          return false;
        }
        if (!inside) {
          alert(`Bitte Innenmaß in Zeile ${rowIndex + 1} wählen.`);
          return false;
        }
      }

      /* 2) Falls Schließanlage: jeder Schlüssel (Spalte) muss mind. einen Zylinder schließen */
      if (this.isSchliessanlage) {
        const colCount = this.rows[0].length;

        for (let c = 0; c < colCount; c++) {
          let keyHasLock = false;
          for (let r = 0; r < this.rows.length; r++) {
            if (this.rows[r][c].checked) {
              keyHasLock = true;
              break;
            }
          }
          if (!keyHasLock) {
            alert(
              `Bitte mindestens eine Berechtigung in Spalte #${c + 1} setzen (Schließanlage).`
            );
            return false;
          }
        }

        /* 3) NEU: jeder Zylinder (Zeile) muss mind. von einem Schlüssel geschlossen werden */
        for (let r = 0; r < this.rows.length; r++) {
          let lockHasKey = false;
          for (let c = 0; c < colCount; c++) {
            if (this.rows[r][c].checked) {
              lockHasKey = true;
              break;
            }
          }
          if (!lockHasKey) {
            alert(
              `Bitte mindestens einen Schlüssel für den Zylinder in Zeile ${r + 1} auswählen.`
            );
            return false;
          }
        }
      }

      /* 4) Weitere Prüfungen (Optionen, etc.) hier einfügen */

      return true; // alle Checks bestanden
    },


    async saveInstallation() {
      // Validierung prüfen
      if (!this.validateConfiguration()) {
        // Validierung schlug fehl – Funktion wird abgebrochen
        return false;
      }


      // 3) Falls anlageNr noch leer => generiere
      if (this.anlageNr === "") {
        let antwort;
        do {
          this.generateRandomAnlagenNummer();
          const response = await $fetch("./api/sqltestanlage?ID=" + this.anlageNr, {
            method: "post",
          });
          antwort = response.message;
        } while (antwort === "Anlagennummer existiert.");
      }

      // 4) Anlage in der DB speichern
      const queryresultanlage = await $fetch("./api/sqlpostanlageneu", {
        method: "post",
        body: {
          ID: this.anlageNr,
          Objekt: this.object,
          Name: this.name,
          EMail: this.email,
          Telefon: this.phone,
          Firma: this.company,
          Typ: "Desktop",
          Modell: this.store.selectedModel,
          protect: this.protect,
          Password: this.password,
        },
      });

      if (queryresultanlage) {
        // Speichere Positionen, Schlüssel und Matrix wie bisher...
        const RowObject = this.rows.map((row, rowIndex) => ({
          POS: rowIndex + 1,
          Bezeichnung: row[0].doorDesignation || "",
          Anzahl: row[0].doorquantity || "",
          Typ: row[0].type || "",
          SizeA: row[0].outside || "",
          SizeI: row[0].inside || "",
          Option: (row[0].optionsSelected || []).join(", "),
        }));
        await $fetch("./api/sqlpostposition?ID=" + this.anlageNr, {
          method: "post",
          body: RowObject,
        });

        const KeyNameObject = this.rows[0].map((col, colIndex) => ({
          keyPos: colIndex + 1,
          keyname: col.keyname,
          keyquantity: col.keyquantity || 1,
        }));
        await $fetch("./api/sqlpostschluessel?ID=" + this.anlageNr, {
          method: "post",
          body: KeyNameObject,
        });

        const Matrix = this.rows.flatMap((row, rowIndex) =>
          row.map((col, colIndex) => ({
            position: rowIndex + 1,
            keynr: colIndex + 1,
            checked: col.checked || false,
          }))
        );
        await $fetch("./api/sqlpostmatrix?ID=" + this.anlageNr, {
          method: "post",
          body: Matrix,
        });

        // Erfolgsmeldung setzen
        this.alertMessage = "Die Anlage wurde erfolgreich gespeichert.";
        this.alertType = "success";
        setTimeout(() => {
          this.alertMessage = "";
          this.alertType = "";
        }, 3000);
      }
      return true;
    },
    weiterleitung_systeme() {
      // 8) Weiterleitung zur systeme.vue
      this.$router.push({
        name: "systeme",
        query: {
          anlageNr: this.anlageNr,
          isSchliessanlage: this.store.isSchliessanlage,
        },
      });
    },

    async buttonweitersysteme() {
      await this.saveInstallation();
      this.weiterleitung_systeme();
    },
    buttonladen() {
      this.checkpassword();
    },

    async handleWeiterZuAngeboten() {
      // Zuerst alle Validierungen durchführen
      if (!this.validateConfiguration()) {
        // Bei Fehlern wird in validateConfiguration bereits ein Alert ausgegeben.
        // Hier einfach abbrechen:
        return;
      }

      // Wenn die Konfiguration valide ist, prüfen wir, ob die Anlage schon existiert.
      // Dabei gehen wir davon aus, dass wenn sowohl anlageNr als auch email gesetzt sind, 
      // bereits eine Anlage vorhanden ist.
      if (this.anlageNr && this.email) {
        // Bestehende Anlage: direkt speichern (ohne erneute E-Mail) und weiterleiten
        const saved = await this.saveInstallation();
        if (saved) {
          this.$router.push({
            name: "systeme",
            query: {
              anlageNr: this.anlageNr,
              isSchliessanlage: this.store.isSchliessanlage,
            },
          });
        }
      } else {
        // Neue Anlage: Zeige das E-Mail Modal, damit der Kunde seine Kontaktdaten (und optional Name/Telefon) eingibt.
        this.activeStep = 3;
        this.isOfferModalOpen = true;
      }
    },


    handleAnlageSpeichern() {
      if (this.id && this.email) {
        this.saveInstallation();
      } else {
        this.isOpenS = true;
      }
    },

    async buttonspeichern() {
      const saved = await this.saveInstallation();
      if (saved) {
        await this.sendmailoffice();
        await this.sendmailkunde();
      }
      this.isOpenS = false;
    },


    async checkpassword() {
      const resultcheckpassword = await $fetch("./api/sqlgetanlage", {
        method: "post",
        body: { ID: this.id },
      });
      this.password = resultcheckpassword.queryresult[0].Password || "";
      if (this.password === this.passwordinput) {
        this.passwordwarning = false;
        this.loadInstallation();
        this.isOpenL = false;
      } else {
        this.passwordwarning = true;
      }

      //console.log('DatenbankPASS: ' + this.password);
      //console.log('PASSFormular: ' + this.passwordinput);
    },

    async loadInstallation() {
      this.rows.length = 1;
      this.rows[0].length = 1;

      // Daten für die Anlage
      const queryresultanlage = await $fetch("./api/sqlgetanlage", {
        method: "post",
        body: { ID: this.id },
      });

      if (
        !queryresultanlage ||
        !queryresultanlage.queryresult ||
        queryresultanlage.queryresult.length === 0
      ) {
        // Anlage existiert nicht – Alert anzeigen
        this.alertMessage = "Diese Anlage existiert nicht.";
        this.alertType = "error";
        return;
      } else {
        // Daten übernehmen
        this.anlageNr = queryresultanlage.queryresult[0].ID || "";
        this.object = queryresultanlage.queryresult[0].Objekt || "";
        this.name = queryresultanlage.queryresult[0].Name || "";
        this.email = queryresultanlage.queryresult[0].EMail || "";
        this.phone = queryresultanlage.queryresult[0].Telefon || "";
        this.company = queryresultanlage.queryresult[0].Firma || "";
        this.typ = queryresultanlage.queryresult[0].Typ || "";
        const loadedModel = queryresultanlage.queryresult[0].Modell;
        this.store.setModel(loadedModel);
        this.protect = queryresultanlage.queryresult[0].protect || "";
        this.password = queryresultanlage.queryresult[0].Password || "";

        // Erfolgsmeldung anzeigen
        this.alertMessage = "Die Anlage wurde erfolgreich geladen.";
        this.alertType = "success";

        // Optional: Alert nach einigen Sekunden ausblenden
        setTimeout(() => {
          this.alertMessage = "";
          this.alertType = "";
        }, 3000);
      }

      const queryresultposition = await $fetch("./api/sqlgetposition", {
        method: "post",
        body: { ID: this.id },
      });
      const maxZeilePosition = Math.max(
        ...queryresultposition.queryresult.map((item) => item.POS)
      );

      for (let i = 0; i < maxZeilePosition - 1; i++) {
        const numCheckboxes = this.rows[0].length;
        const newRow = [];
        for (let j = 0; j < numCheckboxes; j++) {
          newRow.push({ checked: false, doorquantity: 1 });
        }
        this.rows.push(newRow);
      }

      queryresultposition.queryresult.forEach((item) => {
        const zeile = item.POS - 1;
        this.rows[zeile][0].doorDesignation = item.Bezeichnung;
        this.rows[zeile][0].doorquantity = item.Anzahl || 1;
        this.rows[zeile][0].type = item.Typ || "";
        this.rows[zeile][0].outside = item.SizeA || "";
        this.rows[zeile][0].inside = item.SizeI || "";

        const loadedString = item.Option || "";
        this.rows[zeile][0].optionsSelected = loadedString
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      });

      const queryresultschluessel = await $fetch("./api/sqlgetschluessel", {
        method: "post",
        body: { ID: this.id },
      });

      const maxSpalteSchluessel = Math.max(
        ...queryresultschluessel.queryresult.map((item) => item.KeyPOS)
      );

      while (this.rows[0].length < maxSpalteSchluessel) {
        this.addCheckbox();
      }

      queryresultschluessel.queryresult.forEach((item) => {
        const spalte = item.KeyPOS - 1;
        this.rows[0][spalte].keyname = item.Bezeichnung;
        this.rows[0][spalte].keyquantity = item.Anzahl;
      });

      const queryresultmatrix = await $fetch("./api/sqlgetmatrix", {
        method: "post",
        body: { ID: this.id },
      });

      const maxZeile = Math.max(
        ...queryresultmatrix.queryresult.map((item) => item.POSZylinder)
      );
      const maxSpalte = Math.max(
        ...queryresultmatrix.queryresult.map((item) => item.POSSchluessel)
      );

      queryresultmatrix.queryresult.forEach((item) => {
        const zeile = item.POSZylinder - 1;
        const spalte = item.POSSchluessel - 1;
        this.rows[zeile][spalte].checked = item.Berechtigung;
      });
      this.isOpenL = false;
    },

    onModelSelect() {
      if (this.selectedModelLocal !== this.oldModel) {
        // speichere das neue Modell zwischen und zeige das Modal
        this.pendingModel = this.selectedModelLocal;
        this.selectedModelLocal = this.oldModel;
        this.isWarningModalOpen = true;
      }
    },

    confirmChange() {
      // wenn bestätigt, setze das Modell um und räume Daten
      this.selectedModel = this.pendingModel;
      this.oldModel = this.pendingModel;
      this.isWarningModalOpen = false;
      this.pendingModel = null;
      // hier z.B. rows zurücksetzen …
      this.rows.forEach(row =>
        row.forEach(c => {
          c.type = '';
          c.inside = '';
          c.outside = '';
          c.optionsSelected = [];
          c.checked = !this.isSchliessanlage;
        })
      );
      this.activeStep = 2;
    },
    cancelChange() {
      // Abbruch: Auswahl zurücksetzen
      this.isWarningModalOpen = false;
      this.pendingModel = null;
      this.selectedModelLocal = this.oldModel;
    },

    mounted() {
      this.generateRandomAnlagenNummer();
      document.addEventListener("click", this.closeAllDropdowns);
      // Wenn noch kein Modell im Store steht, auf den Default‑Placeholder zurücksetzen:
      this.selectedModelLocal = this.store.currentModel || "";
      this.oldModel = this.selectedModelLocal;

      // Falls du direkt auch im Store den Default repräsentieren willst:
      if (!this.store.currentModel) {
        this.store.setModel("");
      }

      if (this.$route.query.anlageNr) {
        this.id = this.$route.query.anlageNr;
        this.loadInstallation();
      }
    },
    beforeUnmount() {
      document.removeEventListener("click", this.closeAllDropdowns);
    },

    async sendmailoffice() {
      const message = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color: #007BFF;">Neue gespeicherte Konfiguration</h2>
        <p>Es wurde eine neue Konfiguration im Schließanlagenkonfigurator gespeichert. Hier die Details:</p>
        <table style="border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 8px; font-weight: bold;">Anlagennummer:</td>
            <td style="padding: 4px 8px;">${this.anlageNr}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px; font-weight: bold;">Name:</td>
            <td style="padding: 4px 8px;">${this.name || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px; font-weight: bold;">E-Mail:</td>
            <td style="padding: 4px 8px;">${this.email || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px; font-weight: bold;">Telefon:</td>
            <td style="padding: 4px 8px;">${this.phone || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px; font-weight: bold;">Modell:</td>
            <td style="padding: 4px 8px;">${this.store.selectedModel || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px; font-weight: bold;">Passwort:</td>
            <td style="padding: 4px 8px;">${this.password}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">
          Bitte bearbeiten Sie diese Konfiguration zeitnah.
        </p>
        <p>
          Mit freundlichen Grüßen,<br>
          Aaron und Frank
        </p>
      </body>
    </html>
  `;

      const mailresult = await $fetch("./api/mail", {
        method: "POST",
        body: {
          name: "",
          to: "office@secutimetec.de",
          subject: "stt-shop  ---  Neue gespeicherte Konfiguration",
          html: message,
        },
      });
    },

    // Beispiel in <script setup> / Composition API
    async sendmailkunde() {
      /* --------------------------------------------------
       * 1) Logo-URL – besser extern hosten als cid/Anhang,
       *    damit es zuverlässig geladen wird.
       * -------------------------------------------------- */
      const logoUrl = "https://www.stt-shop.de/favicon.ico"; // 64×64 px reicht

      /* --------------------------------------------------
       * 2) Sauberes, in-line gestyltes HTML-Template.
       *    (Tabellenlayout ist leider noch immer das
       *    robusteste für Mail-Clients.)
       * -------------------------------------------------- */
      const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#222;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:24px 0;">
          <img src="${logoUrl}" alt="STT-Shop Logo"
               style="width:64px;height:64px;border-radius:12px;">
        </td>
      </tr>

      <tr><td style="padding:0 24px;">
        <h1 style="font-size:20px;margin:0 0 16px;">Herzlichen&nbsp;Glückwunsch!</h1>
        <p>Ihre neue Schließanlage wurde erfolgreich erstellt und gespeichert.</p>

        <h2 style="font-size:16px;margin:24px 0 8px;">Ihre&nbsp;Zugangsdaten</h2>
        <ul style="padding-left:16px;margin:0 0 24px;">
          <li><strong>Anlagennummer:</strong> ${this.anlageNr}</li>
          <li><strong>Passwort:</strong> ${this.password}</li>
        </ul>

        <p>Rufen Sie Ihre gespeicherte Anlage jederzeit im
           <a href="https://www.stt-shop.de/schliessanlagenkonfigurator/" target="_blank">
             Schließanlagen­konfigurator
           </a> ab und klicken Sie auf <em>Anlage laden</em>.</p>

        <p>Bei Fragen hilft unser Support-Team gerne weiter.</p>

        <p style="margin-top:40px;">
          Mit freundlichen Grüßen<br>
          <strong>Ihr STT-Shop Team</strong><br>
          <em>secutimetec GmbH</em><br>
          Walsroder Str. 24–26<br>
          30900 Wedemark<br>
          Telefon +49 5130 609390
        </p>
      </td></tr>
    </table>
  </div>`;

      /* --------------------------------------------------
       * 3) Mail verschicken – From + Subject anpassen.
       * -------------------------------------------------- */
      await $fetch("/api/mail", {
        method: "POST",
        body: {
          from: "STT-Shop <noreply@stt-shop.de>",   // << Absendername & -Adresse
          to: this.email,
          subject: "Ihre Schließanlagen­konfiguration",
          html,
          /* attachments: [         // (Optional) Logo per CID einbetten
             {
               filename: "logo.ico",
               path: "./public/favicon.ico",
               cid: "sttlogo"
             }
           ] */
        },
      });
    }
  },
};
</script>

<style lang="scss">
@import "/styles/configurator.scss";
</style>
