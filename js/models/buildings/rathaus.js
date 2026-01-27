// js/models/buildings/rathaus.js

export class Rathaus {
    static MAX_LEVEL = 2; // Maximales level für das Rathaus

    constructor() {
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

    get levelKostenGold() { return this.berechnung(158, 1.8); }
    get levelKostenHolz() { return this.berechnung(143, 1.8); }
    get levelKostenStein() { return this.berechnung(188, 1.8); }
}