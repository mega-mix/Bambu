// js/models/buildings/lagerhaus.js

export class Lagerhaus {
    static BASIS_KOSTEN_GOLD = 200;     // Grundwert Goldkosten
    static BASIS_KOSTEN_HOLZ = 180;      // Grundwert Holzkosten
    static BASIS_KOSTEN_STEIN = 150;     // Grundwert Steinkosten
    static FAKTOR_KOSTEN = 1.8;         // Faktor für Kostenrechnung
    static BASIS_MAX_GOLD = 500;        // Grundwert Lagergröße Gold
    static BASIS_MAX_HOLZ = 500;        // Grundwert Lagergröße Holz
    static BASIS_MAX_STEIN = 500;       // Grundwert Lagergröße Stein
    static FAKTOR_MAX = 1.8;            // Faktor für Lagergröße

    constructor() {
        this.name = "Lagerhaus";
        this.level = 1;
        this.gold = 100;
        this.holz = 100;
        this.stein = 100;
    }

    get tag() { return "BAUWERK"; }

    // --- Abgleich SaveGame ---
    load(data) {
        if (!data) return;

        // Läd Daten vom SaveGame in dieses Objekt
        if (data.level) { this.level = data.level; }
        if (data.gold) { this.gold = data.gold; }
        if (data.holz) { this.holz = data.holz; }
        if (data.stein) { this.stein = data.stein; }
    }
    
    // --- Hilfsrechnung Wert * Level ---
    berechnung(basis, faktor) {
        return Math.floor(basis * Math.pow(faktor, this.level - 1));
    }

    // --- Level erhöhen ---
    levelUp() {
        this.level ++;
    }

    get maxGold() { return this.berechnung(Lagerhaus.BASIS_MAX_GOLD, Lagerhaus.FAKTOR_MAX); }
    get maxHolz() { return this.berechnung(Lagerhaus.BASIS_MAX_HOLZ, Lagerhaus.FAKTOR_MAX); }
    get maxStein() { return this.berechnung(Lagerhaus.BASIS_MAX_STEIN, Lagerhaus.FAKTOR_MAX); }

    get kostenGold() { return this.berechnung(Lagerhaus.BASIS_KOSTEN_GOLD, Lagerhaus.FAKTOR_KOSTEN); }
    get kostenHolz() { return this.berechnung(Lagerhaus.BASIS_KOSTEN_HOLZ, Lagerhaus.FAKTOR_KOSTEN); }
    get kostenStein() { return this.berechnung(Lagerhaus.BASIS_KOSTEN_STEIN, Lagerhaus.FAKTOR_KOSTEN); }


    // ------------------------------
    // ----- Rohstoffe erhalten -----
    // ------------------------------
    addGold(gold) {
        if (gold > 0) {
            this.gold += gold;
            if (this.gold > this.maxGold) {this.gold = this.maxGold;}
        }
    }

    addHolz(holz) {
        if (holz > 0) {
            this.holz += holz;
            if (this.holz > this.maxHolz) {this.holz = this.maxHolz;}
        }
    }

    addStein(stein) {
        if (stein > 0) {
            this.stein += stein;
            if (this.stein > this.maxStein) {this.stein = this.maxStein;}
        }
    }

    
    // ------------------------------
    // ----- Rohstoffe bezahlen -----
    // ------------------------------
    payGold(gold) {
        if (gold > 0 && gold < this.gold) {
            this.gold -= gold;
            return true;   
        }
        return false;
    }

    payHolz(holz) {
        if (holz > 0 && holz < this.holz) {
            this.holz -= holz;
            return true;   
        }
        return false;
    }

    payStein(stein) {
        if (stein > 0 && stein < this.stein) {
            this.stein -= stein;
            return true;   
        }
        return false;
    }
}