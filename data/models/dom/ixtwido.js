export default {
    isSchliessanlage: true,
    image: "./images/dom-ix-twido-doppelzylinder-schluessel-logo-500x500.png",
    keyPrice: 4.35,
    productID: 28348,
    useCase: "gewerblich",
    securityLevel: 10,
    features: [
        "Hochsicherheitszylinder für extreme Sicherheit",
        "Flexibles und anpassbares Schließsystem",
        "Inklusive Not- und Gefahrenfunktion",

    ],
    infoText: `Der DOM IX Twido bietet höchste Sicherheit und vielseitige Einsatzmöglichkeiten, optimal für Mehrfamilienhäuser, Betriebsgebäude oder Sicherheitsliebhaber. Mit seiner 360°-Freilauffunktion (333FRL) und der optionalen Abschließmöglichkeit (333T) bietet er Flexibilität und Sicherheit. Er lässt sich nahtlos in alle DOM-Schließsysteme integrieren und ist optional in einer seewasserbeständigen Ausführung erhältlich. Das verlängerte Schlüsselblatt sorgt für hervorragendes Handling, auch bei Sicherheitsbeschlägen. Im Lieferumfang ist eine Sicherungskarte enthalten, und durch die modulare Bauweise sowie den ClipTag kann der IX Twido mit elektronischen Systemen kombiniert werden. Optimaler Abreiß- und Ziehschutz sowie diverse Sicherheitsfeatures machen ihn zur idealen Wahl für anspruchsvolle Sicherheitsbedürfnisse.`,
    deliveryTime: "Eine Woche",

    ////////////////////////////////////////////////////////////////////////
    // DOPPELZYLINDER
    ////////////////////////////////////////////////////////////////////////
    Doppelzylinder: {
        optionUpcharges: {
            notGefahr: 2.10,
            modular: 15.23,
            bohrschutz: 14.18,
            seewasser: 9.45,
            freilauf: 9.45,
        },
        sizes: [
            { outside: 30, inside: 30, price: 75.55 },
            { outside: 30, inside: 35, price: 80.80 },
            { outside: 30, inside: 40, price: 80.80 },
            { outside: 30, inside: 45, price: 80.80 },
            { outside: 30, inside: 50, price: 87.10 },
            { outside: 30, inside: 55, price: 92.35 },
            { outside: 30, inside: 60, price: 92.35 },
            { outside: 30, inside: 65, price: 98.65 },
            { outside: 30, inside: 70, price: 98.65 },
            { outside: 30, inside: 75, price: 103.90 },
            { outside: 30, inside: 80, price: 103.90 },

            { outside: 35, inside: 30, price: 87.10 },
            { outside: 35, inside: 35, price: 87.10 },
            { outside: 35, inside: 40, price: 87.10 },
            { outside: 35, inside: 45, price: 87.10 },
            { outside: 35, inside: 50, price: 92.35 },
            { outside: 35, inside: 55, price: 98.65 },
            { outside: 35, inside: 60, price: 98.65 },
            { outside: 35, inside: 65, price: 103.90 },
            { outside: 35, inside: 70, price: 103.90 },
            { outside: 35, inside: 75, price: 109.15 },
            { outside: 35, inside: 80, price: 109.15 },

            { outside: 40, inside: 30, price: 87.10 },
            { outside: 40, inside: 35, price: 87.10 },
            { outside: 40, inside: 40, price: 87.10 },
            { outside: 40, inside: 45, price: 87.10 },
            { outside: 40, inside: 50, price: 92.35 },
            { outside: 40, inside: 55, price: 98.65 },
            { outside: 40, inside: 60, price: 98.65 },
            { outside: 40, inside: 65, price: 103.90 },
            { outside: 40, inside: 70, price: 103.90 },
            { outside: 40, inside: 75, price: 109.15 },
            { outside: 40, inside: 80, price: 109.15 },

            { outside: 45, inside: 30, price: 98.65 },
            { outside: 45, inside: 35, price: 98.65 },
            { outside: 45, inside: 40, price: 103.90 },
            { outside: 45, inside: 45, price: 98.65 },
            { outside: 45, inside: 50, price: 98.65 },
            { outside: 45, inside: 55, price: 103.90 },
            { outside: 45, inside: 60, price: 103.90 },
            { outside: 45, inside: 65, price: 109.15 },
            { outside: 45, inside: 70, price: 109.15 },
            { outside: 45, inside: 75, price: 141.70 },
            { outside: 45, inside: 80, price: 141.70 },

            { outside: 50, inside: 30, price: 98.65 },
            { outside: 50, inside: 35, price: 103.90 },
            { outside: 50, inside: 40, price: 98.65 },
            { outside: 50, inside: 45, price: 103.90 },
            { outside: 50, inside: 50, price: 98.65 },
            { outside: 50, inside: 55, price: 103.90 },
            { outside: 50, inside: 60, price: 103.90 },
            { outside: 50, inside: 65, price: 109.15 },
            { outside: 50, inside: 70, price: 109.15 },
            { outside: 50, inside: 75, price: 141.70 },

            { outside: 55, inside: 30, price: 109.15 },
            { outside: 55, inside: 35, price: 109.15 },
            { outside: 55, inside: 40, price: 109.15 },
            { outside: 55, inside: 45, price: 109.15 },
            { outside: 55, inside: 50, price: 109.15 },
            { outside: 55, inside: 55, price: 109.15 },
            { outside: 55, inside: 60, price: 109.15 },
            { outside: 55, inside: 65, price: 141.70 },

            { outside: 60, inside: 30, price: 109.15 },
            { outside: 60, inside: 35, price: 109.15 },
            { outside: 60, inside: 40, price: 109.15 },
            { outside: 60, inside: 45, price: 109.15 },
            { outside: 60, inside: 50, price: 109.15 },
            { outside: 60, inside: 55, price: 109.15 },
            { outside: 60, inside: 60, price: 109.15 },
            { outside: 60, inside: 65, price: 109.15 },
            { outside: 60, inside: 70, price: 141.70 },
            { outside: 60, inside: 75, price: 151.15 },
            { outside: 60, inside: 80, price: 151.15 },

            { outside: 65, inside: 30, price: 151.15 },
            { outside: 65, inside: 35, price: 151.15 },
            { outside: 65, inside: 40, price: 151.15 },
            { outside: 65, inside: 45, price: 151.15 },
            { outside: 65, inside: 50, price: 151.15 },
            { outside: 65, inside: 55, price: 151.15 },
            { outside: 65, inside: 60, price: 151.15 },
            { outside: 65, inside: 65, price: 151.15 },
            { outside: 65, inside: 70, price: 151.15 },
            { outside: 65, inside: 75, price: 160.60 },
            { outside: 65, inside: 80, price: 160.60 },

            { outside: 70, inside: 30, price: 160.60 },
            { outside: 70, inside: 35, price: 160.60 },
            { outside: 70, inside: 40, price: 160.60 },
            { outside: 70, inside: 45, price: 160.60 },
            { outside: 70, inside: 50, price: 160.60 },
            { outside: 70, inside: 55, price: 160.60 },
            { outside: 70, inside: 60, price: 160.60 },
            { outside: 70, inside: 65, price: 160.60 },
            { outside: 70, inside: 70, price: 151.15 },
            { outside: 70, inside: 75, price: 160.60 },
            { outside: 70, inside: 80, price: 160.60 },

            { outside: 75, inside: 30, price: 151.15 },
            { outside: 75, inside: 35, price: 151.15 },
            { outside: 75, inside: 40, price: 151.15 },
            { outside: 75, inside: 45, price: 151.15 },
            { outside: 75, inside: 50, price: 151.15 },
            { outside: 75, inside: 55, price: 151.15 },
            { outside: 75, inside: 60, price: 151.15 },
            { outside: 75, inside: 65, price: 151.15 },
            { outside: 75, inside: 70, price: 151.15 },
            { outside: 75, inside: 75, price: 170.05 },
            { outside: 75, inside: 80, price: 170.05 },

            { outside: 80, inside: 30, price: 160.60 },
            { outside: 80, inside: 35, price: 160.60 },
            { outside: 80, inside: 40, price: 160.60 },
            { outside: 80, inside: 45, price: 160.60 },
            { outside: 80, inside: 50, price: 160.60 },
            { outside: 80, inside: 55, price: 160.60 },
            { outside: 80, inside: 60, price: 160.60 },
            { outside: 80, inside: 65, price: 160.60 },
            { outside: 80, inside: 70, price: 151.15 },
            { outside: 80, inside: 75, price: 160.60 },
            { outside: 80, inside: 80, price: 170.05 },
        ],
        options: [
            "Not- & Gefahrenfunktion",
            "Modulare Bauweise",
            "Erhöhter Bohrschutz",
            "Seewasserfest",
            "Freilauf",
        ],
    },

    ////////////////////////////////////////////////////////////////////////
    // KNAUFZYLINDER (innen)
    ////////////////////////////////////////////////////////////////////////
    Knaufzylinder: {
        optionUpcharges: {
            modular: 15.23,
            bohrschutz: 14.18,
            seewasser: 9.45,
        },
        sizes: [
            { outside: 30, inside: 30, price: 75.55 },
            { outside: 30, inside: 35, price: 80.80 },
            { outside: 30, inside: 40, price: 80.80 },
            { outside: 30, inside: 50, price: 87.10 },
            { outside: 30, inside: 55, price: 92.35 },
            { outside: 30, inside: 60, price: 92.35 },
            { outside: 30, inside: 65, price: 98.65 },
            { outside: 30, inside: 70, price: 98.65 },
            { outside: 30, inside: 75, price: 103.90 },
            { outside: 30, inside: 80, price: 103.90 },

            { outside: 35, inside: 35, price: 87.10 },
            { outside: 35, inside: 40, price: 87.10 },
            { outside: 35, inside: 50, price: 92.35 },
            { outside: 35, inside: 55, price: 98.65 },
            { outside: 35, inside: 60, price: 98.65 },
            { outside: 35, inside: 65, price: 103.90 },
            { outside: 35, inside: 70, price: 103.90 },
            { outside: 35, inside: 75, price: 109.15 },
            { outside: 35, inside: 80, price: 109.15 },

            { outside: 40, inside: 40, price: 87.10 },
            { outside: 40, inside: 50, price: 92.35 },
            { outside: 40, inside: 55, price: 98.65 },
            { outside: 40, inside: 60, price: 98.65 },
            { outside: 40, inside: 65, price: 103.90 },
            { outside: 40, inside: 70, price: 103.90 },
            { outside: 40, inside: 75, price: 109.15 },
            { outside: 40, inside: 80, price: 109.15 },

            { outside: 45, inside: 45, price: 98.65 },
            { outside: 45, inside: 50, price: 98.65 },
            { outside: 45, inside: 55, price: 103.90 },
            { outside: 45, inside: 60, price: 103.90 },
            { outside: 45, inside: 65, price: 109.15 },
            { outside: 45, inside: 70, price: 109.15 },
            { outside: 45, inside: 75, price: 141.70 },
            { outside: 45, inside: 80, price: 141.70 },

            { outside: 50, inside: 50, price: 98.65 },
            { outside: 50, inside: 55, price: 103.90 },
            { outside: 50, inside: 60, price: 103.90 },
            { outside: 50, inside: 65, price: 109.15 },
            { outside: 50, inside: 70, price: 109.15 },
            { outside: 50, inside: 75, price: 141.70 },

            { outside: 55, inside: 55, price: 109.15 },
            { outside: 55, inside: 60, price: 109.15 },
            { outside: 55, inside: 65, price: 141.70 },
            { outside: 55, inside: 70, price: 141.70 },
            { outside: 55, inside: 75, price: 151.15 },
            { outside: 55, inside: 80, price: 151.15 },

            { outside: 60, inside: 60, price: 109.15 },
            { outside: 60, inside: 70, price: 141.70 },
            { outside: 60, inside: 75, price: 151.15 },
            { outside: 60, inside: 80, price: 151.15 },

            { outside: 65, inside: 65, price: 151.15 },
            { outside: 65, inside: 70, price: 151.15 },
            { outside: 65, inside: 75, price: 160.60 },
            { outside: 65, inside: 80, price: 160.60 },

            { outside: 70, inside: 70, price: 151.15 },
            { outside: 70, inside: 75, price: 160.60 },
            { outside: 70, inside: 80, price: 160.60 },

            { outside: 75, inside: 30, price: 103.90 },
            { outside: 75, inside: 35, price: 109.15 },
            { outside: 75, inside: 40, price: 109.15 },
            { outside: 75, inside: 45, price: 141.70 },
            { outside: 75, inside: 50, price: 141.70 },
            { outside: 75, inside: 55, price: 151.15 },
            { outside: 75, inside: 60, price: 151.15 },
            { outside: 75, inside: 65, price: 160.60 },
            { outside: 75, inside: 70, price: 160.60 },
            { outside: 75, inside: 75, price: 170.05 },
            { outside: 75, inside: 80, price: 170.05 },

            { outside: 80, inside: 30, price: 103.90 },
            { outside: 80, inside: 35, price: 109.15 },
            { outside: 80, inside: 40, price: 109.15 },
            { outside: 80, inside: 45, price: 141.70 },
            { outside: 80, inside: 55, price: 151.15 },
            { outside: 80, inside: 60, price: 151.15 },
            { outside: 80, inside: 65, price: 160.60 },
            { outside: 80, inside: 70, price: 160.60 },
            { outside: 80, inside: 75, price: 170.05 },
            { outside: 80, inside: 80, price: 170.05 },
        ],
        options: [
            "Modulare Bauweise",
            "Erhöhter Bohrschutz",
            "Seewasserfest",
        ],
    },

    ////////////////////////////////////////////////////////////////////////
    // HALBZYLINDER
    ////////////////////////////////////////////////////////////////////////
    Halbzylinder: {
        optionUpcharges: {
            notGefahr: 2.10,
            modular: 13.65,
            bohrschutz: 7.35,
            seewasser: 7.88,
            freilauf: 9.45,
        },
        sizes: [
            { outside: 30, inside: 10, price: 55.60 },
            { outside: 35, inside: 10, price: 61.90 },
            { outside: 40, inside: 10, price: 61.90 },
            { outside: 45, inside: 10, price: 67.15 },
            { outside: 50, inside: 10, price: 67.15 },
            { outside: 55, inside: 10, price: 72.40 },
            { outside: 60, inside: 10, price: 72.40 },
            { outside: 65, inside: 10, price: 78.70 },
            { outside: 70, inside: 10, price: 78.70 },
        ],
        options: [
            "Not- & Gefahrenfunktion",
            "Modulare Bauweise",
            "Erhöhter Bohrschutz",
            "Seewasserfest",
            "Freilauf",
        ],
    },

    ////////////////////////////////////////////////////////////////////////
    // VORHANGSCHLOSS 
    ////////////////////////////////////////////////////////////////////////
    Vorhangschloss: {
        types: {
            "50mm": {
                options: ["Seenwasserfest"],
            },
            "80mm": {
                options: ["Seenwasserfest"],
            },
        },
    },

    ////////////////////////////////////////////////////////////////////////
    // BRIEFKASTENSCHLOSS 
    ////////////////////////////////////////////////////////////////////////
    Briefkastenschloss: {
        options: {
            Art: ["Surface", "Mortise"],
            Material: ["Nickel", "Bronze"],
        },
    },

    ////////////////////////////////////////////////////////////////////////
    // Verfügbare Typen
    ////////////////////////////////////////////////////////////////////////
    availableTypes: [
        "Doppelzylinder",
        "Knaufzylinder (innen)",
        "Halbzylinder",
    ],
};
