// js/models/buildings/stadtmauer.js

export class Stadtmauer {
    static BASIS_KOSTEN_GOLD = 100;     // Grundwert Goldkosten
    static BASIS_KOSTEN_HOLZ = 200;     // Grundwert Holzkosten
    static BASIS_KOSTEN_STEIN = 450;    // Grundwert Steinkosten
    static FAKTOR_KOSTEN = 1.7;         // Faktor für Kostenrechnung
    static BASIS_VERTEIDIGUNG = 100;    // Grundwert Verteidigung
    static FAKTOR_VERTEIDIGUNG = 1.2;   // Faktor für Verteidigung
    static BAUZEIT = 60000;             // Bauzeit des Gebäudes in ms
    static FAKTOR_BAUZEIT = 1;          // Faktor für Bauzeit

    constructor() {
        this.name = "Stadtmauer";
        this.level = 0;
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

    get kostenGold() { return this.berechnung(Stadtmauer.BASIS_KOSTEN_GOLD, Stadtmauer.FAKTOR_KOSTEN); }
    get kostenHolz() { return this.berechnung(Stadtmauer.BASIS_KOSTEN_HOLZ, Stadtmauer.FAKTOR_KOSTEN); }
    get kostenStein() { return this.berechnung(Stadtmauer.BASIS_KOSTEN_STEIN, Stadtmauer.FAKTOR_KOSTEN); }
    get bauzeit() { return this.berechnung(Stadtmauer.BAUZEIT, Stadtmauer.FAKTOR_BAUZEIT); }

    get verteidigung() {
        if (this.level <= 0) return 0;
        return this.berechnung(Stadtmauer.BASIS_VERTEIDIGUNG, Stadtmauer.FAKTOR_VERTEIDIGUNG);
    }
}