export default {
  isSchliessanlage: false,
  image: "./images/abus-ec660-doppelzylinder-logo-500x500.png",
  brand: "ABUS",
  keyPrice: 5.09,
  productID: 28344,
  useCase: "privat",
  securityLevel: 6,
  features: [
    "Mit Sicherungskarte und Anbohrschutz",
    "Inklusive Not- und Gefahrenfunktion",
    "Zertifiziert nach DIN EN 1303 und DIN EN 18252"
  ],
  infoText: `Nur gegen Vorlage der Sicherungskarte fertigen ABUS und lizenzierte Partner Original-Schlüssel, Schlösser und Türzylinder für Sie an.

  Im Innern des EC660 sorgen gehärtete Stahlstifte nach SKG**-Vorgaben dafür, dass dieser Türzylinder durch einen Aufbruchversuch nicht oder nur sehr schwer manipuliert werden kann.`,

  deliveryTime: "2-3 Werktage",

  ////////////////////////////////////////////////////////////////////////
  // DOPPELZYLINDER
  ////////////////////////////////////////////////////////////////////////
  Doppelzylinder: {
    sizes: [
      { outside: 28, inside: 34, price: 30.4 },
      { outside: 28, inside: 39, price: 36.7 },

      { outside: 30, inside: 30, price: 30.4 },
      { outside: 30, inside: 35, price: 33.55 },
      { outside: 30, inside: 40, price: 36.7 },
      { outside: 30, inside: 45, price: 39.85 },
      { outside: 30, inside: 50, price: 41.95 },
      { outside: 30, inside: 55, price: 45.1 },
      { outside: 30, inside: 60, price: 48.25 },
      { outside: 30, inside: 65, price: 50.35 },
      { outside: 30, inside: 70, price: 53.5 },
      { outside: 30, inside: 80, price: 64.0 },
      { outside: 30, inside: 90, price: 71.35 },
      { outside: 30, inside: 100, price: 77.65 },
      { outside: 30, inside: 110, price: 85.0 },
      { outside: 30, inside: 120, price: 91.3 },

      { outside: 35, inside: 30, price: 33.55 },
      { outside: 35, inside: 35, price: 36.7 },
      { outside: 35, inside: 40, price: 39.85 },
      { outside: 35, inside: 45, price: 41.95 },
      { outside: 35, inside: 50, price: 45.1 },
      { outside: 35, inside: 55, price: 48.25 },
      { outside: 35, inside: 60, price: 50.35 },
      { outside: 35, inside: 65, price: 53.5 },
      { outside: 35, inside: 70, price: 64.0 },

      { outside: 40, inside: 30, price: 36.7 },
      { outside: 40, inside: 35, price: 39.85 },
      { outside: 40, inside: 40, price: 41.95 },
      { outside: 40, inside: 45, price: 47.95 },
      { outside: 40, inside: 50, price: 48.25 },
      { outside: 40, inside: 55, price: 50.35 },
      { outside: 40, inside: 60, price: 53.5 },
      { outside: 40, inside: 65, price: 64.0 },
      { outside: 40, inside: 70, price: 64.0 },

      { outside: 45, inside: 30, price: 39.85 },
      { outside: 45, inside: 35, price: 41.95 },
      { outside: 45, inside: 40, price: 47.95 },
      { outside: 45, inside: 45, price: 48.25 },
      { outside: 45, inside: 50, price: 50.35 },
      { outside: 45, inside: 55, price: 53.5 },
      { outside: 45, inside: 60, price: 64.0 },
      { outside: 45, inside: 65, price: 71.35 },
      { outside: 45, inside: 70, price: 71.35 },

      { outside: 50, inside: 30, price: 41.95 },
      { outside: 50, inside: 35, price: 47.95 },
      { outside: 50, inside: 40, price: 48.25 },
      { outside: 50, inside: 45, price: 50.35 },
      { outside: 50, inside: 50, price: 53.5 },
      { outside: 50, inside: 55, price: 63.95 },
      { outside: 50, inside: 60, price: 64.0 },
      { outside: 50, inside: 65, price: 71.35 },
      { outside: 50, inside: 70, price: 71.35 },

      { outside: 55, inside: 30, price: 47.95 },
      { outside: 55, inside: 35, price: 48.25 },
      { outside: 55, inside: 40, price: 50.35 },
      { outside: 55, inside: 45, price: 53.5 },
      { outside: 55, inside: 50, price: 63.95 },
      { outside: 55, inside: 55, price: 64.0 },
      { outside: 55, inside: 60, price: 71.35 },
      { outside: 55, inside: 65, price: 77.65 },
    ],
    options: ["Not- & Gefahrenfunktion"],
  },

  ////////////////////////////////////////////////////////////////////////
  // KNAUFZYLINDER (innen)
  ////////////////////////////////////////////////////////////////////////
  Knaufzylinder: {
    sizes: [

      { outside: 28, inside: 34, price: 43.0 },

      { outside: 30, inside: 30, price: 43.0 },
      { outside: 30, inside: 35, price: 46.15 },
      { outside: 30, inside: 40, price: 49.3 },
      { outside: 30, inside: 45, price: 52.45 },
      { outside: 30, inside: 50, price: 55.6 },
      { outside: 30, inside: 55, price: 56.65 },
      { outside: 30, inside: 60, price: 59.8 },
      { outside: 30, inside: 65, price: 62.95 },
      { outside: 30, inside: 70, price: 65.05 },
      { outside: 30, inside: 80, price: 76.6 },
      { outside: 30, inside: 90, price: 82.9 },

      { outside: 35, inside: 30, price: 45.1 },
      { outside: 35, inside: 35, price: 48.25 },
      { outside: 35, inside: 40, price: 52.45 },
      { outside: 35, inside: 45, price: 55.6 },
      { outside: 35, inside: 50, price: 58.74 },
      { outside: 35, inside: 55, price: 59.8 },
      { outside: 35, inside: 60, price: 62.95 },
      { outside: 35, inside: 65, price: 66.1 },
      { outside: 35, inside: 70, price: 76.6 },

      { outside: 40, inside: 30, price: 48.25 },
      { outside: 40, inside: 35, price: 51.4 },
      { outside: 40, inside: 40, price: 54.55 },
      { outside: 40, inside: 45, price: 58.75 },
      { outside: 40, inside: 50, price: 61.9 },
      { outside: 40, inside: 55, price: 62.95 },
      { outside: 40, inside: 60, price: 65.05 },
      { outside: 40, inside: 65, price: 76.6 },
      { outside: 40, inside: 70, price: 76.6 },

      { outside: 45, inside: 30, price: 51.4 },
      { outside: 45, inside: 35, price: 54.55 },
      { outside: 45, inside: 40, price: 57.7 },
      { outside: 45, inside: 45, price: 60.85 },
      { outside: 45, inside: 50, price: 64.0 },
      { outside: 45, inside: 55, price: 65.05 },
      { outside: 45, inside: 60, price: 76.6 },
      { outside: 45, inside: 65, price: 82.9 },
      { outside: 45, inside: 70, price: 82.9 },

      { outside: 50, inside: 30, price: 54.55 },
      { outside: 50, inside: 35, price: 57.7 },
      { outside: 50, inside: 40, price: 60.85 },
      { outside: 50, inside: 45, price: 64.0 },
      { outside: 50, inside: 50, price: 67.15 },
      { outside: 50, inside: 55, price: 76.6 },
      { outside: 50, inside: 60, price: 76.6 },
      { outside: 50, inside: 65, price: 82.9 },
      { outside: 50, inside: 70, price: 82.9 },

      { outside: 55, inside: 30, price: 57.7 },
      { outside: 55, inside: 35, price: 59.8 },
      { outside: 55, inside: 40, price: 62.95 },
      { outside: 55, inside: 45, price: 67.15 },
      { outside: 55, inside: 50, price: 77.65 },
      { outside: 55, inside: 55, price: 82.9 },
      { outside: 55, inside: 60, price: 82.9 },
      { outside: 55, inside: 65, price: 89.2 },

      { outside: 60, inside: 30, price: 59.8 },
      { outside: 60, inside: 35, price: 62.95 },
      { outside: 60, inside: 40, price: 65.63 },
      { outside: 60, inside: 45, price: 77.65 },
      { outside: 60, inside: 50, price: 77.65 },
      { outside: 60, inside: 55, price: 83.0 },

      { outside: 65, inside: 30, price: 62.95 },
      { outside: 65, inside: 35, price: 62.95 },
      { outside: 65, inside: 40, price: 76.6 },
      { outside: 65, inside: 45, price: 76.6 },
      { outside: 65, inside: 50, price: 85.0 },

      { outside: 70, inside: 30, price: 65.05 },
      { outside: 70, inside: 35, price: 76.6 },
      { outside: 70, inside: 40, price: 82.90 },
      { outside: 70, inside: 45, price: 83.95 },
      { outside: 70, inside: 50, price: 83.95 },

      { outside: 80, inside: 30, price: 76.6 },

      { outside: 90, inside: 30, price: 82.90 },
    ],
    options: [],
  },


  ////////////////////////////////////////////////////////////////////////
  // HALBZYLINDER
  ////////////////////////////////////////////////////////////////////////
  Halbzylinder: {
    sizes: [
      { outside: 30, inside: 10, price: 24.1 },
      { outside: 35, inside: 10, price: 31.45 },
      { outside: 40, inside: 10, price: 30.4 },
      { outside: 45, inside: 10, price: 33.55 },
      { outside: 50, inside: 10, price: 35.65 },
      { outside: 60, inside: 10, price: 41.95 },
      { outside: 70, inside: 10, price: 47.2 },
    ],
    options: [],
  },

  availableTypes: [
    "Doppelzylinder",
    "Knaufzylinder (innen)",
    "Halbzylinder",
  ],
}
