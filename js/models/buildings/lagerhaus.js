// js/models/buildings/lagerhaus.js

export class Lagerhaus {

    constructor() {
        this.level = 1;
        this.gold = 100;
        this.holz = 100;
        this.stein = 100;
        this.maxGold = 500;
        this.maxHolz = 500;
        this.maxStein = 500;
        this.faktorLager = 1;
        this.levelKostenGold = 25;
        this.levelKostenHolz = 25;
        this.levelKostenStein = 25;
    }
    
    levelUp() {
        this.level ++;
        // Max Lagerstand neu berechnen
        // Level Kosten neu berechnen
    }

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