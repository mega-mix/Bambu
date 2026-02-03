// js/models/quests.js

export class Quests {
    constructor() {
        this.questList = [
            { name:"Räuberlager", dauer:30000, angriff:300, verteidigung:500, beute:{gold:500, holz:500, stein:500} },
            { name:"Ogerhöhle", dauer:60000, angriff:450, verteidigung:700, beute:{gold:800, holz:800, stein:800} }
        ];
    }

    // --- Quest mit Nr abrufen ---
    getQuest(qNr) {
        if (qNr >= 0 && qNr < this.questList.length) { return this.questList[qNr]; }
        return null;
    }


}