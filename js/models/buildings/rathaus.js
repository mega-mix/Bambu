// js/models/buildings/rathaus.js

export class Rathaus {
    static MAX_LEVEL = 2;               // Maximales level für das Rathaus
    static BASIS_KOSTEN_GOLD = 158;     // Grundwert Goldkosten
    static BASIS_KOSTEN_HOLZ = 143;     // Grundwert Holzkosten
    static BASIS_KOSTEN_STEIN = 188;    // Grundwert Steinkosten
    static FAKTOR_KOSTEN = 1.8;         // Faktor für Kostenrechnung

    constructor() {
        this.name = "Rathaus";
        this.level = 1;
    }

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

    get levelKostenGold() { return this.berechnung(Rathaus.BASIS_KOSTEN_GOLD, Rathaus.FAKTOR_KOSTEN); }
    get levelKostenHolz() { return this.berechnung(Rathaus.BASIS_KOSTEN_HOLZ, Rathaus.FAKTOR_KOSTEN); }
    get levelKostenStein() { return this.berechnung(Rathaus.BASIS_KOSTEN_STEIN, Rathaus.FAKTOR_KOSTEN); }
}