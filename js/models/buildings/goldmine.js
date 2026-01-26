// js/models/buildings/goldmine.js

export class Goldmine {
    static MS_PRODUKTION = 30000; // 30 Sekunden

    constructor() {
        this.level = 1;
        this.letzterProduktTick = Date.now();
    }

    load(data) {
        if (!data) return;

        if (data.level) { this.level = data.level; }
        if (data.letzterProduktTick) { this.letzterProduktTick = data.letzterProduktTick; }
    }

    berechnung(basis, faktor) {
        return Math.floor(basis * Math.pow(faktor, this.level - 1));
    }

    levelUp() {
        this.level ++;
    }

    get mengeProTick() { return this.berechnung(5, 1.3); }
    get mengeProMin() { return (60000 / Goldmine.MS_PRODUKTION) * this.mengeProTick; }

    get levelKostenGold() { return this.berechnung(118, 1.8); }
    get levelKostenHolz() { return this.berechnung(133, 1.8); }
    get levelKostenStein() { return this.berechnung(123, 1.8); }

    einsammeln() {
        const vergangeneZeit = Date.now() - this.letzterProduktTick;
        const anzahlTicks = Math.floor(vergangeneZeit / Goldmine.MS_PRODUKTION);

        if (anzahlTicks > 0) {
            const verbrauchteZeit = anzahlTicks * Goldmine.MS_PRODUKTION;
            this.letzterProduktTick += verbrauchteZeit;

            return anzahlTicks * this.mengeProTick;
        }
        
        return 0;
    }
}