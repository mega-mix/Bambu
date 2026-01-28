// js/models/stadt.js

import { Bauwerke } from "./bauwerke.js";
import { Einheiten } from "./einheiten.js";

export class Stadt {
    constructor(name) {
        this.name = name;
        this.bauwerke = new Bauwerke();
        this.einheiten = new Einheiten();

    }

    // --- Spielstände angleichen ---
    applyData(data) {
        // Vermisch alten Spielstand mit neuem, falls neue Variablen dazu gekommen sind.
        if (!data) return;

        this.bauwerke.applyData(data.bauwerke);
        this.einheiten.applyData(data.einheiten);
    }
}