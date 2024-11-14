export default {
    "Kein bestimmtes Modell": {
        Doppelzylinder: {
            sizes: [
                { inside: 30, outside: 35 },
                { inside: 35, outside: 40 },
                { inside: 40, outside: 45 }
            ],
            options: {
                finishes: ["Nickel", "Bronze", "Brass"],
                security: ["Standard", "High Security"]
            }
        },
        Knaufzylinder: {
            sizes: [
                { inside: 30, outside: 35 },
                { inside: 35, outside: 40 }
            ],
            options: {
                knobStyles: ["Round", "Oval"],
                finishes: ["Nickel", "Bronze"]
            }
        },
        Halbzylinder: {
            sizes: [
                { inside: 30, outside: 0 },
                { inside: 35, outside: 0 }
            ],
            options: {
                finishes: ["Nickel", "Bronze"],
                keyTypes: ["Standard", "Security"]
            }
        },
        Vorhangschloss: {
            types: {
                "50mm": {
                    options: {
                        shackleHeight: ["Standard", "Long"]
                    }
                },
                "80mm": {
                    options: {
                        shackleHeight: ["Standard", "Long", "Extra Long"]
                    }
                }
            }
        },
        Briefkastenschloss: {
            options: {
                mountingTypes: ["Surface", "Mortise"],
                finishes: ["Nickel", "Bronze"]
            }
        },
        availableTypes: [
            "Doppelzylinder",
            "Knaufzylinder (innen)",
            "Halbzylinder",
            "Vorhangschloss 50mm",
            "Vorhangschloss 80mm",
            "Briefkastenschloss"
        ]
    },
    "ABUS EC550": {
        Doppelzylinder: {
            sizes: [
                { inside: 30, outside: 30 },
                { inside: 30, outside: 35 },
                { inside: 30, outside: 40 },
                { inside: 30, outside: 45 },
                { inside: 35, outside: 40 },
                { inside: 40, outside: 45 },
            ],
            options: {
                finishes: ["Nickel", "Bronze", "Brass"],
                security: ["Standard", "High Security"]
            }
        },
        Knaufzylinder: {
            sizes: [
                { inside: 30, outside: 35 },
                { inside: 35, outside: 40 }
            ],
            options: {
                knobStyles: ["Round", "Oval"],
                finishes: ["Nickel", "Bronze"]
            }
        },
        Halbzylinder: {
            sizes: [
                { inside: 30, outside: 0 },
                { inside: 35, outside: 0 }
            ],
            options: {
                finishes: ["Nickel", "Bronze"],
                keyTypes: ["Standard", "Security"]
            }
        },
        Vorhangschloss: {
            types: {
                "50mm": {
                    options: {
                        shackleHeight: ["Standard", "Long"]
                    }
                },
                "80mm": {
                    options: {
                        shackleHeight: ["Standard", "Long", "Extra Long"]
                    }
                }
            }
        },
        Briefkastenschloss: {
            options: {
                mountingTypes: ["Surface", "Mortise"],
                finishes: ["Nickel", "Bronze"]
            }
        },
        availableTypes: [
            "Doppelzylinder",
            "Knaufzylinder (innen)",
            "Halbzylinder",
            "Vorhangschloss 50mm",
            "Vorhangschloss 80mm",
            "Briefkastenschloss"
        ]
    },
    "ABUS EC660": {
        Doppelzylinder: {
            sizes: [
                { inside: 30, outside: 30 },
                { inside: 30, outside: 35 },
                { inside: 30, outside: 40 },
                { inside: 30, outside: 45 },
                { inside: 35, outside: 40 },
                { inside: 40, outside: 45 },
                { inside: 30, outside: 40 },
                { inside: 30, outside: 45 },
                { inside: 35, outside: 40 },
                { inside: 40, outside: 45 },
            ],
            options: {
                finishes: ["Nickel", "Bronze", "Brass"],
                security: ["Standard", "High Security"]
            }
        },
        Knaufzylinder: {
            sizes: [
                { inside: 30, outside: 35 },
                { inside: 35, outside: 40 }
            ],
            options: {
                knobStyles: ["Round", "Oval"],
                finishes: ["Nickel", "Bronze"]
            }
        },
        Halbzylinder: {
            sizes: [
                { inside: 30, outside: 10 },
                { inside: 35, outside: 10 }
            ],
            options: {
                finishes: ["Nickel", "Bronze"],
               
            }
        },
        Vorhangschloss: {
            types: {
                "50mm": {
                    options: {
                        shackleHeight: ["Standard", "Long"]
                    }
                },
                "80mm": {
                    options: {
                        shackleHeight: ["Standard", "Long", "Extra Long"]
                    }
                }
            }
        },
        Briefkastenschloss: {
            options: {
                mountingTypes: ["Surface", "Mortise"],
                finishes: ["Nickel", "Bronze"]
            }
        },
        availableTypes: [
            "Doppelzylinder",
            "Knaufzylinder (innen)",
            "Halbzylinder",
            "Vorhangschloss 50mm",
            "Vorhangschloss 80mm",
            "Briefkastenschloss"
        ]
    }
};