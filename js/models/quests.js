// js/models/quests.js

import { Schwert } from "./units/schwert.js";
import { Speer } from "./units/speer.js";
import { Bogen } from "./units/bogen.js";

export class Quests {
    constructor() {
        this.questList = [
            { 
                name: "Räuberlager", 
                dauer: 30000, 
                // Struktur exakt wie in der Klasse Stadt
                einheiten: {
                    anzahlSchwert: 10,
                    anzahlSpeer: 10,
                    anzahlBogen: 10,
                    // Array.from, um echte Instanzen für die Berechnung zu haben
                    unitsSchwert: Array.from({ length: 10 }, () => new Schwert()),
                    unitsSpeer: Array.from({ length: 10 }, () => new Speer()),
                    unitsBogen: Array.from({ length: 10 }, () => new Bogen())
                },
                bauwerke: {
                    stadtmauer: { verteidigung: 0 }
                },
                beute: { gold: 500, holz: 500, stein: 500 }
            },
            { 
                name: "Ogerhöhle", 
                dauer: 30000, 
                // Struktur exakt wie in der Klasse Stadt
                einheiten: {
                    anzahlSchwert: 15,
                    anzahlSpeer: 10,
                    anzahlBogen: 0,
                    // Array.from, um echte Instanzen für die Berechnung zu haben
                    unitsSchwert: Array.from({ length: 15 }, () => new Schwert()),
                    unitsSpeer: Array.from({ length: 10 }, () => new Speer()),
                    unitsBogen: Array.from({ length: 0 }, () => new Bogen())
                },
                bauwerke: {
                    stadtmauer: { verteidigung: 0 }
                },
                beute: { gold: 500, holz: 500, stein: 500 }
            }
        ];
    }

    // --- Quest mit Nr abrufen ---
    getQuest(qNr) {
        if (qNr >= 0 && qNr < this.questList.length) { return this.questList[qNr]; }
        return null;
    }


}