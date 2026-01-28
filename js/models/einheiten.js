// js/models/einheiten.js

import { Schwert } from "./units/schwert.js";

export class Einheiten {
    constructor(kaserne) {
        this.unitsSchwert = [];
        this.unitsSpeer = [];
        this.unitsBogen = [];
        this.kaserne = kaserne;
    }

    // --- Spielstände angleichen ---
    applyData(data) {
        // Vermisch alten Spielstand mit neuem, falls neue Variablen dazu gekommen sind.
        if (!data) return;
    
        // Ein frisches Array erzeugen und mit den alten Daten füllen
        this.unitsSchwert = [];
        if (data.unitsSchwert) {
            this.unitsSchwert = data.unitsSchwert.filter(unit => unit.hp > 0);
        }
    
        this.unitsSpeer = [];
        if (data.unitsSpeer) {
            this.unitsSpeer = data.unitsSpeer.filter(unit => unit.hp > 0);
        }
    
        this.unitsBogen = [];
        if (data.unitsBogen) {
            this.unitsBogen = data.unitsBogen.filter(unit => unit.hp > 0);
        }
    }

    addEinheit(einheit) {
        if (einheit.name === "Schwertkämpfer") { this.unitsSchwert.push(new Schwert()); }
    }

    updateKaserne(kaserne) {
        this.kaserne = kaserne;
    }

    get anzahlSchwert() { return this.unitsSchwert.length; }
    get anzahlSpeer() { return this.unitsSpeer.length; }
    get anzahlBogen() { return this.unitsBogen.length; }

    get schwert() { return new Schwert(); }
}