import { defineStore } from 'pinia';
import systemModel from '../data/cylinder.js';

export const useKonfiguratorStore = defineStore('konfigurator', {
  state: () => ({
    currentModel: "Kein bestimmtes Modell" as keyof typeof systemModel,
    sizes: systemModel["Kein bestimmtes Modell"].sizes,
    options: systemModel["Kein bestimmtes Modell"].options,
    cylinderType: systemModel["Kein bestimmtes Modell"].cylinderType,
    isSchliessanlage: systemModel["Kein bestimmtes Modell"].isSchliessanlage,
  }),
  actions: {
    setModel(model: keyof typeof systemModel) {
      this.currentModel = model;
      const modelData = systemModel[this.currentModel];

      this.sizes = modelData.sizes;
      this.options = modelData.options;
      this.cylinderType = modelData.cylinderType || [];
      this.isSchliessanlage = systemModel[model]?.isSchliessanlage ?? true;
    },
  },
});
