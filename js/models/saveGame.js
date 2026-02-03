// js/models/saveGame.js

import { Stadt } from "./stadt.js";
import { version } from "../config.js";
import { Quests } from "./quests.js";


// ### Gesamter Spielstand ###

export class SaveGame {
    constructor(player) {
        this.version = version;     // Release Version
        this.playerName = player;
        this.staedte = [];
        this.quests = new Quests();

        this.staedte.push(new Stadt("Hauptstadt"));
        this.aktuelleStadtIndex = 0;
    }

    // --- Spielstände angleichen ---
    applyData(data) {
        // Vermisch alten Spielstand mit neuem, falls neue Variablen dazu gekommen sind.
        if (!data) return;

        if (data.playerName) this.playerName = data.playerName;
        if (data.aktuelleStadtIndex) this.aktuelleStadtIndex = data.aktuelleStadtIndex;

        // Städte Array abgleichen
        if (data.staedte && Array.isArray(data.staedte)) {
            this.staedte = [];

            data.staedte.forEach(stadtDaten => {
                const stadt = new Stadt(stadtDaten.name);
                stadt.applyData(stadtDaten);
                this.staedte.push(stadt);
            });
        }

        if (data.quests) this.quests = data.quests;
    }

    get aktuelleStadt() {
        return this.staedte[this.aktuelleStadtIndex];
    }
}