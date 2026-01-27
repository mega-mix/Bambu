// js/models/buildings/lagerhaus.js

export class Lagerhaus {

    constructor() {
        this.level = 1;
        this.gold = 100;
        this.holz = 100;
        this.stein = 100;
    }

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

    get maxGold() { return this.berechnung(300, 1.5); }
    get maxHolz() { return this.berechnung(300, 1.5); }
    get maxStein() { return this.berechnung(300, 1.5); }

    get levelKostenGold() { return this.berechnung(102, 1.8); }
    get levelKostenHolz() { return this.berechnung(88, 1.8); }
    get levelKostenStein() { return this.berechnung(93, 1.8); }


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