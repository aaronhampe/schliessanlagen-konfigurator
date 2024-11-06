import { defineStore } from 'pinia';
import systemModel from '../data/cylinder.js';

export const useKonfiguratorStore = defineStore('konfigurator', {
    state: () => ({
      currentModel: 'Kein bestimmtes Modell' as keyof typeof systemModel, // Standardmodell gesetzt
      sizes: systemModel['Kein bestimmtes Modell'].sizes,  // Standardgrößen für das Startmodell
      options: systemModel['Kein bestimmtes Modell'].options,  // Standardoptionen für das Startmodell
    }),
    actions: {
      setModel(model: keyof typeof systemModel) {
        this.currentModel = model;
        const modelData = systemModel[this.currentModel];
        this.sizes = modelData.sizes;
        this.options = modelData.options;
      }
    }
  });
  