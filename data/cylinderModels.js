export default {
  "Kein bestimmtes Modell": {
    Doppelzylinder: {
      sizes: [
        { inside: 30, outside: 35 },
        { inside: 35, outside: 40 },
        { inside: 40, outside: 45 },
      ],
      options: {
        Material: ["Standard","Nickel", "Bronze", "Brass"],
        Sicherheit: ["Standard", "High Security"],
        Finish: ["Standard","Matt", "Poliert"],
      },
    },
    Knaufzylinder: {
      sizes: [
        { inside: 30, outside: 35 },
        { inside: 35, outside: 40 },
      ],
      options: {
        Form: ["Round", "Oval"],
        Material: ["Nickel", "Bronze"],
        Besonderheit: ["Not- & Gefahrenfunktion"],
      },
    },
    Halbzylinder: {
      sizes: [
        { inside: 30, outside: 10 },
        { inside: 35, outside: 10 },
      ],
      options: {
        Material: ["Nickel", "Bronze"],
        Sicherheit: ["Standard", "Security"],
      },
    },
    Vorhangschloss: {
      types: {
        "50mm": {
          options: {
            Länge: ["Standard", "Long"],
          },
        },
        "80mm": {
          options: {
            Länge: ["Standard", "Long", "Extra Long"],
          },
        },
      },
    },
    Briefkastenschloss: {
      options: {
        Art: ["Surface", "Mortise"],
        Material: ["Nickel", "Bronze"],
      },
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
      options: {
        Form: ["Round", "Oval"],
        Material: ["Nickel", "Bronze"],
        Besonderheit: ["Not- & Gefahrenfunktion"],
      },
    },
    Halbzylinder: {
      sizes: [
        { inside: 30, outside: 0 },
        { inside: 35, outside: 0 },
      ],
      options: {
        Material: ["Nickel", "Bronze"],
        Sicherheit: ["Standard", "Security"],
      },
    },
    Vorhangschloss: {
      types: {
        "50mm": {
          options: {
            Länge: ["Standard", "Long"],
          },
        },
        "80mm": {
          options: {
            Länge: ["Standard", "Long", "Extra Long"],
          },
        },
      },
    },
    Briefkastenschloss: {
      options: {
        Art: ["Surface", "Mortise"],
        Material: ["Nickel", "Bronze"],
      },
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
      ],
      options: {
        Material: ["Nickel", "Bronze", "Brass"],
        Sicherheit: ["Standard", "High Security"],
      },
    },
    Knaufzylinder: {
      sizes: [
        { inside: 30, outside: 35 },
        { inside: 35, outside: 40 },
      ],
      options: {
        Form: ["Round", "Oval"],
        Material: ["Nickel", "Bronze"],
      },
    },
    Halbzylinder: {
      sizes: [
        { inside: 30, outside: 0 },
        { inside: 35, outside: 0 },
      ],
      options: {
        Material: ["Nickel", "Bronze"],
        Sicherheit: ["Standard", "Security"],
      },
    },
    availableTypes: [
      "Doppelzylinder",
      "Knaufzylinder (innen)",
      "Halbzylinder",
    ],
  },
  "ABUS EC880": {
    Doppelzylinder: {
      sizes: [
        { inside: 50, outside: 30 },
      ],
      options: {
        Material: ["Nickel", "Bronze", "Brass"],
        Sicherheit: ["Standard", "High Security"],
        Finish: ["Matt", "Poliert"],
      },
    },
    Knaufzylinder: {
      sizes: [
        { inside: 30, outside: 35 },
        { inside: 35, outside: 40 },
      ],
      options: {
        Form: ["Round", "Oval"],
        Material: ["Nickel", "Bronze"],
        Besonderheit: ["Not- & Gefahrenfunktion"],
      },
    },
    Halbzylinder: {
      sizes: [
        { inside: 30, outside: 0 },
        { inside: 35, outside: 0 },
      ],
      options: {
        Material: ["Nickel", "Bronze"],
        Sicherheit: ["Standard", "Security"],
      },
    },
    availableTypes: [
      "Doppelzylinder",
      "Knaufzylinder (innen)",
      "Halbzylinder",
    ],
  },
};
