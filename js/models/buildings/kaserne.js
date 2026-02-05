// js/models/buildings/kaserne.js

export class Kaserne {
    static BASIS_KOSTEN_GOLD = 380;     // Grundwert Goldkosten
    static BASIS_KOSTEN_HOLZ = 400;     // Grundwert Holzkosten
    static BASIS_KOSTEN_STEIN = 410;    // Grundwert Steinkosten
    static FAKTOR_KOSTEN = 1.7;         // Faktor für Kostenrechnung
    static BAUZEIT = 120000;            // Bauzeit des Gebäudes in ms
    static FAKTOR_BAUZEIT = 1.2;        // Faktor für Bauzeit

    constructor() {
        this.name = "Kaserne";
        this.level = 1;
    }

    get tag() { return "BAUWERK"; }

    // --- Abgleich SaveGame ---
    load(data) {
        if (!data) return;

        // Läd Daten vom SaveGame in dieses Objekt
        if (data.level) { this.level = data.level; }
    }

    // --- Hilfsrechnung Wert * Level ---
    berechnung(basis, faktor) {
        return Math.floor(basis * Math.pow(faktor, this.level - 1));
    }

    // --- Level erhöhen ---
    levelUp() {
        this.level ++;
    }

    get kostenGold() { return this.berechnung(Kaserne.BASIS_KOSTEN_GOLD, Kaserne.FAKTOR_KOSTEN); }
    get kostenHolz() { return this.berechnung(Kaserne.BASIS_KOSTEN_HOLZ, Kaserne.FAKTOR_KOSTEN); }
    get kostenStein() { return this.berechnung(Kaserne.BASIS_KOSTEN_STEIN, Kaserne.FAKTOR_KOSTEN); }
    get bauzeit() { return this.berechnung(Kaserne.BAUZEIT, Kaserne.FAKTOR_BAUZEIT); }
}