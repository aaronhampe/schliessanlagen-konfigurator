export default {
    isSchliessanlage: false,
    image: "/images/abus-ec660-doppelzylinder-logo-500x500.png",
    Doppelzylinder: {
        sizes: [
            { inside: 30, outside: 30 },
            { inside: 30, outside: 35 },
            { inside: 30, outside: 40 },
            { inside: 30, outside: 45 },
            { inside: 30, outside: 50 },
            { inside: 30, outside: 55 },
            { inside: 30, outside: 60 },
            { inside: 30, outside: 65 },
            { inside: 30, outside: 70 },
            { inside: 30, outside: 80 },
            { inside: 30, outside: 90 },
            { inside: 30, outside: 100 },
            { inside: 30, outside: 110 },
            { inside: 30, outside: 120 },
            ////////////////////////////////////////////
            { inside: 35, outside: 35 },
            { inside: 35, outside: 40 },
            { inside: 35, outside: 45 },
            { inside: 35, outside: 50 },
            { inside: 35, outside: 55 },
            { inside: 35, outside: 60 },
            { inside: 35, outside: 65 },
            { inside: 35, outside: 70 },
            ////////////////////////////////////////////
            { inside: 40, outside: 40 },
            { inside: 40, outside: 45 },
            { inside: 40, outside: 50 },
            { inside: 40, outside: 55 },
            { inside: 40, outside: 60 },
            { inside: 40, outside: 65 },
            { inside: 40, outside: 70 },
            ////////////////////////////////////////////
            { inside: 45, outside: 45 },
            { inside: 45, outside: 50 },
            { inside: 45, outside: 55 },
            { inside: 45, outside: 60 },
            { inside: 45, outside: 65 },
            { inside: 45, outside: 70 },
            ////////////////////////////////////////////
            { inside: 50, outside: 50 },
            { inside: 50, outside: 55 },
            { inside: 50, outside: 60 },
            { inside: 50, outside: 65 },
            ////////////////////////////////////////////
            { inside: 55, outside: 55 },
            { inside: 55, outside: 60 },
            { inside: 55, outside: 65 },
            ////////////////////////////////////////////
            { inside: 60, outside: 60 },
        ],
        options: [
            "Not- & Gefahrenfunktion",
            "Modulare Bauweise",
            "Erhöhter Bohrschutz",
            "Seewasserfest",
            "Freilauf",
        ],
    },
    Knaufzylinder: {
        sizes: [
            { inside: 30, outside: 35 },
            { inside: 35, outside: 40 },
        ],
        options: [
            "Modulare Bauweise",
            "Erhöhter Bohrschutz",
            "Seewasserfest",
        ],
    },
    Halbzylinder: {
        sizes: [
            { inside: 30, outside: 0 },
            { inside: 35, outside: 0 },
        ],
         options: [
            "Not- & Gefahrenfunktion",
            "Modulare Bauweise",
            "Erhöhter Bohrschutz",
            "Seewasserfest",
            "Freilauf",
        ],
    },
    availableTypes: [
        "Doppelzylinder",
        "Knaufzylinder (innen)",
        "Halbzylinder",
    ],
}
