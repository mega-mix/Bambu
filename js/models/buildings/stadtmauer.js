// js/models/buildings/stadtmauer.js

export class Stadtmauer {
    constructor() {
        this.level = 0;
    }

    // --- Abgleich SaveGame ---
    load(data) {
        if (!data) return;

        // Läd Daten vom SaveGame in dieses Objekt
        if (data.level) { this.level = data.level; }
    }

    // --- Level erhöhen ---
    levelUp() {
        this.level ++;
    }
}