// js/models/buildings/rathaus.js

export class Rathaus {
    static MAX_LEVEL = 20;               // Maximales level für das Rathaus
    static BASIS_KOSTEN_GOLD = 400;     // Grundwert Goldkosten
    static BASIS_KOSTEN_HOLZ = 380;     // Grundwert Holzkosten
    static BASIS_KOSTEN_STEIN = 420;    // Grundwert Steinkosten
    static FAKTOR_KOSTEN = 1.8;         // Faktor für Kostenrechnung
    static BAUZEIT = 20000;             // Bauzeit des Gebäudes

    constructor() {
        this.name = "Rathaus";
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
        if (this.level < Rathaus.MAX_LEVEL) { this.level++; }
    }

    get kostenGold() { return this.berechnung(Rathaus.BASIS_KOSTEN_GOLD, Rathaus.FAKTOR_KOSTEN); }
    get kostenHolz() { return this.berechnung(Rathaus.BASIS_KOSTEN_HOLZ, Rathaus.FAKTOR_KOSTEN); }
    get kostenStein() { return this.berechnung(Rathaus.BASIS_KOSTEN_STEIN, Rathaus.FAKTOR_KOSTEN); }
    get bauzeit() { return Rathaus.BAUZEIT; }
}