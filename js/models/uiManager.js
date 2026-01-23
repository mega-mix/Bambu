// js/uiManager.js

export class UIManager {
    constructor() {
        this.actions = {};

        // EIN einziger Listener für die ganze Seite (oder einen Container)
        document.body.addEventListener("click", (event) => {
            
            // 1. Suche das nächste Element mit data-action (hochwandernd)
            const target = event.target.closest("[data-action]");

            // 2. Nichts gefunden? Abbruch.
            if (!target) return;

            // 3. Den Namen der Action holen
            const actionName = target.dataset.action;

            // 4. Prüfen, ob wir eine Funktion dafür haben
            if (this.actions[actionName]) {
                // Funktion ausführen!
                this.actions[actionName](event); 
            } else {
                console.warn(`Keine Funktion für Action '${actionName}' hinterlegt!`);
            }
        });
    }

    /**
     * Hier füttern wir den Manager mit Logik
     * @param {Object} actionMap - { "HTMLName": funktion }
     */
    registerActions(actionMap) {
        // Wir fügen die neuen Aktionen zu den bestehenden hinzu
        Object.assign(this.actions, actionMap);
    }
}