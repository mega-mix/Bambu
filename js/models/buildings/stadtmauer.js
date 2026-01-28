// js/models/buildings/stadtmauer.js

export class Stadtmauer {
    static BASIS_KOSTEN_GOLD = 103;     // Grundwert Goldkosten
    static BASIS_KOSTEN_HOLZ = 156;     // Grundwert Holzkosten
    static BASIS_KOSTEN_STEIN = 180;    // Grundwert Steinkosten
    static FAKTOR_KOSTEN = 1.8;         // Faktor für Kostenrechnung
    static BASIS_VERTEIDIGUNG = 100;    // Grundwert Verteidigung
    static FAKTOR_VERTEIDIGUNG = 1.2;   // Faktor für Verteidigung

    constructor() {
        this.name = "Stadtmauer";
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

    get levelKostenGold() { return this.berechnung(Stadtmauer.BASIS_KOSTEN_GOLD, Stadtmauer.FAKTOR_KOSTEN); }
    get levelKostenHolz() { return this.berechnung(Stadtmauer.BASIS_KOSTEN_HOLZ, Stadtmauer.FAKTOR_KOSTEN); }
    get levelKostenStein() { return this.berechnung(Stadtmauer.BASIS_KOSTEN_STEIN, Stadtmauer.FAKTOR_KOSTEN); }

    get verteidigung() {
        if (this.level <= 0) return 0;
        return this.berechnung(Stadtmauer.BASIS_VERTEIDIGUNG, Stadtmauer.FAKTOR_VERTEIDIGUNG);
    }
}