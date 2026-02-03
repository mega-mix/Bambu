// js/models/quests.js

export class Quests {
    constructor() {
        this.questList = [
            { name:"Räuberlager", dauer:30000, einheiten:{anzahlSchwert:10, anzahlSpeer:10, anzahlBogen:10}, beute:{gold:500, holz:500, stein:500} },
            { name:"Ogerhöhle", dauer:60000, einheiten:{anzahlSchwert:20, anzahlSpeer:20, anzahlBogen:0}, beute:{gold:800, holz:800, stein:800} }
        ];
    }

    // --- Quest mit Nr abrufen ---
    getQuest(qNr) {
        if (qNr >= 0 && qNr < this.questList.length) { return this.questList[qNr]; }
        return null;
    }


}