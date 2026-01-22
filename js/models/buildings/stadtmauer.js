// js/models/buildings/stadtmauer.js

export class Stadtmauer {
    #level;

    constructor() {
        this.#level = 0;
    }

    get level() {return this.#level;}
}