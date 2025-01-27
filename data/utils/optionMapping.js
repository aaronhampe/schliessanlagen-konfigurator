export function mapOptionToUpchargeKey(optionLabel) {
    switch (optionLabel) {
      case "Not- & Gefahrenfunktion":
        return "notGefahr";
      case "Modulare Bauweise":
        return "modular";
      case "Erhöhter Bohrschutz":
        return "bohrschutz";
      case "Seewasserfest":
        return "seewasser";
      case "Freilauf":
        return "freilauf";
      default:
        return null;
    }
  }
  
  export function mapTypToModelKey(typ) {
    if (typ === "Knaufzylinder (innen)") return "Knaufzylinder";
    if (typ.toLowerCase().startsWith("vorhangschloss")) {
      return "Vorhangschloss";
    }
    return typ;
  }
  