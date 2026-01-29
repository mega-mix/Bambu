// js/models/units/speer.js

export class Speer {
    static BASIS_ATTACK = 15;       // Grundwert Angriffskraft
    static BASIS_DEFFENS = 12;      // Grundwert Verteidigung
    static FAKTOR_ATTRIBUTE = 1;    // Faktor für Attribute
    static BASIS_KOSTEN_GOLD = 20;  // Grundwert Goldkosten
    static BASIS_KOSTEN_HOLZ = 20;  // Grundwert Holzkosten
    static BASIS_KOSTEN_STEIN = 10; // Grundwert Steinkosten
    static FAKTOR_KOSTEN = 1;       // Faktor für Kostenrechnung
    static BAUZEIT = 45000;         // Zeit der Ausbildung

    constructor() {
        this.name = "Speerträger";
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

    get kostenGold() { return this.berechnung(Speer.BASIS_KOSTEN_GOLD, Speer.FAKTOR_KOSTEN); }
    get kostenHolz() { return this.berechnung(Speer.BASIS_KOSTEN_HOLZ, Speer.FAKTOR_KOSTEN); }
    get kostenStein() { return this.berechnung(Speer.BASIS_KOSTEN_STEIN, Speer.FAKTOR_KOSTEN); }
    get bauzeit() { return Speer.BAUZEIT; }

    get angriff() { return this.berechnung(Speer.BASIS_ATTACK, Speer.FAKTOR_ATTRIBUTE); }
    get verteidigung() { return this.berechnung(Speer.BASIS_DEFFENS, Speer.FAKTOR_ATTRIBUTE); }
}