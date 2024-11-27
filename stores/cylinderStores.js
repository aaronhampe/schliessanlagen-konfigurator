// stores/cylinderStore.js
import { defineStore } from 'pinia'
import cylinderModels from '../data/cylinderModels.js'

export const useCylinderStore = defineStore('cylinderStore', {
    state: () => ({
        selectedModel: 'Kein bestimmtes Modell',
        selectedType: '',
        selectedInsideSize: null,
        selectedOutsideSize: null,
        options: {},
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
                const typeKey = state.selectedType.replace(/\s*\(.*?\)/g, '') // Entfernt optionale Klammern in Typnamen
                const sizes = cylinderModels[state.selectedModel][typeKey]?.sizes || []
                return sizes
            }
            return []
        },
        availableInsideSizes(state) {
            const sizes = this.allSizes
            if (state.selectedOutsideSize !== null) {
                // Filtere Innenmaße basierend auf der ausgewählten Außengröße
                return [...new Set(sizes.filter(size => size.outside === state.selectedOutsideSize).map(size => size.inside))]
            } else {
                // Alle verfügbaren Innenmaße
                return [...new Set(sizes.map(size => size.inside))]
            }
        },
        availableOutsideSizes(state) {
            const sizes = this.allSizes
            if (state.selectedInsideSize !== null) {
                // Filtere Außenmaße basierend auf der ausgewählten Innengröße
                return [...new Set(sizes.filter(size => size.inside === state.selectedInsideSize).map(size => size.outside))]
            } else {
                // Alle verfügbaren Außenmaße
                return [...new Set(sizes.map(size => size.outside))]
            }
        },
        availableOptions(state) {
            if (state.selectedModel && state.selectedType) {
                const typeKey = state.selectedType.replace(/\s*\(.*?\)/g, '')
                return cylinderModels[state.selectedModel][typeKey]?.options || {}
            }
            return {}
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
            // Wenn die aktuelle Außengröße nicht kompatibel ist, zurücksetzen
            if (!this.isSizeCombinationValid(this.selectedInsideSize, this.selectedOutsideSize)) {
                this.selectedOutsideSize = null
            }
        },
        setOutsideSize(size) {
            this.selectedOutsideSize = size
            // Wenn die aktuelle Innengröße nicht kompatibel ist, zurücksetzen
            if (!this.isSizeCombinationValid(this.selectedInsideSize, this.selectedOutsideSize)) {
                this.selectedInsideSize = null
            }
        },
        setOption(category, value) {
            this.options[category] = value
        },
        isSizeCombinationValid(inside, outside) {
            const sizes = this.allSizes
            return sizes.some(size => size.inside === inside && size.outside === outside)
        },
        getSizesForType(type) {
            if (this.selectedModel && type) {
                const sizes = cylinderModels[this.selectedModel][type]?.sizes || [];
                return sizes;
            }
            return [];
        },
        getOptionsForType(type) {
            if (this.selectedModel && type) {
              const typeKey = type.replace(/\s*\(.*?\)/g, '');
              const modelData = cylinderModels[this.selectedModel];
              if (modelData && modelData[typeKey] && modelData[typeKey].options) {
                return modelData[typeKey].options;
              }
            }
            return {};
          },
          
    }
})
