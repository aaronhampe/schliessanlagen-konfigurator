export default {
    isSchliessanlage: false,
    image: "./images/iseo-r6-doppelzylinder-schluessel-logo-500x500.png",
    keyPrice: 4.10,
    productID: 28498,
    useCase: "privat",
    securityLevel: 6,
    features: [
        "Wendeschlüssel-Profilzylinder",
        "Inklusive Not- und Gefahrenfunktion",
        "Schließzylinder aus hochfester Messinglegierung",
    ],
    infoText: `Der ISEO Schließzylinder R6 mit frei kopierbaren Schlüsseln ist ein Wendeschlüsselsystem der Einstiegsklasse. Er ist sowohl in verschiedenschließenden als auch in gleichschließenden Varianten erhältlich.

    Der R6 verfügt ab einer Länge von 30-30 auf jeder Schließseite über 6 Codierstifte aus verschleißfestem Spezialmessing. Im Profilzylinder sind sowohl ein Bohrschutz als auch ein Pickingschutz integriert. Das Zylindergehäuse ist standardmäßig matt vernickelt oder aus Messing gefertigt. Die Schlüssel bestehen aus vernickeltem Messing.`,
    deliveryTime: "2-3 Werktage",

    ////////////////////////////////////////////////////////////////////////
    // DOPPELZYLINDER
    ////////////////////////////////////////////////////////////////////////
    Doppelzylinder: {
        sizes: [
            ////////
            { outside: 28, inside: 28, price: 31.52 },
            { outside: 28, inside: 33, price: 31.52 },
            ////////
            { outside: 30, inside: 30, price: 33.63 },
            { outside: 30, inside: 35, price: 33.63 },
            { outside: 30, inside: 40, price: 34.68 },
            { outside: 30, inside: 45, price: 35.73 },
            { outside: 30, inside: 50, price: 35.73 },
            { outside: 30, inside: 55, price: 36.78 },
            { outside: 30, inside: 60, price: 37.84 },
            { outside: 30, inside: 65, price: 37.84 },
            { outside: 30, inside: 70, price: 38.89 },
            { outside: 30, inside: 75, price: 39.94 },
            { outside: 30, inside: 80, price: 39.94 },
            ////////
            { outside: 35, inside: 30, price: 33.63 },
            { outside: 35, inside: 35, price: 34.68 },
            { outside: 35, inside: 40, price: 35.73 },
            { outside: 35, inside: 45, price: 35.73 },
            { outside: 35, inside: 50, price: 36.78 },
            { outside: 35, inside: 55, price: 37.84 },
            { outside: 35, inside: 60, price: 37.84 },
            { outside: 35, inside: 65, price: 38.89 },
            { outside: 35, inside: 70, price: 39.94 },
            { outside: 35, inside: 75, price: 39.94 },
            ////////
            { outside: 40, inside: 30, price: 33.63 },
            { outside: 40, inside: 35, price: 34.68 },
            { outside: 40, inside: 40, price: 35.73 },
            { outside: 40, inside: 45, price: 36.78 },
            { outside: 40, inside: 50, price: 37.84 },
            { outside: 40, inside: 55, price: 37.84 },
            { outside: 40, inside: 60, price: 38.89 },
            { outside: 40, inside: 65, price: 39.94 },
            { outside: 40, inside: 70, price: 39.94 },
            ////////
            { outside: 45, inside: 30, price: 34.68 },
            { outside: 45, inside: 35, price: 35.73 },
            { outside: 45, inside: 40, price: 36.78 },
            { outside: 45, inside: 45, price: 37.84 },
            { outside: 45, inside: 50, price: 37.84 },
            { outside: 45, inside: 55, price: 38.89 },
            { outside: 45, inside: 60, price: 39.94 },
            { outside: 45, inside: 65, price: 39.94 },
            ////////
            { outside: 50, inside: 30, price: 34.68 },
            { outside: 50, inside: 35, price: 35.73 },
            { outside: 50, inside: 40, price: 36.78 },
            { outside: 50, inside: 45, price: 37.84 },
            { outside: 50, inside: 50, price: 38.89 },
            { outside: 50, inside: 55, price: 39.94 },
            { outside: 50, inside: 60, price: 39.94 },
            ////////
            { outside: 55, inside: 30, price: 34.68 },
            { outside: 55, inside: 35, price: 35.73 },
            { outside: 55, inside: 40, price: 36.78 },
            { outside: 55, inside: 45, price: 37.84 },
            { outside: 55, inside: 50, price: 38.89 },
            { outside: 55, inside: 55, price: 39.94 },
            ////////
        ],
        options: ["Not- & Gefahrenfunktion"],
    },
    Knaufzylinder: {
        sizes: [
            ////////
            { outside: 28, inside: 28, price: 46.26 },
            { outside: 28, inside: 33, price: 46.26 },
            ////////
            { outside: 30, inside: 30, price: 48.36 },
            { outside: 30, inside: 35, price: 49.42 },
            { outside: 30, inside: 40, price: 49.42 },
            { outside: 30, inside: 45, price: 50.47 },
            { outside: 30, inside: 50, price: 51.52 },
            { outside: 30, inside: 55, price: 52.57 },
            { outside: 30, inside: 60, price: 53.63 },
            { outside: 30, inside: 65, price: 53.63 },
            { outside: 30, inside: 70, price: 54.68 },
            { outside: 30, inside: 75, price: 55.60 },
            { outside: 30, inside: 80, price: 56.65 },
            ////////
            { outside: 33, inside: 28, price: 46.26 },
            ////////
            { outside: 35, inside: 30, price: 48.36 },
            { outside: 35, inside: 35, price: 49.30 },
            { outside: 35, inside: 40, price: 50.35 },
            { outside: 35, inside: 45, price: 51.40 },
            { outside: 35, inside: 50, price: 52.45 },
            { outside: 35, inside: 55, price: 53.50 },
            { outside: 35, inside: 60, price: 53.50 },
            { outside: 35, inside: 65, price: 54.55 },
            { outside: 35, inside: 70, price: 55.60 },
            { outside: 35, inside: 75, price: 56.65 },
            ////////
            { outside: 40, inside: 30, price: 49.42 },
            { outside: 40, inside: 35, price: 50.35 },
            { outside: 40, inside: 40, price: 51.40 },
            { outside: 40, inside: 45, price: 52.45 },
            { outside: 40, inside: 50, price: 52.45 },
            { outside: 40, inside: 55, price: 53.50 },
            { outside: 40, inside: 60, price: 54.55 },
            { outside: 40, inside: 65, price: 55.60 },
            { outside: 40, inside: 70, price: 55.60 },
            ////////
            { outside: 45, inside: 30, price: 50.47 },
            { outside: 45, inside: 35, price: 51.40 },
            { outside: 45, inside: 40, price: 51.40 },
            { outside: 45, inside: 45, price: 52.45 },
            { outside: 45, inside: 50, price: 53.50 },
            { outside: 45, inside: 55, price: 54.55 },
            { outside: 45, inside: 60, price: 55.60 },
            { outside: 45, inside: 65, price: 55.60 },
            ////////
            { outside: 50, inside: 30, price: 50.47 },
            { outside: 50, inside: 35, price: 51.40 },
            { outside: 50, inside: 40, price: 52.45 },
            { outside: 50, inside: 45, price: 53.50 },
            { outside: 50, inside: 50, price: 54.55 },
            { outside: 50, inside: 55, price: 55.60 },
            { outside: 50, inside: 60, price: 55.60 },
            ////////
            { outside: 55, inside: 30, price: 51.52 },
            { outside: 55, inside: 35, price: 52.45 },
            { outside: 55, inside: 40, price: 53.50 },
            { outside: 55, inside: 45, price: 54.55 },
            { outside: 55, inside: 50, price: 55.60 },
            { outside: 55, inside: 55, price: 55.60 },
            ////////
            { outside: 60, inside: 30, price: 52.57 },
            { outside: 60, inside: 35, price: 53.50 },
            { outside: 60, inside: 40, price: 53.50 },
            { outside: 60, inside: 45, price: 54.55 },
            { outside: 60, inside: 50, price: 55.60 },
            ////////
            { outside: 65, inside: 30, price: 52.57 },
            { outside: 65, inside: 35, price: 53.50 },
            { outside: 65, inside: 40, price: 54.55 },
            { outside: 65, inside: 45, price: 55.60 },
            ////////
            { outside: 70, inside: 30, price: 53.63 },
            { outside: 70, inside: 35, price: 54.55 },
            { outside: 70, inside: 40, price: 55.60 },
            ////////
            { outside: 75, inside: 30, price: 54.55 },
            ////////
            { outside: 80, inside: 30, price: 54.55 }
            ////////
        ],
        options: [],
    },
    Halbzylinder: {
        sizes: [
            { outside: 30, inside: 10, price: 28.36 },
            { outside: 35, inside: 10, price: 28.36 },
            { outside: 40, inside: 10, price: 29.42 },
            { outside: 45, inside: 10, price: 30.47 },
            { outside: 50, inside: 10, price: 30.47 },
            { outside: 55, inside: 10, price: 31.52 },
            { outside: 60, inside: 10, price: 32.57 },
            { outside: 65, inside: 10, price: 32.57 },
            { outside: 70, inside: 10, price: 33.63 },
            { outside: 75, inside: 10, price: 33.63 },
            { outside: 80, inside: 10, price: 34.68 },
            { outside: 85, inside: 10, price: 34.68 },
            { outside: 90, inside: 10, price: 36.78 },
        ],
        options: [
            "Not- & Gefahrenfunktion",
        ],
    },
    Vorhangschloss: {
        types: {
            "50mm": {
                options: [
                    "Seenwasserfest",
                ]
            },
            "80mm": {
                options: [
                    "Seenwasserfest",
                ]
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
    ],
}
