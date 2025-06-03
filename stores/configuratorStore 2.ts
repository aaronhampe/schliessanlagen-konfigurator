import { defineStore } from 'pinia';
import systemModel from '../data/cylinder.js';

export const useKonfiguratorStore = defineStore('konfigurator', {
  state: () => ({
    currentModel: 'Kein bestimmtes Modell' as keyof typeof systemModel,
    sizesDouble: systemModel['Kein bestimmtes Modell'].sizesDouble || [],
    sizesKnob: systemModel['Kein bestimmtes Modell'].sizesKnob || [],
    sizesHalf: systemModel['Kein bestimmtes Modell'].sizesHalf || [],
    options: systemModel['Kein bestimmtes Modell'].options || [],
    cylinderType: systemModel['Kein bestimmtes Modell'].cylinderType || [],
    isSchliessanlage: systemModel['Kein bestimmtes Modell'].isSchliessanlage
  }),
  actions: {
    setModel(model: keyof typeof systemModel) {
      this.currentModel = model;
      const modelData = systemModel[this.currentModel];

      this.sizesDouble = modelData.sizesDouble || [];
      this.sizesKnob = modelData.sizesKnob || [];
      this.sizesHalf = modelData.sizesHalf || [];
      this.options = modelData.options || [];
      this.cylinderType = modelData.cylinderType || [];
      this.isSchliessanlage = modelData.isSchliessanlage ?? true;
    },
  },
});
