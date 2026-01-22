// js/models/saveGame.js

import { Goldmine } from "./buildings/goldmine.js";
import { Holzfaeller } from "./buildings/holzfaeller.js";
import { Lagerhaus } from "./buildings/lagerhaus.js";
import { Rathaus } from "./buildings/rathaus.js";
import { Stadtmauer } from "./buildings/Stadtmauer.js";
import { Steinbruch } from "./buildings/steinbruch.js";

export class SaveGame {
    constructor() {
        this.rathaus = new Rathaus();
        this.lagerhaus = new Lagerhaus();
        this.goldmine = new Goldmine();
        this.holzfaeller = new Holzfaeller();
        this.steinbruch = new Steinbruch();
        this.stadtmauer = new Stadtmauer();
    }

    applyData(data) {
        // Vermisch alten Spielstand mit neuem, falls neue Variablen dazu gekommen sind.
        if (!data) return;

        Object.assign(this, data);

        // Ein frisches Bauwerk erzeugen und mit den alten Daten füllen
        if (data.rathaus) {
            this.rathaus = new Rathaus(); // Frisch (mit neuen Variablen)
            Object.assign(this.rathaus, data.rathaus); // Alte Daten reinmischen
        }

        if (data.lagerhaus) {
            this.lagerhaus = new Lagerhaus();
            Object.assign(this.lagerhaus, data.lagerhaus);
        }

        if (data.goldmine) {
            this.goldmine = new Goldmine();
            Object.assign(this.goldmine, data.goldmine);
        }

        if (data.holzfaeller) {
            this.holzfaeller = new Holzfaeller();
            Object.assign(this.holzfaeller, data.holzfaeller);
        }

        if (data.steinbruch) {
            this.steinbruch = new Steinbruch();
            Object.assign(this.steinbruch, data.steinbruch);
        }

        if (data.stadtmauer) {
            this.stadtmauer = new Stadtmauer();
            Object.assign(this.stadtmauer, data.stadtmauer);
        }
    }
}