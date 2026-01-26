// js/models/buildings/stadtmauer.js

export class Stadtmauer {
    constructor() {
        this.level = 0;
    }

    load(data) {
        if (!data) return;

        if (data.level) { this.level = data.level; }
    }
}