// js/models/buildings/rathaus.js

export class Rathaus {
    #level;

    constructor() {
        this.#level = 1;
    }

    get level() {return this.#level;}
}