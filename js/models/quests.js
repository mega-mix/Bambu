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
                    anzahlSpeer: 15,
                    anzahlBogen: 12,
                    // Array.from, um echte Instanzen für die Berechnung zu haben
                    unitsSchwert: Array.from({ length: 10 }, () => new Schwert()),
                    unitsSpeer: Array.from({ length: 15 }, () => new Speer()),
                    unitsBogen: Array.from({ length: 12 }, () => new Bogen())
                },
                bauwerke: {
                    stadtmauer: { verteidigung: 1 }
                },
                beute: { gold: 500, holz: 450, stein: 450 }
            },
            { 
                name: "Ogerhöhle", 
                dauer: 60000, 
                // Struktur exakt wie in der Klasse Stadt
                einheiten: {
                    anzahlSchwert: 25,
                    anzahlSpeer: 15,
                    anzahlBogen: 0,
                    // Array.from, um echte Instanzen für die Berechnung zu haben
                    unitsSchwert: Array.from({ length: 25 }, () => new Schwert()),
                    unitsSpeer: Array.from({ length: 15 }, () => new Speer()),
                    unitsBogen: Array.from({ length: 0 }, () => new Bogen())
                },
                bauwerke: {
                    stadtmauer: { verteidigung: 0 }
                },
                beute: { gold: 675, holz: 750, stein: 750 }
            },
            { 
                name: "Murloc Dorf", 
                dauer: 120000, 
                // Struktur exakt wie in der Klasse Stadt
                einheiten: {
                    anzahlSchwert: 30,
                    anzahlSpeer: 25,
                    anzahlBogen: 20,
                    // Array.from, um echte Instanzen für die Berechnung zu haben
                    unitsSchwert: Array.from({ length: 30 }, () => new Schwert()),
                    unitsSpeer: Array.from({ length: 25 }, () => new Speer()),
                    unitsBogen: Array.from({ length: 20 }, () => new Bogen())
                },
                bauwerke: {
                    stadtmauer: { verteidigung: 2 }
                },
                beute: { gold: 900, holz: 800, stein: 750 }
            }
        ];
    }

    // --- Quest mit Nr abrufen ---
    getQuest(qNr) {
        if (qNr >= 0 && qNr < this.questList.length) { return this.questList[qNr]; }
        return null;
    }


}