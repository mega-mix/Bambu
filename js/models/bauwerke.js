// js/models/bauwerke.js

import { Goldmine } from "./buildings/goldmine.js";
import { Holzfaeller } from "./buildings/holzfaeller.js";
import { Kaserne } from "./buildings/kaserne.js";
import { Lagerhaus } from "./buildings/lagerhaus.js";
import { Rathaus } from "./buildings/rathaus.js";
import { Stadtmauer } from "./buildings/stadtmauer.js";
import { Steinbruch } from "./buildings/steinbruch.js";

export class Bauwerke {
    constructor() {
        this.rathaus = new Rathaus();
        this.lagerhaus = new Lagerhaus();
        this.goldmine = new Goldmine();
        this.holzfaeller = new Holzfaeller();
        this.steinbruch = new Steinbruch();
        this.stadtmauer = new Stadtmauer();
        this.kaserne = new Kaserne();
        this.bauschleife = [];
    }

    // --- Spielstände angleichen ---
    applyData(data) {
        // Vermisch alten Spielstand mit neuem, falls neue Variablen dazu gekommen sind.
        if (!data) return;

        // Ein frisches Bauwerk erzeugen und mit den alten Daten füllen
        this.rathaus = new Rathaus();
        if (data.rathaus) { this.rathaus.load(data.rathaus); }

        this.lagerhaus = new Lagerhaus();
        if (data.lagerhaus) { this.lagerhaus.load(data.lagerhaus); }

        this.goldmine = new Goldmine();
        if (data.goldmine) { this.goldmine.load(data.goldmine); }

        this.holzfaeller = new Holzfaeller();
        if (data.holzfaeller) { this.holzfaeller.load(data.holzfaeller); }

        this.steinbruch = new Steinbruch();
        if (data.steinbruch) { this.steinbruch.load(data.steinbruch); }

        this.stadtmauer = new Stadtmauer();
        if (data.stadtmauer) { this.stadtmauer.load(data.stadtmauer); }

        this.kaserne = new Kaserne();
        if (data.kaserne) { this.kaserne.load(data.kaserne); }

        this.bauschleife  = data.bauschleife;
    }

    // --- Bauwerk zur Bauschleife hinzufügen ---
    addBauwerk(gebaeude) {
        let fertigZeit = 0;

        if (this.bauschleife.length === 0) {
            fertigZeit = Date.now();
        } else {
            fertigZeit = this.bauschleife[this.bauschleife.length - 1].time;
        }
        
        fertigZeit += gebaeude.bauzeit;
        this.bauschleife.push( {name: gebaeude.name, time: fertigZeit, levelToGo: gebaeude.level + 1} );
    }

    // --- Update Bauschleife ---
    updateBauschleife() {
        while (this.bauschleife.length > 0 && this.bauschleife[0].time <= Date.now()) {
            const gebaeude = this.bauschleife[0];
            let objName = this._nameToKey(gebaeude.name.toLowerCase());
            this[objName].levelUp();
    
            console.log(`Bauwerk ${gebaeude.name} fertiggestellt!`);
            this.bauschleife.shift(); // Erste Element aus Array entfernen
        }
    }

    // --- Abfrage ob Bauschleife voll ist ---
    isBauschleifeVoll() {
        if (this.bauschleife.length < 2) { return false; }
        return true;
    }

    // --- Abfrage ob Bauschleife leer ist ---
    isBauschleifeLeer() {
        if (this.bauschleife.length < 1) { return true; }
        return false;
    }

    // --- Prüft ob Gebäude in Bauschleife ist ---
    isGebaeudeInBauschleife(gebaeudeName) {
        return this.bauschleife.some(element => element.name === gebaeudeName);
    }

    // --- Hilfsfunktion Sonderzeichen ersetzen ---
    _nameToKey(name) {
        return name.toLowerCase()
            .replace(/ä/g, 'ae')
            .replace(/ö/g, 'oe')
            .replace(/ü/g, 'ue')
            .replace(/ß/g, 'ss')
            .replace(/ /g, '');
    }

    // --- Werte Bauschleife ---
    get bauschleifeFirstName() {
        if (this.bauschleife.length > 0) {
            return this.bauschleife[0].name;
        }
        return "Kein Gebäude im Bau.";
    }
    get bauschleifeSecondName() {
        if (this.bauschleife.length > 1) {
            return this.bauschleife[1].name;
        }
        return "";
    }
    get bauschleifeFirstRestZeitSek() {
        if (this.bauschleife.length > 0) {
            return `${Math.floor((this.bauschleife[0].time - Date.now() + 1000) / 1000)} Sek.`;
        }
        return "";
    }
    get bauschleifeSecondRestZeitSek() {
        if (this.bauschleife.length > 1) {
            return `${Math.floor((this.bauschleife[1].time - Date.now() + 1000) / 1000)} Sek.`;
        }
        return "";
    }
    get bauschleifeFirstLevelToGo() {
        if (this.bauschleife.length > 0) {
            return `Stufe ${this.bauschleife[0].levelToGo}`;
        }
        return "";
    }
    get bauschleifeSecondLevelToGo() {
        if (this.bauschleife.length > 1) {
            return `Stufe ${this.bauschleife[1].levelToGo}`;
        }
        return "";
    }
}

// ToDo:
// Wenn Bauwerk Stufe 1 in Schleife, dann soll gleiches Bauwerk Stufe 2 auch hinzugefügt werden können.