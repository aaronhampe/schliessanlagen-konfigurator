import IsSchliessanlage from "~/pages/isSchliessanlage.vue";

export default {
    "Kein bestimmtes Modell": {
      Doppelzylinder: {
        sizes: [
          { inside: 30, outside: 35 },
          { inside: 35, outside: 40 },
          { inside: 40, outside: 45 },
        ],
        options: ["Nickel", "Bronze", "Brass", "Standard", "High Security"],
      },
      Knaufzylinder: {
        sizes: [
          { inside: 30, outside: 35 },
          { inside: 35, outside: 40 },
        ],
        options: ["Round", "Oval", "Nickel", "Bronze"],
      },
      Halbzylinder: {
        sizes: [
          { inside: 30, outside: 10 },
          { inside: 35, outside: 10 },
        ],
        options: ["Nickel", "Bronze", "Standard", "Security"],
      },
      Vorhangschloss: {
        types: {
          "50mm": { options: ["Standard", "Long"] },
          "80mm": { options: ["Standard", "Long", "Extra Long"] },
        },
      },
      Briefkastenschloss: {
        options: ["Surface", "Mortise", "Nickel", "Bronze"],
      },
      availableTypes: [
        "Doppelzylinder",
        "Knaufzylinder (innen)",
        "Halbzylinder",
        "Vorhangschloss 50mm",
        "Vorhangschloss 80mm",
        "Briefkastenschloss",
      ],
    },
    "ABUS EC550": {
      Doppelzylinder: {
        sizes: [
          { inside: 30, outside: 30 },
          { inside: 30, outside: 35 },
          { inside: 30, outside: 40 },
          { inside: 30, outside: 45 },
          { inside: 30, outside: 50 },
          { inside: 35, outside: 35 },
          { inside: 35, outside: 40 },
          { inside: 35, outside: 45 },
          { inside: 40, outside: 40 },
          { inside: 40, outside: 45 },
          { inside: 45, outside: 45 },
          { inside: 35, outside: 40 },
          { inside: 40, outside: 45 },
          { inside: 50, outside: 30 },
        ],
        options: {
          Material: ["Nickel", "Bronze", "Brass"],
          Sicherheit: ["Standard", "High Security", "Not- & Gefahrenfunktion"],
          Finish: ["Matt", "Poliert"],
        },
      },
      Knaufzylinder: {
        sizes: [
          { inside: 30, outside: 35 },
          { inside: 35, outside: 40 },
        ],
        options: ["Round", "Oval", "Nickel", "Bronze", "Not- & Gefahrenfunktion"],
      },
      Halbzylinder: {
        sizes: [
          { inside: 30, outside: 0 },
          { inside: 35, outside: 0 },
        ],
        options: ["Nickel", "Bronze", "Standard", "Security"],
      },
      Vorhangschloss: {
        types: {
          "50mm": { options: ["Standard", "Long"] },
          "80mm": { options: ["Standard", "Long", "Extra Long"] },
        },
      },
      Briefkastenschloss: {
        options: ["Surface", "Mortise", "Nickel", "Bronze"],
      },
      availableTypes: [
        "Doppelzylinder",
        "Knaufzylinder (innen)",
        "Halbzylinder",
        "Vorhangschloss 50mm",
        "Vorhangschloss 80mm",
        "Briefkastenschloss",
      ],
    },
    "ABUS EC660": {
      Doppelzylinder: {
        sizes: [
          { inside: 30, outside: 30 },
          { inside: 30, outside: 35 },
          { inside: 30, outside: 40 },
          { inside: 30, outside: 45 },
          { inside: 30, outside: 50 },
          
          { inside: 35, outside: 35 },
          { inside: 35, outside: 40 },
          { inside: 35, outside: 45 },
          { inside: 40, outside: 40 },
          { inside: 40, outside: 45 },
          { inside: 45, outside: 45 },
          { inside: 35, outside: 40 },
          { inside: 40, outside: 45 },
        ],
        options: ["Nickel", "Bronze", "Brass", "Standard", "High Security"],
      },
      Knaufzylinder: {
        sizes: [
          { inside: 30, outside: 35 },
          { inside: 35, outside: 40 },
        ],
        options: ["Round", "Oval", "Nickel", "Bronze"],
      },
      Halbzylinder: {
        sizes: [
          { inside: 30, outside: 0 },
          { inside: 35, outside: 0 },
        ],
        options: ["Nickel", "Bronze", "Standard", "Security"],
      },
      Vorhangschloss: {
        types: {
          "50mm": { options: ["Standard", "Long"] },
          "80mm": { options: ["Standard", "Long", "Extra Long"] },
        },
      },
      Briefkastenschloss: {
        options: ["Surface", "Mortise", "Nickel", "Bronze"],
      },
      availableTypes: [
        "Doppelzylinder",
        "Knaufzylinder (innen)",
        "Halbzylinder",
        "Vorhangschloss 50mm",
        "Vorhangschloss 80mm",
        "Briefkastenschloss",
      ],
    },
  };
  