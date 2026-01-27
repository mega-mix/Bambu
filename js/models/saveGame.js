// js/models/saveGame.js

import { Stadt } from "./stadt.js";


// ### Gesamter Spielstand ###

export class SaveGame {
    constructor(player) {
        this.playerName = player;
        this.staedte = [];

        this.staedte.push(new Stadt("Hauptstadt"));
        this.aktuelleStadtIndex = 0;
    }

    // --- Spielstände angleichen ---
    applyData(data) {
        // Vermisch alten Spielstand mit neuem, falls neue Variablen dazu gekommen sind.
        if (!data) return;

        this.staedte[0].applyData(data.staedte[0]);
    }

    get aktuelleStadt() {
        return this.staedte[this.aktuelleStadtIndex];
    }
}