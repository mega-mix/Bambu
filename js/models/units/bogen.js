// js/models/units/bogen.js

export class Bogen {
    static BASIS_ATTACK = 18;       // Grundwert Angriffskraft
    static BASIS_DEFFENS = 5;       // Grundwert Verteidigung
    static FAKTOR_ATTRIBUTE = 1;    // Faktor für Attribute
    static BASIS_KOSTEN_GOLD = 20;  // Grundwert Goldkosten
    static BASIS_KOSTEN_HOLZ = 25;  // Grundwert Holzkosten
    static BASIS_KOSTEN_STEIN = 5;  // Grundwert Steinkosten
    static FAKTOR_KOSTEN = 1;       // Faktor für Kostenrechnung
    static BAUZEIT = 60000;         // Zeit der Ausbildung

    constructor() {
        this.name = "Bogenschütze";
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

    get kostenGold() { return this.berechnung(Bogen.BASIS_KOSTEN_GOLD, Bogen.FAKTOR_KOSTEN); }
    get kostenHolz() { return this.berechnung(Bogen.BASIS_KOSTEN_HOLZ, Bogen.FAKTOR_KOSTEN); }
    get kostenStein() { return this.berechnung(Bogen.BASIS_KOSTEN_STEIN, Bogen.FAKTOR_KOSTEN); }
    get bauzeit() { return Bogen.BAUZEIT; }

    get angriff() { return this.berechnung(Bogen.BASIS_ATTACK, Bogen.FAKTOR_ATTRIBUTE); }
    get verteidigung() { return this.berechnung(Bogen.BASIS_DEFFENS, Bogen.FAKTOR_ATTRIBUTE); }
}