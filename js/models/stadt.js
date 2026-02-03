// js/models/stadt.js

import { Bauwerke } from "./bauwerke.js";
import { Einheiten } from "./einheiten.js";
import { Armee } from "./armee.js";

export class Stadt {
    constructor(name) {
        this.name = name;
        this.bauwerke = new Bauwerke();
        this.einheiten = new Einheiten();
        this.marschierendeArmeen = [];
    }

    // --- Spielstände angleichen ---
    applyData(data) {
        // Vermisch alten Spielstand mit neuem, falls neue Variablen dazu gekommen sind.
        if (!data) return;

        this.bauwerke.applyData(data.bauwerke);
        this.einheiten.applyData(data.einheiten);
        
        // Armeen als echte Objekte wiederherstellen
        if (data.marschierendeArmeen) {
            this.marschierendeArmeen = data.marschierendeArmeen.map(aData => {
                const armee = new Armee();
                armee.applyData(aData);
                return armee;
            });
        }
    }

    get verteidigungGesamt() {
        let verteidigung = 0;

        verteidigung += this.bauwerke.stadtmauer.verteidigung;
        verteidigung += this.einheiten.verteidigungGesamt;

        return verteidigung;
    }

    get angriffGesamt() {
        let angriff = 0;

        angriff += this.einheiten.angriffGesamt;

        return angriff;
    }
}