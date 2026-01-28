// js/models/buildings/kaserne.js

export class Kaserne {
    static BASIS_KOSTEN_GOLD = 380;     // Grundwert Goldkosten
    static BASIS_KOSTEN_HOLZ = 400;     // Grundwert Holzkosten
    static BASIS_KOSTEN_STEIN = 410;    // Grundwert Steinkosten
    static FAKTOR_KOSTEN = 1.8;         // Faktor für Kostenrechnung

    constructor() {
        this.name ="Kaserne";
        this.level = 0;

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
        this.level ++;
    }

    get levelKostenGold() { return this.berechnung(Kaserne.BASIS_KOSTEN_GOLD, Kaserne.FAKTOR_KOSTEN); }
    get levelKostenHolz() { return this.berechnung(Kaserne.BASIS_KOSTEN_HOLZ, Kaserne.FAKTOR_KOSTEN); }
    get levelKostenStein() { return this.berechnung(Kaserne.BASIS_KOSTEN_STEIN, Kaserne.FAKTOR_KOSTEN); }
}