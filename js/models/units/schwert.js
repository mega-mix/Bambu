// js/models/units/schwert.js

export class Schwert {
    static BASIS_ATTACK = 10;       // Grundwert Angriffskraft
    static BASIS_DEFFENS = 15;      // Grundwert Verteidigung
    static FAKTOR_ATTRIBUTE = 1;    // Faktor für Attribute
    static BASIS_KOSTEN_GOLD = 25;  // Grundwert Goldkosten
    static BASIS_KOSTEN_HOLZ = 10;  // Grundwert Holzkosten
    static BASIS_KOSTEN_STEIN = 5;  // Grundwert Steinkosten
    static FAKTOR_KOSTEN = 1;       // Faktor für Kostenrechnung
    static BAUZEIT = 20000;         // Zeit der Ausbildung

    constructor() {
        this.name = "Schwertkämpfer";
        this.level = 1;
        this.hp = 100;
    }

    get tag() { return "EINHEIT"; }

    // --- Ableich mit altem Spielstand ---
    applyData(data) {
        Object.assign(this, data); // Kopiert alle Werte (hp, dmg) von data in dieses Objekt
    }

    // --- Hilfsrechnung Wert * Level ---
    berechnung(basis, faktor) {
        return Math.floor(basis * Math.pow(faktor, this.level - 1));
    }

    get kostenGold() { return this.berechnung(Schwert.BASIS_KOSTEN_GOLD, Schwert.FAKTOR_KOSTEN); }
    get kostenHolz() { return this.berechnung(Schwert.BASIS_KOSTEN_HOLZ, Schwert.FAKTOR_KOSTEN); }
    get kostenStein() { return this.berechnung(Schwert.BASIS_KOSTEN_STEIN, Schwert.FAKTOR_KOSTEN); }
    get bauzeit() { return Schwert.BAUZEIT; }

    get angriff() { return this.berechnung(Schwert.BASIS_ATTACK, Schwert.FAKTOR_ATTRIBUTE); }
    get verteidigung() { return this.berechnung(Schwert.BASIS_DEFFENS, Schwert.FAKTOR_ATTRIBUTE); }
}