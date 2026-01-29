// js/models/einheiten.js

import { Schwert } from "./units/schwert.js";
import { Speer } from "./units/speer.js";
import { Bogen } from "./units/bogen.js";

export class Einheiten {
    constructor() {
        this.unitsSchwert = [];
        this.unitsSpeer = [];
        this.unitsBogen = [];
        this.bauschleife = [];
    }

    // --- Spielstände angleichen ---
    applyData(data) {
        // Vermisch alten Spielstand mit neuem, falls neue Variablen dazu gekommen sind.
        if (!data) return;
    
        // Mit Hilfsfunktion Werte der Einheiten übernehmen und Leichen filtern
        this.unitsSchwert = this._loadUnitArray(data.unitsSchwert, Schwert);
        this.unitsSpeer   = this._loadUnitArray(data.unitsSpeer, Speer);
        this.unitsBogen   = this._loadUnitArray(data.unitsBogen, Bogen);
        this.bauschleife  = data.bauschleife;
    }

    // --- Hilfsfunktion zum laden des Spielstandes ---
    _loadUnitArray(dataArray, UnitClass) {
    if (!dataArray) return [];

    return dataArray
        .map(data => {
            const unit = new UnitClass(); // Erstellt new Schwert(), new Speer() etc.
            unit.applyData(data);
            return unit;
        })
        .filter(unit => unit.hp > 0);
    }

    // --- Einheiten zur Bauschleife hinzufügen ---
    addEinheit(einheit) {
        let fertigZeit = 0;

        if (this.bauschleife.length === 0) {
            fertigZeit = Date.now();
        } else {
            fertigZeit = this.bauschleife[this.bauschleife.length - 1].time;
        }
        
        fertigZeit += einheit.bauzeit;
        this.bauschleife.push( {name: einheit.name, time: fertigZeit} );
    }

    // --- Update Bauschleife ---
    updateBauschleife() {
        while (this.bauschleife.length > 0 && this.bauschleife[0].time <= Date.now()) {
            const fertig = this.bauschleife[0];

            switch (fertig.name) {
                case "Schwertträger": this.unitsSchwert.push(new Schwert()); break;
                case "Speerträger": this.unitsSpeer.push(new Speer()); break;
                case "Bogenschütze": this.unitsBogen.push(new Bogen()); break;
            }

            console.log(`Einheit ${fertig.name} fertig Ausgebildet!`);
            this.bauschleife.shift(); // Erste Element aus Array entfernen
        }
    }

    get anzahlSchwert() { return this.unitsSchwert.length; }
    get anzahlSpeer() { return this.unitsSpeer.length; }
    get anzahlBogen() { return this.unitsBogen.length; }

    // --- Für Abfrage von Werten weiterreichen ---
    get schwert() { return new Schwert(); }
    get speer() { return new Speer(); }
    get bogen() { return new Bogen(); }

    get verteidigungGesamt() {
        // Summiert die Verteidigung von allen Einheiten
        let verteidigung = 0;
        
        verteidigung += this.unitsSchwert.reduce((summe, unit) => summe + unit.verteidigung, 0);
        verteidigung += this.unitsSpeer.reduce((summe, unit) => summe + unit.verteidigung, 0);
        verteidigung += this.unitsBogen.reduce((summe, unit) => summe + unit.verteidigung, 0);

        return verteidigung;
    }

    get angriffGesamt() {
        // Summiert den Angriff von allen Einheiten
        let angriff = 0;
        
        angriff += this.unitsSchwert.reduce((summe, unit) => summe + unit.angriff, 0);
        angriff += this.unitsSpeer.reduce((summe, unit) => summe + unit.angriff, 0);
        angriff += this.unitsBogen.reduce((summe, unit) => summe + unit.angriff, 0);

        return angriff;
    }

    get bauschleifeMenge() { return this.bauschleife.length; }
    get bauschleifeNextName() {
        if (this.bauschleife.length > 0) {
            return this.bauschleife[0].name;
        }
        return "Keine Einheit in Ausbildung";
    }

    get bauschleifeRestZeitSek() {
        if (this.bauschleife.length > 0) {
            return (this.bauschleife[0].time - Date.now() + 1000) / 1000;
        }
        return 0;
    }
}