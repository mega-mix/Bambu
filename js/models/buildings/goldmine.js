// js/models/buildings/goldmine.js

export class Goldmine {
    static MS_PRODUKTION = 30000;       // 30 Sekunden
    static BASIS_ROHSTOFF = 5;          // Grundwert für Rohstoffproduktion
    static FAKTOR_ROHSTOFF = 1.3;       // Faktor für Rohstoffproduktion
    static BASIS_KOSTEN_GOLD = 150;     // Grundwert Goldkosten
    static BASIS_KOSTEN_HOLZ = 250;     // Grundwert Holzkosten
    static BASIS_KOSTEN_STEIN = 200;    // Grundwert Steinkosten
    static FAKTOR_KOSTEN = 1.8;         // Faktor für Kostenrechnung
    static BAUZEIT = 10000;             // Bauzeit des Gebäudes

    constructor() {
        this.name = "Goldmine";
        this.level = 1;
        this.letzterProduktTick = Date.now();
    }

    get tag() { return "BAUWERK"; }

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

    get mengeProTick() {
        if (this.level <= 0) return 0;
        return this.berechnung(Goldmine.BASIS_ROHSTOFF, Goldmine.FAKTOR_ROHSTOFF);
    }
    get mengeProMin() {
        if (this.level <= 0) return 0;
        return (60000 / Goldmine.MS_PRODUKTION) * this.mengeProTick;
    }

    get kostenGold() { return this.berechnung(Goldmine.BASIS_KOSTEN_GOLD, Goldmine.FAKTOR_KOSTEN); }
    get kostenHolz() { return this.berechnung(Goldmine.BASIS_KOSTEN_HOLZ, Goldmine.FAKTOR_KOSTEN); }
    get kostenStein() { return this.berechnung(Goldmine.BASIS_KOSTEN_STEIN, Goldmine.FAKTOR_KOSTEN); }
    get bauzeit() { return Goldmine.BAUZEIT; }

    // --- Rohstoff einsammeln ---
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