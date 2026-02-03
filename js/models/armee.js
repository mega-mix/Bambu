// js/models/Armee.js

import { Schwert } from "./units/schwert.js";
import { Speer } from "./units/speer.js";
import { Bogen } from "./units/bogen.js";

export class Armee {
    /**
     * @param {number} s - Anzahl Schwerter
     * @param {number} p - Anzahl Speere
     * @param {number} b - Anzahl Bogen
     * @param {Einheiten} stadtEinheiten - Die Einheiten-Instanz der Stadt
     */
    constructor(s = 0, p = 0, b = 0, stadtEinheiten = null) {
        this.unitsSchwert = [];
        this.unitsSpeer = [];
        this.unitsBogen = [];
        this.ankunftZeit = 0;
        this.zielId = null;

        // Nur splicten, wenn stadtEinheiten wirklich mitgegeben wurden (beim Start des Marsches)
        if (stadtEinheiten) {
            this.unitsSchwert = stadtEinheiten.unitsSchwert.splice(0, s);
            this.unitsSpeer = stadtEinheiten.unitsSpeer.splice(0, p);
            this.unitsBogen = stadtEinheiten.unitsBogen.splice(0, b);
        }
    }

    // --- Speichersicheres Laden ---
    applyData(data) {
        if (!data) return;
        this.ankunftZeit = data.ankunftZeit || 0;
        this.zielId = data.zielId || null;
        // Nutzt die Ladelogik der Einheiten
        this.unitsSchwert = this._loadUnitArray(data.unitsSchwert, Schwert);
        this.unitsSpeer = this._loadUnitArray(data.unitsSpeer, Speer);
        this.unitsBogen = this._loadUnitArray(data.unitsBogen, Bogen);
    }

    // Hilfsfunktion analog zu einheiten.js
    _loadUnitArray(dataArray, UnitClass) {
        if (!dataArray) return [];
        return dataArray.map(d => {
            const unit = new UnitClass();
            unit.applyData(d);
            return unit;
        });
    }

    // --- Kampfwerte ---
    get anzahlSchwert() { return this.unitsSchwert.length; }
    get anzahlSpeer() { return this.unitsSpeer.length; }
    get anzahlBogen() { return this.unitsBogen.length; }

    get angriffGesamt() {
        let total = 0;
        total += this.unitsSchwert.reduce((sum, u) => sum + u.angriff, 0);
        total += this.unitsSpeer.reduce((sum, u) => sum + u.angriff, 0);
        total += this.unitsBogen.reduce((sum, u) => sum + u.angriff, 0);
        return total;
    }

    // --- Verluste verarbeiten ---
    entferneVerluste(verluste) {
        // Entfernt die angegebene Menge an Einheiten aus den Arrays
        for (let i = 0; i < (verluste.schwert || 0); i++) this.unitsSchwert.pop();
        for (let i = 0; i < (verluste.speer || 0); i++) this.unitsSpeer.pop();
        for (let i = 0; i < (verluste.bogen || 0); i++) this.unitsBogen.pop();
    }
}