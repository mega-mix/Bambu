// js/models/quests.js

import { Schwert } from "./units/schwert.js";
import { Speer } from "./units/speer.js";
import { Bogen } from "./units/bogen.js";

export class Quests {
    constructor() {
        this.questList = [
            { 
                name: "Räuberlager", 
                dauer: 300000,
                get dauerSek() { return Math.floor(this.dauer / 1000) % 60; },
                get dauerMin() { return Math.floor(this.dauer / 60000); },
                // Struktur exakt wie in der Klasse Stadt
                einheiten: {
                    anzahlSchwert: 10,
                    anzahlSpeer: 15,
                    anzahlBogen: 12,
                    // Array.from, um echte Instanzen für die Berechnung zu haben
                    unitsSchwert: Array.from({ length: 10 }, () => new Schwert()),
                    unitsSpeer: Array.from({ length: 15 }, () => new Speer()),
                    unitsBogen: Array.from({ length: 12 }, () => new Bogen())
                },
                bauwerke: {
                    stadtmauer: { verteidigung: 100 }
                },
                beute: { gold: 500, holz: 450, stein: 450 }
            },
            { 
                name: "Ogerhöhle", 
                dauer: 450000,
                get dauerSek() { return Math.floor(this.dauer / 1000) % 60; },
                get dauerMin() { return Math.floor(this.dauer / 60000); },
                // Struktur exakt wie in der Klasse Stadt
                einheiten: {
                    anzahlSchwert: 35,
                    anzahlSpeer: 25,
                    anzahlBogen: 0,
                    // Array.from, um echte Instanzen für die Berechnung zu haben
                    unitsSchwert: Array.from({ length: 25 }, () => new Schwert()),
                    unitsSpeer: Array.from({ length: 15 }, () => new Speer()),
                    unitsBogen: Array.from({ length: 0 }, () => new Bogen())
                },
                bauwerke: {
                    stadtmauer: { verteidigung: 120 }
                },
                beute: { gold: 875, holz: 950, stein: 950 }
            },
            { 
                name: "Murloc Dorf", 
                dauer: 600000,
                get dauerSek() { return Math.floor(this.dauer / 1000) % 60; },
                get dauerMin() { return Math.floor(this.dauer / 60000); },
                // Struktur exakt wie in der Klasse Stadt
                einheiten: {
                    anzahlSchwert: 50,
                    anzahlSpeer: 45,
                    anzahlBogen: 40,
                    // Array.from, um echte Instanzen für die Berechnung zu haben
                    unitsSchwert: Array.from({ length: 30 }, () => new Schwert()),
                    unitsSpeer: Array.from({ length: 25 }, () => new Speer()),
                    unitsBogen: Array.from({ length: 20 }, () => new Bogen())
                },
                bauwerke: {
                    stadtmauer: { verteidigung: 150 }
                },
                beute: { gold: 1400, holz: 1300, stein: 1250 }
            }
        ];
    }

    // --- Quest mit Nr abrufen ---
    getQuest(qNr) {
        if (qNr >= 0 && qNr < this.questList.length) { return this.questList[qNr]; }
        return null;
    }


}