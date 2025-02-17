export default {
  isSchliessanlage: false,
  image: "/images/abus-ti14-doppelzylinder-logo-500x500.png",
  keyPrice: 2.31,
  productID: 28487,
  features: [
    "Entspricht DIN EN 1303, ISO 9001:2015",
    "Inklusive Not- und Gefahrenfunktion",
    "Zylinderkörper aus TITALIUM Spezialaluminium",
  ],
  infoText: `Der ABUS TI14 Profilzylinder bietet einen preiswerten Einstieg in die Welt von ABUS, ohne dabei auf Komfort zu verzichten. Für die Nachbestellung von Schlüsseln und Zylindern bei uns erhalten Sie einen Codeschlüssel mit einer individuellen Code-Nummer, die es Ihnen ermöglicht, weitere Schlüssel und Zylinder ganz unkompliziert bei uns nachzubestellen. Schlüsseldienste können nach Muster in der Regel Schlüssel anfertigen.`,

  Doppelzylinder: {
    sizes: [
      { outside: 28, inside: 34, price: 13.63 },
      ////////////////////////////////////////////
      { outside: 30, inside: 30, price: 13.63 },
      { outside: 30, inside: 35, price: 14.68 },
      { outside: 30, inside: 40, price: 16.78 },
      { outside: 30, inside: 45, price: 17.84 },
      { outside: 30, inside: 50, price: 18.89 },
      { outside: 30, inside: 55, price: 19.94 },
      { outside: 30, inside: 60, price: 21.00 },

      { outside: 35, inside: 35, price: 16.78 },
      { outside: 35, inside: 40, price: 17.84 },
      { outside: 35, inside: 45, price: 18.89 },
      { outside: 35, inside: 50, price: 19.94 },
      { outside: 35, inside: 55, price: 21.00 },
      { outside: 35, inside: 60, price: 23.10 },

      { outside: 40, inside: 40, price: 18.89 },
      { outside: 40, inside: 45, price: 19.94 },
      { outside: 40, inside: 50, price: 21.00 },
      { outside: 40, inside: 55, price: 23.10 },
      { outside: 40, inside: 60, price: 24.15 },

      { outside: 45, inside: 45, price: 21.00 },
      { outside: 45, inside: 50, price: 23.05 },
      { outside: 45, inside: 55, price: 24.10 },
      { outside: 45, inside: 60, price: 25.15 },
    ],
  },

  Halbzylinder: {
    sizes: [
      { outside: 10, inside: 30, price: 12.57 },
    ],
  },

  availableTypes: [
    "Doppelzylinder",
    "Halbzylinder",
  ],
}
