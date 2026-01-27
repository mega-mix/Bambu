// js/models/buildings/steinbruch.js

export class Steinbruch {
    static MS_PRODUKTION = 30000; // 30 Sekunden

    constructor() {
        this.level = 1;
        this.letzterProduktTick = Date.now();
    }

    // --- Abgleich SaveGame ---
    load(data) {
        if (!data) return;

        // Läd Daten vom SaveGame in dieses Objekt
        if (data.level) { this.level = data.level; }
        if (data.letzterProduktTick) { this.letzterProduktTick = data.letzterProduktTick; }
    }

    // --- Hilfsrechnung Wert * Level ---
    berechnung(basis, faktor) {
        return Math.floor(basis * Math.pow(faktor, this.level - 1));
    }

    // --- Level erhöhen ---
    levelUp() {
        this.level ++;
    }

    get mengeProTick() { return this.berechnung(5, 1.3); }
    get mengeProMin() { return (60000 / Steinbruch.MS_PRODUKTION) * this.mengeProTick; }

    get levelKostenGold() { return this.berechnung(96, 1.8); }
    get levelKostenHolz() { return this.berechnung(112, 1.8); }
    get levelKostenStein() { return this.berechnung(90, 1.8); }

    // --- Rohstoff einsammeln ---
    einsammeln() {
        const vergangeneZeit = Date.now() - this.letzterProduktTick;
        const anzahlTicks = Math.floor(vergangeneZeit / Steinbruch.MS_PRODUKTION);

        if (anzahlTicks > 0) {
            const verbrauchteZeit = anzahlTicks * Steinbruch.MS_PRODUKTION;
            this.letzterProduktTick += verbrauchteZeit;

            return anzahlTicks * this.mengeProTick;
        }
        
        return 0;
    }
}