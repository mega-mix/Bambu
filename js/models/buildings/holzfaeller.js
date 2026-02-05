// js/models/buildings/holzfaeller.js

export class Holzfaeller {
    static MS_PRODUKTION = 30000;       // 30 Sekunden
    static BASIS_ROHSTOFF = 5;          // Grundwert für Rohstoffproduktion
    static FAKTOR_ROHSTOFF = 1.6;       // Faktor für Rohstoffproduktion
    static BASIS_KOSTEN_GOLD = 250;     // Grundwert Goldkosten
    static BASIS_KOSTEN_HOLZ = 150;     // Grundwert Holzkosten
    static BASIS_KOSTEN_STEIN = 200;    // Grundwert Steinkosten
    static FAKTOR_KOSTEN = 1.7;         // Faktor für Kostenrechnung
    static BAUZEIT = 60000;             // Bauzeit des Gebäudes in ms
    static FAKTOR_BAUZEIT = 1.2;        // Faktor für Bauzeit

    constructor() {
        this.name = "Holzfäller";
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
        return this.berechnung(Holzfaeller.BASIS_ROHSTOFF, Holzfaeller.FAKTOR_ROHSTOFF);
    }
    get mengeProMin() {
        if (this.level <= 0) return 0;
        return (60000 / Holzfaeller.MS_PRODUKTION) * this.mengeProTick;
    }

    get kostenGold() { return this.berechnung(Holzfaeller.BASIS_KOSTEN_GOLD, Holzfaeller.FAKTOR_KOSTEN); }
    get kostenHolz() { return this.berechnung(Holzfaeller.BASIS_KOSTEN_HOLZ, Holzfaeller.FAKTOR_KOSTEN); }
    get kostenStein() { return this.berechnung(Holzfaeller.BASIS_KOSTEN_STEIN, Holzfaeller.FAKTOR_KOSTEN); }
    get bauzeit() { return this.berechnung(Holzfaeller.BAUZEIT, Holzfaeller.FAKTOR_BAUZEIT); }

    // --- Rohstoff einsammeln ---
    einsammeln() {
        const vergangeneZeit = Date.now() - this.letzterProduktTick;
        const anzahlTicks = Math.floor(vergangeneZeit / Holzfaeller.MS_PRODUKTION);

        if (anzahlTicks > 0) {
            const verbrauchteZeit = anzahlTicks * Holzfaeller.MS_PRODUKTION;
            this.letzterProduktTick += verbrauchteZeit;

            return anzahlTicks * this.mengeProTick;
        }
        
        return 0;
    }
}