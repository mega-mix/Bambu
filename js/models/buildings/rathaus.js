// js/models/buildings/rathaus.js

export class Rathaus {
    static MAX_LEVEL = 2; // Maximales level für das Rathaus

    constructor() {
        this.level = 1;
    }

    load(data) {
        if (!data) return;

        if (data.level) { this.level = data.level; }
    }

    berechnung(basis, faktor) {
        return Math.floor(basis * Math.pow(faktor, this.level - 1));
    }

    levelUp() {
        if (this.level < Rathaus.MAX_LEVEL) { this.level++; }
    }

    get levelKostenGold() { return this.berechnung(158, 1.8); }
    get levelKostenHolz() { return this.berechnung(143, 1.8); }
    get levelKostenStein() { return this.berechnung(188, 1.8); }
}