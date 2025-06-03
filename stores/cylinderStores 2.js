// stores/cylinderStore.js
import { defineStore } from 'pinia'
import cylinderModels from '../data/cylinderModels.js'

export const useCylinderStore = defineStore('cylinderStore', {
  state: () => ({
    selectedModel: 'Kein bestimmtes Modell',
    selectedType: '',
    selectedInsideSize: null,
    selectedOutsideSize: null,
    options: {}
  }),

  getters: {
    availableModels(state) {
      return Object.keys(cylinderModels)
    },

    availableTypes(state) {
      if (state.selectedModel) {
        return cylinderModels[state.selectedModel].availableTypes || []
      }
      return []
    },

    allSizes(state) {
      if (state.selectedModel && state.selectedType) {
        const typeKey = state.selectedType.replace(/\s*\(.*?\)/g, '')
        return cylinderModels[state.selectedModel][typeKey]?.sizes || []
      }
      return []
    },

    availableInsideSizes(state) {
      const sizes = this.allSizes
      if (state.selectedOutsideSize != null) {
        return [...new Set(sizes
          .filter(size => size.outside === state.selectedOutsideSize)
          .map(size => size.inside)
        )]
      } else {
        return [...new Set(sizes.map(size => size.inside))]
      }
    },

    availableOutsideSizes(state) {
      const sizes = this.allSizes
      if (state.selectedInsideSize != null) {
        return [...new Set(sizes
          .filter(size => size.inside === state.selectedInsideSize)
          .map(size => size.outside)
        )]
      } else {
        return [...new Set(sizes.map(size => size.outside))]
      }
    },

    // Wenn du *nur* ein Array an Optionen zurückliefern willst:
    availableOptions(state) {
      // Nur noch "top-level" Zylindertyp => Array
      if (state.selectedModel && state.selectedType) {
        const typeKey = state.selectedType.replace(/\s*\(.*?\)/g, '')
        const modelData = cylinderModels[state.selectedModel]

        // Sonderfall: Vorhangschloss 50mm / 80mm?
        // => Dann "typeKey" aus dem Namen extrahieren
        if (typeKey.toLowerCase().startsWith('vorhangschloss')) {
          // z.B. "Vorhangschloss 50mm"
          const parts = typeKey.split(' ')
          const dimension = parts[1] // "50mm" oder "80mm"
          if (modelData.Vorhangschloss 
              && modelData.Vorhangschloss.types 
              && modelData.Vorhangschloss.types[dimension] 
              && Array.isArray(modelData.Vorhangschloss.types[dimension].options)
          ) {
            return modelData.Vorhangschloss.types[dimension].options
          } else {
            return []
          }
        }

        // Normalfall: Doppelzylinder / Knaufzylinder / Halbzylinder
        return modelData[typeKey]?.options || []
      }
      return []
    },

    isSchliessanlage(state) {
      if (!state.selectedModel) return false
      const modelData = cylinderModels[state.selectedModel]
      return modelData && modelData.isSchliessanlage === true
    }
  },

  actions: {
    setModel(model) {
      this.selectedModel = model
      this.selectedType = ''
      this.selectedInsideSize = null
      this.selectedOutsideSize = null
      this.options = {}
    },

    setType(type) {
      this.selectedType = type
      this.selectedInsideSize = null
      this.selectedOutsideSize = null
      this.options = {}
    },

    setInsideSize(size) {
      this.selectedInsideSize = size
      if (!this.isSizeCombinationValid(this.selectedInsideSize, this.selectedOutsideSize)) {
        this.selectedOutsideSize = null
      }
    },

    setOutsideSize(size) {
      this.selectedOutsideSize = size
      if (!this.isSizeCombinationValid(this.selectedInsideSize, this.selectedOutsideSize)) {
        this.selectedInsideSize = null
      }
    },

    setOption(option) {
      // Falls du *mehrere* Optionen auswählen möchtest,
      // brauchst du ggf. ein Array, z.B. this.options = []
      // und pushst bei Bedarf. Je nach UX...
      // Hier nur Demo: wir setzen "option" als EINEN Wert.
      this.options = { chosen: option }
    },

    isSizeCombinationValid(inside, outside) {
      const sizes = this.allSizes
      return sizes.some(size => size.inside === inside && size.outside === outside)
    },

    getSizesForType(type) {
      const typeKey = type.replace(/\s*\(.*?\)/g, '')
      if (this.selectedModel && typeKey) {
        return cylinderModels[this.selectedModel][typeKey]?.sizes || []
      }
      return []
    },

    // Falls du manuell irgendwo anders noch brauchst:
    getOptionsForType(type) {
      // Gleiche Logik wie in "availableOptions", 
      // aber als Methode für den Konfigurator
      if (!type) return []
      const typeKey = type.replace(/\s*\(.*?\)/g, '')
      const modelData = cylinderModels[this.selectedModel]
      if (!modelData) return []

      // Vorhangschloss?
      if (typeKey.toLowerCase().startsWith('vorhangschloss')) {
        const parts = typeKey.split(' ')
        const dimension = parts[1] // "50mm" oder "80mm"
        return modelData.Vorhangschloss?.types?.[dimension]?.options || []
      } else {
        return modelData[typeKey]?.options || []
      }
    }
  }
})
