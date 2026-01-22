// js/models/buildings/holzfaeller.js

export class Holzfaeller {
    #level;
    #mengeProTick;
    #msProduktion;
    #letzterProduktTick;

    constructor() {
        this.#level = 1;
        this.#mengeProTick = 5;
        this.#msProduktion = 30 * 1000;
        this.#letzterProduktTick = Date.now();
    }

    get level() {return this.#level;}

    einsammeln() {
        const vergangeneZeit = Date.now() - this.#letzterProduktTick;
        const anzahlTicks = Math.floor(vergangeneZeit / this.#msProduktion);

        if (anzahlTicks > 0) {
            const verbrauchteZeit = anzahlTicks * this.#msProduktion;
            this.#letzterProduktTick += verbrauchteZeit;

            return anzahlTicks * this.#mengeProTick;
        }
        
        return 0;
    }
}