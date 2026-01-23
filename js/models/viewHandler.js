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
        this.update();
    }

    setGame(saveGame) {
        this.mySaveGame = saveGame;
        
        // 1. NUR EINMAL SUCHEN: Wir scannen das HTML und speichern die Referenzen
        const elements = document.querySelectorAll("[data-bind]");
        
        this.cache = []; // Reset
        elements.forEach(el => {
            this.cache.push({
                element: el,          // Das HTML-Element selbst
                path: el.dataset.bind // Der Pfad z.B. "lagerhaus.gold"
            });
        });

        this.update();
    }

    update() {
        if (!this.mySaveGame) return;

        // 2. SCHNELL: Wir iterieren nur noch über unser Array (kein DOM-Search mehr!)
        this.cache.forEach(item => {
            const wert = this.resolvePath(item.path, this.mySaveGame);
            
            // Kleiner Performance-Trick: Nur schreiben, wenn sich der Wert geändert hat
            // Das schont den Browser extrem.
            if (item.element.innerText != wert) {
                 if (typeof wert === 'number') {
                    item.element.innerText = Math.floor(wert);
                } else {
                    item.element.innerText = wert;
                }
            }
        });
    }

    resolvePath(path, obj) {
        return path.split('.').reduce((prev, curr) => {
            return prev ? prev[curr] : undefined;
        }, obj);
    }

    setTopInfo(info) {
        this.topInfo.innerHTML = info;
    }

    setStartName(name) {
        this.startName.innerHTML = name;
    }
}