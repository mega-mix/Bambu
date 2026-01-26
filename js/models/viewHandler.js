// js/model/viewHandler.js

export class ViewHandler {
    constructor(saveGame) {
        this.startName = document.getElementById("startName");
        this.topInfo = document.getElementById("topInfo");

        this.mySaveGame = saveGame;
        this.cache = [];
    }

    switchView(viewName) {
        // 1. Alle Views verstecken
        document.querySelectorAll(".view").forEach(div => {
            div.classList.remove("active");
        });

        // 2. Den gewünschten View anzeigen
        const targetView = document.getElementById(viewName);
        if (targetView) {
            targetView.classList.add("active");
        }
    }

    aktSaveGame(saveGame) {
        this.mySaveGame = saveGame;
    }

    setGame(saveGame) {
        this.mySaveGame = saveGame;
        
        // 1. Text Cache
        const elements = document.querySelectorAll("[data-bind]");
        
        this.cache = []; // Reset
        elements.forEach(el => {
            this.cache.push({
                element: el,          // Das HTML-Element selbst
                path: el.dataset.bind // Der Pfad z.B. "lagerhaus.gold"
            });
        });

        // 2. Kosten Prüfung
        this.buttonCache = [];
        document.querySelectorAll("[data-check-cost]").forEach(btn => {
            this.buttonCache.push({
                element: btn,
                targetName: btn.dataset.checkCost
            });
        });

        this.update();
    }

    update() {
        if (!this.mySaveGame) return;

        // 1. Text aktualisieren
        this.cache.forEach(item => {
            const wert = this.resolvePath(item.path, this.mySaveGame);
            
            // Nur schreiben wenn sich etwas geändert hat
            if (item.element.innerText != wert) {
                 if (typeof wert === 'number') {
                    item.element.innerText = Math.floor(wert);
                } else {
                    item.element.innerText = wert;
                }
            }
        });

        // 2. Buttons prüfen
        const lager = this.mySaveGame.lagerhaus;

        this.buttonCache.forEach(item => {
            // Wir holen uns das Gebäude-Objekt
            const gebaeude = this.mySaveGame[item.targetName];

            if (gebaeude) {
                // Prüfen ob wir es uns leisten können
                const kannKaufen = this.checkAffordability(lager, gebaeude);
                
                // Button aktivieren oder deaktivieren
                // disabled = true (wenn man es NICHT kaufen kann)
                item.element.disabled = !kannKaufen;
            }
        });
    }

    resolvePath(path, obj) {
        return path.split('.').reduce((prev, curr) => {
            return prev ? prev[curr] : undefined;
        }, obj);
    }

    checkAffordability(lager, gebaeude) {
        // Wir prüfen sicherheitshalber ob Kosten definiert sind. 
        // Falls undefined, nehmen wir 0 an.
        const kostenGold = gebaeude.levelKostenGold || 0;
        const kostenHolz = gebaeude.levelKostenHolz || 0;
        const kostenStein = gebaeude.levelKostenStein || 0;

        return (
            lager.gold >= kostenGold &&
            lager.holz >= kostenHolz &&
            lager.stein >= kostenStein
        );
    }

    setTopInfo(info) {
        this.topInfo.innerHTML = info;
    }

    setStartName(name) {
        this.startName.innerHTML = name;
    }
}