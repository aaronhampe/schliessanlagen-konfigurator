export default {
  isSchliessanlage: false,
  image: "/images/abus-ec550-doppelzylinder-logo-500x500.png",
  keyPrice: 4.31,
  productID: 28336,
  features: [
    "Bewährte Technik für Standardanwendungen",
    "Inklusive Not- und Gefahrenfunktion",
    "Lieferbar als Knauf- und Doppelzylinder"
  ],
  infoText: `Steigern Sie die Sicherheit Ihrer Haus- und Wohnungstüren mit dem ABUS EC550, der mit einem praktischen Wendeschlüssel geliefert wird.

Ein zuverlässiger Türzylinder muss Ihre Türen jederzeit gegen Manipulationsversuche schützen. Dieser Zylinder ist mit einem SKG**-Anbohrschutz ausgestattet und bietet durch seine acht Schließelemente in zwei unabhängigen Stiftreihen besonders hohen Schutz. Zusätzlich verfügt er über eine Not- und Gefahrenfunktion, die es ermöglicht, die Tür beidseitig zu schließen, selbst wenn ein Schlüssel auf einer Seite steckt.`,

  ////////////////////////////////////////////////////////////////////////
  // DOPPELZYLINDER
  ////////////////////////////////////////////////////////////////////////
  Doppelzylinder: {
    sizes: [
      { outside: 28, inside: 34, price: 19.80 },
      { outside: 28, inside: 39, price: 24.20 },

      { outside: 30, inside: 30, price: 19.79 },
      { outside: 30, inside: 35, price: 22.00 },
      { outside: 30, inside: 40, price: 24.20 },
      { outside: 30, inside: 45, price: 27.51 },
      { outside: 30, inside: 50, price: 29.72 },
      { outside: 30, inside: 55, price: 31.92 },
      { outside: 30, inside: 60, price: 35.22 },
      { outside: 30, inside: 65, price: 37.43 },
      { outside: 30, inside: 70, price: 39.64 },
      { outside: 30, inside: 80, price: 44.05 },
      { outside: 30, inside: 90, price: 49.56 },
      { outside: 30, inside: 100, price: 53.97 },
      { outside: 30, inside: 110, price: 59.48 },
      { outside: 30, inside: 120, price: 63.89 },

      { outside: 35, inside: 35, price: 24.20 },
      { outside: 35, inside: 40, price: 27.51 },
      { outside: 35, inside: 45, price: 29.72 },
      { outside: 35, inside: 50, price: 31.92 },
      { outside: 35, inside: 55, price: 35.23 },
      { outside: 35, inside: 60, price: 37.43 },
      { outside: 35, inside: 65, price: 39.64 },
      { outside: 35, inside: 70, price: 44.05 },

      { outside: 40, inside: 40, price: 28.30 },
      { outside: 40, inside: 45, price: 31.92 },
      { outside: 40, inside: 50, price: 35.23 },
      { outside: 40, inside: 55, price: 37.43 },
      { outside: 40, inside: 60, price: 39.64 },
      { outside: 40, inside: 65, price: 44.05 },
      { outside: 40, inside: 70, price: 44.05 },

      { outside: 45, inside: 45, price: 35.23 },
      { outside: 45, inside: 50, price: 37.43 },
      { outside: 45, inside: 55, price: 39.64 },
      { outside: 45, inside: 60, price: 44.04 },
      { outside: 45, inside: 65, price: 49.56 },
      { outside: 45, inside: 70, price: 49.56 },

      { outside: 50, inside: 50, price: 39.64 },
      { outside: 50, inside: 55, price: 44.04 },
      { outside: 50, inside: 60, price: 44.04 },
      { outside: 50, inside: 65, price: 49.56 },

      { outside: 55, inside: 55, price: 49.56 },
      { outside: 55, inside: 60, price: 49.56 },
      { outside: 55, inside: 65, price: 55.07 },

      { outside: 60, inside: 60, price: 49.56 },
    ],
    options: ["Not- & Gefahrenfunktion"],
  },

  ////////////////////////////////////////////////////////////////////////
  // KNAUFZYLINDER (innen)
  ////////////////////////////////////////////////////////////////////////
  Knaufzylinder: {
    sizes: [

      { outside: 28, inside: 34, price: 30.40 },

      { outside: 30, inside: 30, price: 30.40 },
      { outside: 30, inside: 35, price: 32.50 },
      { outside: 30, inside: 40, price: 35.65 },
      { outside: 30, inside: 45, price: 38.80 },
      { outside: 30, inside: 50, price: 40.90 },
      { outside: 30, inside: 55, price: 41.94 },
      { outside: 30, inside: 60, price: 44.05 },
      { outside: 30, inside: 65, price: 47.20 },
      { outside: 30, inside: 70, price: 49.30 },
      { outside: 30, inside: 80, price: 53.50 },
      { outside: 30, inside: 85, price: 58.75 },
      { outside: 30, inside: 90, price: 49.56 },

      { outside: 35, inside: 30, price: 32.50 },
      { outside: 35, inside: 35, price: 35.65 },
      { outside: 35, inside: 40, price: 37.95 },
      { outside: 35, inside: 45, price: 40.95 },
      { outside: 35, inside: 50, price: 41.95 },
      { outside: 35, inside: 55, price: 42.95 },
      { outside: 35, inside: 60, price: 47.20 },
      { outside: 35, inside: 65, price: 49.30 },
      { outside: 35, inside: 70, price: 53.50 },

      { outside: 40, inside: 30, price: 34.60 },
      { outside: 40, inside: 35, price: 36.34 },
      { outside: 40, inside: 40, price: 39.85 },
      { outside: 40, inside: 45, price: 43.00 },
      { outside: 40, inside: 50, price: 46.15 },
      { outside: 40, inside: 55, price: 47.20 },
      { outside: 40, inside: 60, price: 49.30 },
      { outside: 40, inside: 65, price: 53.50 },
      { outside: 40, inside: 70, price: 53.50 },

      { outside: 45, inside: 30, price: 37.75 },
      { outside: 45, inside: 35, price: 39.45 },
      { outside: 45, inside: 40, price: 34.60 },
      { outside: 45, inside: 45, price: 34.60 },
      { outside: 45, inside: 50, price: 34.60 },
      { outside: 45, inside: 55, price: 34.60 },
      { outside: 45, inside: 60, price: 34.60 },
      { outside: 45, inside: 65, price: 34.60 },
      { outside: 45, inside: 70, price: 34.60 },

      { outside: 50, inside: 30, price: 39.85 },
      { outside: 50, inside: 40, price: 45.10 },
      { outside: 50, inside: 45, price: 48.25 },
      { outside: 50, inside: 50, price: 48.25 },
      { outside: 50, inside: 55, price: 53.50 },
      { outside: 50, inside: 60, price: 53.50 },
      { outside: 50, inside: 65, price: 58.75 },

      { outside: 55, inside: 30, price: 41.94 },
      { outside: 55, inside: 35, price: 45.10 },
      { outside: 55, inside: 40, price: 48.24 },
      { outside: 55, inside: 50, price: 55.60 },
      { outside: 55, inside: 55, price: 58.75 },
      { outside: 55, inside: 60, price: 58.75 },

      { outside: 60, inside: 30, price: 44.05 },
      { outside: 60, inside: 35, price: 47.20 },
      { outside: 60, inside: 40, price: 50.35 },
      { outside: 60, inside: 45, price: 55.60 },
      { outside: 60, inside: 50, price: 55.60 },
      { outside: 60, inside: 55, price: 58.75 },
      { outside: 60, inside: 60, price: 58.75 },

      { outside: 65, inside: 30, price: 47.20 },
      { outside: 65, inside: 35, price: 49.30 },
      { outside: 65, inside: 40, price: 54.55 },
      { outside: 65, inside: 45, price: 59.80 },
      { outside: 65, inside: 50, price: 59.80 },

      { outside: 70, inside: 30, price: 49.30 },
      { outside: 70, inside: 35, price: 53.50 },
      { outside: 70, inside: 40, price: 54.55 },
      { outside: 70, inside: 45, price: 59.80 },
    ],
    options: [],
  },

  ////////////////////////////////////////////////////////////////////////
  // HALBZYLINDER
  ////////////////////////////////////////////////////////////////////////
  Halbzylinder: {
    sizes: [
      { outside: 10, inside: 30, price: 14.65 },
      { outside: 10, inside: 35, price: 17.80 },
      { outside: 10, inside: 40, price: 19.90 },
      { outside: 10, inside: 45, price: 22.00 },
      { outside: 10, inside: 50, price: 24.10 },
      { outside: 10, inside: 60, price: 29.35 },
      { outside: 10, inside: 70, price: 33.55 },
    ],
    options: [],
  },

  Vorhangschloss: {
    types: {
      "Vorhangschloss 50mm": {
        options: []
      },
      "Vorhangschloss 50mm": {
        options: []
      },
    },
  },

  availableTypes: [
    "Doppelzylinder",
    "Knaufzylinder (innen)",
    "Halbzylinder",
  ],
}
