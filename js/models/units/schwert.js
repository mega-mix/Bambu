// js/models/units/schwert.js

export class Schwert {
    static BASIS_ATTACK = 10;       // Grundwert Angriffskraft
    static BASIS_DEFFENS = 15;      // Grundwert Verteidigung
    static FAKTOR = 1.2;            // Faktor für Stärke
    static BASIS_KOSTEN_GOLD = 25;  // Grundwert Goldkosten
    static BASIS_KOSTEN_HOLZ = 10;  // Grundwert Holzkosten
    static BASIS_KOSTEN_STEIN = 5;  // Grundwert Steinkosten
    static FAKTOR_KOSTEN = 1;       // Faktor für Kostenrechnung

    constructor() {
        this.name = "Schwertkämpfer";
        this.level = 1;
        this.hp = 100;
    }

    get tag() { return "EINHEIT"; }

    // --- Hilfsrechnung Wert * Level ---
    berechnung(basis, faktor) {
        return Math.floor(basis * Math.pow(faktor, this.level - 1));
    }

    get kostenGold() { return this.berechnung(Schwert.BASIS_KOSTEN_GOLD, Schwert.FAKTOR_KOSTEN); }
    get kostenHolz() { return this.berechnung(Schwert.BASIS_KOSTEN_HOLZ, Schwert.FAKTOR_KOSTEN); }
    get kostenStein() { return this.berechnung(Schwert.BASIS_KOSTEN_STEIN, Schwert.FAKTOR_KOSTEN); }
}