export default {
    isSchliessanlage: false,
    image: "/images/abus-ec550-doppelzylinder-logo-500x500.png",
    Doppelzylinder: {
      sizes: [
        
        { outside: 30, inside: 30 },
        { outside: 35, inside: 30 },
        { outside: 40, inside: 30 },
        { outside: 45, inside: 30 },
        { outside: 50, inside: 30 },
        { outside: 55, inside: 30 },
        { outside: 60, inside: 30 },
        { outside: 65, inside: 30 },
        { outside: 70, inside: 30 },
        { outside: 80, inside: 30 },
        { outside: 90, inside: 30 },
        { outside: 100, inside: 30 },
        { outside: 110, inside: 30 },
        { outside: 120, inside: 30 },
  
        { outside: 35, inside: 35 },
        { outside: 40, inside: 35 },
        { outside: 45, inside: 35 },
        { outside: 50, inside: 35 },
        { outside: 55, inside: 35 },
        { outside: 60, inside: 35 },
        { outside: 65, inside: 35 },
        { outside: 70, inside: 35 },
  
        { outside: 40, inside: 40 },
        { outside: 45, inside: 40 },
        { outside: 50, inside: 40 },
        { outside: 55, inside: 40 },
        { outside: 60, inside: 40 },
        { outside: 65, inside: 40 },
        { outside: 70, inside: 40 },
  
        { outside: 45, inside: 45 },
        { outside: 50, inside: 45 },
        { outside: 55, inside: 45 },
        { outside: 60, inside: 45 },
        { outside: 65, inside: 45 },
        { outside: 70, inside: 45 },
  
        { outside: 50, inside: 50 },
        { outside: 55, inside: 50 },
        { outside: 60, inside: 50 },
        { outside: 65, inside: 50 },
  
        { outside: 55, inside: 55 },
        { outside: 60, inside: 55 },
        { outside: 65, inside: 55 },
  
        { outside: 60, inside: 60 },
      ],
      options: [],
    },
  
    Knaufzylinder: {
      sizes: [

        { outside: 28, inside: 34 },
  
        { outside: 30, inside: 30 },
        { outside: 35, inside: 30 },
        { outside: 40, inside: 30 },
        { outside: 45, inside: 30 },
        { outside: 50, inside: 30 },
        { outside: 55, inside: 30 },
        { outside: 60, inside: 30 },
        { outside: 65, inside: 30 },
        { outside: 70, inside: 30 },
  
        { outside: 30, inside: 35 },
        { outside: 35, inside: 35 },
        { outside: 40, inside: 35 },
        { outside: 45, inside: 35 },
        { outside: 50, inside: 35 },
        { outside: 55, inside: 35 },
        { outside: 60, inside: 35 },
        { outside: 65, inside: 35 },
        { outside: 70, inside: 35 },
  
        { outside: 30, inside: 40 },
        { outside: 35, inside: 40 },
        { outside: 40, inside: 40 },
        { outside: 45, inside: 40 },
        { outside: 50, inside: 40 },
        { outside: 55, inside: 40 },
        { outside: 60, inside: 40 },
        { outside: 65, inside: 40 },
        { outside: 70, inside: 40 },
  
        { outside: 30, inside: 45 },
        { outside: 35, inside: 45 },
        { outside: 40, inside: 45 },
        { outside: 45, inside: 45 },
        { outside: 50, inside: 45 },
        { outside: 55, inside: 45 },
        { outside: 60, inside: 45 },
        { outside: 65, inside: 45 },
        { outside: 70, inside: 45 },
  
        { outside: 30, inside: 50 },
        { outside: 35, inside: 50 },
        { outside: 40, inside: 50 },
        { outside: 45, inside: 50 },
        { outside: 50, inside: 50 },
        { outside: 55, inside: 50 },
        { outside: 60, inside: 50 },
        { outside: 65, inside: 50 },
  
        { outside: 30, inside: 55 },
        { outside: 35, inside: 55 },
        { outside: 40, inside: 55 },
        { outside: 45, inside: 55 },
        { outside: 50, inside: 55 },
        { outside: 55, inside: 55 },
        { outside: 60, inside: 55 },
  
        { outside: 30, inside: 60 },
        { outside: 35, inside: 60 },
        { outside: 40, inside: 60 },
        { outside: 45, inside: 60 },
        { outside: 50, inside: 60 },
        { outside: 55, inside: 60 },
        { outside: 60, inside: 60 },
  
        { outside: 30, inside: 65 },
        { outside: 35, inside: 65 },
        { outside: 40, inside: 65 },
        { outside: 45, inside: 65 },
        { outside: 50, inside: 65 },
  
        { outside: 70, inside: 30 },
        { outside: 70, inside: 35 },
        { outside: 70, inside: 40 },
        { outside: 70, inside: 45 },
      ],
      options: [],
    },
  
    Halbzylinder: {
      sizes: [

        { outside: 30, inside: 10 },
        { outside: 35, inside: 10 },
        { outside: 40, inside: 10 },
        { outside: 45, inside: 10 },
        { outside: 50, inside: 10 },
        { outside: 60, inside: 10 },
        { outside: 70, inside: 10 },
      ],
      options: [],
    },
  
    Vorhangschloss: {
      types: {
        "50mm": {
          options: []
        },
        "80mm": {
          options: []
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
    ],
  }
  