// js/models/stadt.js

import { Bauwerke } from "./bauwerke.js";

export class Stadt {
    constructor(name) {
        this.name = name;
        this.bauwerke = new Bauwerke();

    }

    // --- Spielstände angleichen ---
    applyData(data) {
        // Vermisch alten Spielstand mit neuem, falls neue Variablen dazu gekommen sind.
        if (!data) return;

        this.bauwerke.applyData(data.bauwerke);
    }
}