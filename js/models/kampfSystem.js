// js/models/kampfSystem.js

export class KampfSystem {
    constructor() {
        // Bonusfaktor für den Vorteil (z.B. 30% mehr Stärke)
        this.COUNTER_BONUS = 1.3;
        // Mindestverlustrate (5%)
        this.MIN_LOSS_RATE = 0.05;
        // Maximale Schwankung (±10%)
        this.VARIANCE = 0.1;
    }

    /**
     * Berechnet einen Kampf zwischen Angreifer und Verteidiger
     * @param {Einheiten} angreifer - Die Einheiten-Instanz des Angreifers
     * @param {Stadt} verteidigerStadt - Die Stadt-Instanz des Verteidigers
     */
    berechneKampf(angreifer, verteidigerStadt) {
        const verteidiger = verteidigerStadt.einheiten;
        const mauerBonus = verteidigerStadt.bauwerke.stadtmauer.verteidigung;

        // 1. Kampfstärken berechnen (inkl. Counter-System)
        const aPower = this._getAdjustedPower(angreifer, verteidiger, "angriff");
        const vPower = this._getAdjustedPower(verteidiger, angreifer, "verteidigung") + mauerBonus;

        const sieg = aPower > vPower;

        // 2. Basis-Verlustrate ermitteln
        // Wenn A gewinnt: Rate = V / A. Wenn V gewinnt: Rate = A / V.
        let lossRate = sieg ? (vPower / aPower) : (aPower / vPower);

        // 3. Schwankung hinzufügen (Zufall ±10%)
        const randomShift = 1 + (Math.random() * this.VARIANCE * 2 - this.VARIANCE);
        lossRate = Math.min(0.95, Math.max(this.MIN_LOSS_RATE, lossRate * randomShift));

        // 4. Verluste anwenden
        const result = {
            win: sieg,
            attackerLosses: this._calculateLosses(angreifer, lossRate, sieg ? 1 : 0.8),
            defenderLosses: this._calculateLosses(verteidiger, sieg ? 1 : lossRate, sieg ? 0.8 : 1)
        };

        return result;
    }

    /**
     * Berechnet die Stärke unter Berücksichtigung der Counter-Vorteile
     * Schwert > Bogen > Speer > Schwert
     */
    _getAdjustedPower(checkEinheiten, gegnerEinheiten, typ) {
        let total = 0;

        // Hilfe: counts holen
        const enemy = {
            schwert: gegnerEinheiten.anzahlSchwert,
            speer: gegnerEinheiten.anzahlSpeer,
            bogen: gegnerEinheiten.anzahlBogen
        };

        // Schwerter (Bonus gegen Bogen)
        checkEinheiten.unitsSchwert.forEach(u => {
            let power = u[typ];
            if (enemy.bogen > enemy.schwert + enemy.speer) power *= this.COUNTER_BONUS;
            total += power;
        });

        // Speere (Bonus gegen Schwert)
        checkEinheiten.unitsSpeer.forEach(u => {
            let power = u[typ];
            if (enemy.schwert > enemy.speer + enemy.bogen) power *= this.COUNTER_BONUS;
            total += power;
        });

        // Bogen (Bonus gegen Speer)
        checkEinheiten.unitsBogen.forEach(u => {
            let power = u[typ];
            if (enemy.speer > enemy.schwert + enemy.bogen) power *= this.COUNTER_BONUS;
            total += power;
        });

        return total;
    }

    _calculateLosses(einheitenInstanz, rate, forceMultiplier) {
        const finalRate = rate * forceMultiplier;
        
        const dead = {
            schwert: Math.floor(einheitenInstanz.anzahlSchwert * finalRate),
            speer: Math.floor(einheitenInstanz.anzahlSpeer * finalRate),
            bogen: Math.floor(einheitenInstanz.anzahlBogen * finalRate)
        };

        return dead;
    }
}