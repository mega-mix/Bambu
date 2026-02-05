// js/models/einheiten.js

import { Schwert } from "./units/schwert.js";
import { Speer } from "./units/speer.js";
import { Bogen } from "./units/bogen.js";

export class Einheiten {
    constructor() {
        this.unitsSchwert = [];
        this.unitsSpeer = [];
        this.unitsBogen = [];
        this.ausbildungsschleife = [];
    }

    // --- Spielstände angleichen ---
    applyData(data) {
        // Vermisch alten Spielstand mit neuem, falls neue Variablen dazu gekommen sind.
        if (!data) return;
    
        // Mit Hilfsfunktion Werte der Einheiten übernehmen und Leichen filtern
        this.unitsSchwert = this._loadUnitArray(data.unitsSchwert, Schwert);
        this.unitsSpeer   = this._loadUnitArray(data.unitsSpeer, Speer);
        this.unitsBogen   = this._loadUnitArray(data.unitsBogen, Bogen);
        this.ausbildungsschleife  = data.ausbildungsschleife || [];
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

    // --- Einheiten zur Ausbildungsschleife hinzufügen ---
    addEinheit(einheit) {
        const now = Date.now();
        // SICHERHEIT: Fallback auf 0, falls dauer fehlt. Mal 1000 für Sekunden -> ms
        const dauerMs = einheit.bauzeit; 
    
        const index = this.ausbildungsschleife.findIndex(e => e.name === einheit.name);

        if (index !== -1) {
            // FALL A: Stapeln
            const gruppe = this.ausbildungsschleife[index];
            gruppe.anzahl++;
            gruppe.groupEndzeit += dauerMs;

            // Ripple-Effect für nachfolgende
            for (let i = index + 1; i < this.ausbildungsschleife.length; i++) {
                this.ausbildungsschleife[i].nextUnitEndzeit += dauerMs;
                this.ausbildungsschleife[i].groupEndzeit += dauerMs;
            }
        } else {
            // FALL B: Neu
            const letztesElement = this.ausbildungsschleife[this.ausbildungsschleife.length - 1];
            const startZeit = letztesElement ? letztesElement.groupEndzeit : now;
        
            this.ausbildungsschleife.push({
                name: einheit.name,
                anzahl: 1,
                einzelDauer: dauerMs,
                nextUnitEndzeit: startZeit + dauerMs, 
                groupEndzeit: startZeit + dauerMs 
            });
        }
    }

    // --- Update Ausbildungsschleife ---
    updateAusbildungsschleife() {
        // while statt if, um bei Lag mehrere Einheiten sofort abzuarbeiten
        while (this.ausbildungsschleife.length > 0) {
            const gruppe = this.ausbildungsschleife[0];
            const now = Date.now();

            // Wenn Zeit noch nicht reif, brich die ganze Schleife ab
            if (now < gruppe.nextUnitEndzeit) break;

            // 1. Einheit tatsächlich erstellen und speichern!
            this.spawnEinheit(gruppe.name);
            console.log(gruppe.name + " fertiggestellt.");

            // 2. Zähler verringern
            gruppe.anzahl--;

            if (gruppe.anzahl > 0) {
                // Nächste Einheit der Gruppe anvisieren
                gruppe.nextUnitEndzeit += gruppe.einzelDauer;
            } else {
                // Gruppe entfernen
                this.ausbildungsschleife.shift();
                // Kein Ripple-Update nötig, da absolute Zeiten verwendet werden
            }
        }
    }

    // --- Hilfsfunktion zum Spawnen ---
    spawnEinheit(name) {
        // Hier musst du mappen. Strings sind dumm, sie wissen nicht, welche Klasse sie sind.
        switch (name) {
            case this.schwert.name:
                this.unitsSchwert.push(new Schwert());
                break;
            case this.speer.name:
                this.unitsSpeer.push(new Speer());
                break;
            case this.bogen.name:
                this.unitsBogen.push(new Bogen());
                break;
            default:
                console.warn("Unbekannter Einheitentyp in Ausbildungsschleife:", name);
        }
    }

    // --- Abfrage ob Ausbildungsschleife voll ist ---
    isAusbildungsschleifeVoll() {
        if (this.ausbildungsschleife.length < 3) { return false; }
        return true;
    }

    // --- Abfrage ob Ausbildungsschleife leer ist ---
    isAusbildungsschleifeLeer() {
        if (this.ausbildungsschleife.length < 1) { return true; }
        return false;
    }

    // --- Abfrage ob Einheitentyp schon in Ausbildungsschleife ist ---
    isEinheitInSchleife(einheit) {
        return this.ausbildungsschleife.some(element => element.name === einheit.name);
    }

    // --- Entfernt Verluste nach Kampf ---
    entferneVerluste(verlustObjekt) {
        for(let i = 0; i < verlustObjekt.schwert; i++) this.unitsSchwert.pop();
        for(let i = 0; i < verlustObjekt.speer; i++) this.unitsSpeer.pop();
        for(let i = 0; i < verlustObjekt.bogen; i++) this.unitsBogen.pop();
    }

    // --- Rückkehrende Truppen hinzufügen ---
    rueckkehrTruppen(ueberlebendeArmee) {
        this.unitsSchwert.push(...ueberlebendeArmee.unitsSchwert);
        this.unitsSpeer.push(...ueberlebendeArmee.unitsSpeer);
        this.unitsBogen.push(...ueberlebendeArmee.unitsBogen);
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

    // --- Werte Ausbildungsschleife ---
    get ausbildungsschleifeFirstMenge() {
        if (this.ausbildungsschleife.length > 0) {
            return `${this.ausbildungsschleife[0].anzahl} Stk.`;
        }
        return "";
    }
    get ausbildungsschleifeSecondMenge() {
        if (this.ausbildungsschleife.length > 1) {
            return `${this.ausbildungsschleife[1].anzahl} Stk.`;
        }
        return "";
    }
    get ausbildungsschleifeThirdMenge() {
        if (this.ausbildungsschleife.length > 2) {
            return `${this.ausbildungsschleife[2].anzahl} Stk.`;
        }
        return "";
    }
    get ausbildungsschleifeFirstName() {
        if (this.ausbildungsschleife.length > 0) {
            return this.ausbildungsschleife[0].name;
        }
        return "Keine Einheit in Ausbildung.";
    }
    get ausbildungsschleifeSecondName() {
        if (this.ausbildungsschleife.length > 1) {
            return this.ausbildungsschleife[1].name;
        }
        return "";
    }
    get ausbildungsschleifeThirdName() {
        if (this.ausbildungsschleife.length > 2) {
            return this.ausbildungsschleife[2].name;
        }
        return "";
    }
    get ausbildungsschleifeFirstRestZeitSek() {
        let string = "";
        if (this.ausbildungsschleife.length > 0) {
            const diff = this.ausbildungsschleife[0].nextUnitEndzeit - Date.now();
            // Math.max(0, ...) verhindert negative Zahlen bei Lag
            string = `${Math.floor(Math.max(0, diff) / 1000 + 1)} Sek.`;
            if (this.ausbildungsschleife[0].anzahl > 1) {
                const diffGrp = this.ausbildungsschleife[0].groupEndzeit - Date.now();
                // Math.max(0, ...) verhindert negative Zahlen bei Lag
                string = string + ` / ${Math.floor(Math.max(0, diffGrp) / 1000 + 1)} Sek.`;
            }
        }
        
        return string;
    }
    get ausbildungsschleifeSecondRestZeitSek() {
        let string = "";
        if (this.ausbildungsschleife.length > 1) {
            const diff = this.ausbildungsschleife[1].nextUnitEndzeit - Date.now();
            // Math.max(0, ...) verhindert negative Zahlen bei Lag
            string = `${Math.floor(Math.max(0, diff) / 1000 + 1)} Sek.`;
            if (this.ausbildungsschleife[1].anzahl > 1) {
                const diffGrp = this.ausbildungsschleife[1].groupEndzeit - Date.now();
                // Math.max(0, ...) verhindert negative Zahlen bei Lag
                string = string + ` / ${Math.floor(Math.max(0, diffGrp) / 1000 + 1)} Sek.`;
            }
        }
        
        return string;
    }
    get ausbildungsschleifeThirdRestZeitSek() {
        let string = "";
        if (this.ausbildungsschleife.length > 2) {
            const diff = this.ausbildungsschleife[2].nextUnitEndzeit - Date.now();
            // Math.max(0, ...) verhindert negative Zahlen bei Lag
            string = `${Math.floor(Math.max(0, diff) / 1000 + 1)} Sek.`;
            if (this.ausbildungsschleife[2].anzahl > 1) {
                const diffGrp = this.ausbildungsschleife[2].groupEndzeit - Date.now();
                // Math.max(0, ...) verhindert negative Zahlen bei Lag
                string = string + ` / ${Math.floor(Math.max(0, diffGrp) / 1000 + 1)} Sek.`;
            }
        }
        
        return string;
    }

}
