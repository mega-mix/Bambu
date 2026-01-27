// js/models/bauwerke.js

import { Goldmine } from "./buildings/goldmine.js";
import { Holzfaeller } from "./buildings/holzfaeller.js";
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
    }
}