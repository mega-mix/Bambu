// js/models/saveGame.js

import { Goldmine } from "./buildings/goldmine.js";
import { Lagerhaus } from "./buildings/lagerhaus.js";
import { Rathaus } from "./buildings/rathaus.js";

export class SaveGame {
    constructor() {
        this.rathaus = new Rathaus();
        this.lagerhaus = new Lagerhaus();
        this.goldmine = new Goldmine();
    }
}