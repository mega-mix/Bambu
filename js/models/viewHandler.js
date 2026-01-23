// js/model/viewHandler.js

export class ViewHandler {
    constructor(saveGame) {
        this.startName = document.getElementById("startName");
        this.topGold = document.getElementById("topGold");
        this.topHolz = document.getElementById("topHolz");
        this.topStein = document.getElementById("topStein");
        this.topInfo = document.getElementById("topInfo");
        this.bauwerkeRathausStufe = document.getElementById("bauwerkeRathausStufe");
        this.bauwerkeLagerhausStufe = document.getElementById("bauwerkeLagerhausStufe");
        this.bauwerkeGoldmineStufe = document.getElementById("bauwerkeGoldmineStufe");
        this.bauwerkeHolzfaellerStufe = document.getElementById("bauwerkeHolzfaellerStufe");
        this.bauwerkeSteinbruchStufe = document.getElementById("bauwerkeSteinbruchStufe");
        this.bauwerkeStadtmauerStufe = document.getElementById("bauwerkeStadtmauerStufe");
        this.lagerhausStufe = document.getElementById("lagerhausStufe");
        //this.lagerhausGold = document.getElementById("lagerhausGold");
        //this.lagerhausHolz = document.getElementById("lagerhausHolz");
        //this.lagerhausStein = document.getElementById("lagerhausStein");
        this.lagerhausGoldMax = document.getElementById("lagerhausGoldMax");
        this.lagerhausHolzMax = document.getElementById("lagerhausHolzMax");
        this.lagerhausSteinMax = document.getElementById("lagerhausSteinMax");
        this.lagerhausGoldKosten = document.getElementById("lagerhausGoldKosten");
        this.lagerhausHolzKosten = document.getElementById("lagerhausHolzKosten");
        this.lagerhausSteinKosten = document.getElementById("lagerhausSteinKosten");

        this.mySaveGame = saveGame;
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

    update() {
        // 1. Suche ALLE Elemente, die ein data-bind Attribut haben
        const elements = document.querySelectorAll("[data-bind]");

        // 2. Gehe jedes Element durch
        elements.forEach(element => {
            // "lagerhaus.gold" aus dem HTML lesen
            const pfad = element.dataset.bind; 
            
            // Den Wert aus dem saveGame Objekt holen (siehe Hilfsfunktion unten)
            const wert = this.resolvePath(pfad, this.mySaveGame);

            // 3. Wert ins HTML schreiben (und runden, falls es eine Zahl ist)
            if (wert !== undefined) {
                if (typeof wert === 'number') {
                    element.innerText = Math.floor(wert);
                } else {
                    element.innerText = wert;
                }
            }
        });
    }

    resolvePath(path, obj) {
        console.log(`Suche nach: ${path} in`, obj);
        return path.split('.').reduce((prev, curr) => {
            return prev ? prev[curr] : undefined;
        }, obj);
    }

    aktTopLager(saveGame) {
        this.mySaveGame = saveGame;
        this.topGold.innerText = this.mySaveGame.lagerhaus.gold;
        this.topHolz.innerText = this.mySaveGame.lagerhaus.holz;
        this.topStein.innerText = this.mySaveGame.lagerhaus.stein;
    }

    aktBauwerke(saveGame) {
        this.mySaveGame = saveGame;
        this.bauwerkeRathausStufe.innerHTML = `Rathaus - Stufe ${this.mySaveGame.rathaus.level}`;
        this.bauwerkeLagerhausStufe.innerHTML = `Lagerhaus - Stufe ${this.mySaveGame.lagerhaus.level}`;
        this.bauwerkeGoldmineStufe.innerHTML = `Goldmine - Stufe ${this.mySaveGame.goldmine.level}`;
        this.bauwerkeHolzfaellerStufe.innerHTML = `Holzfäller - Stufe ${this.mySaveGame.holzfaeller.level}`;
        this.bauwerkeSteinbruchStufe.innerHTML = `Steinbruch - Stufe ${this.mySaveGame.steinbruch.level}`;
        this.bauwerkeStadtmauerStufe.innerHTML = `Stadtmauer - Stufe ${this.mySaveGame.stadtmauer.level}`;
    }

    aktLagerhaus(saveGame) {
        this.mySaveGame = saveGame;
        this.lagerhausStufe.innerText = `Stufe ${this.mySaveGame.lagerhaus.level}`;
        //this.lagerhausGold.innerText = this.mySaveGame.lagerhaus.gold;
        //this.lagerhausHolz.innerText = this.mySaveGame.lagerhaus.holz;
        //this.lagerhausStein.innerText = this.mySaveGame.lagerhaus.stein;
        this.lagerhausGoldMax.innerText = this.mySaveGame.lagerhaus.maxGold;
        this.lagerhausHolzMax.innerText = this.mySaveGame.lagerhaus.maxHolz;
        this.lagerhausSteinMax.innerText = this.mySaveGame.lagerhaus.maxStein;
        this.lagerhausGoldKosten.innerText = this.mySaveGame.lagerhaus.levelKostenGold;
        this.lagerhausHolzKosten.innerText = this.mySaveGame.lagerhaus.levelKostenHolz;
        this.lagerhausSteinKosten.innerText = this.mySaveGame.lagerhaus.levelKostenStein;
    }

    setTopInfo(info) {
        this.topInfo.innerHTML = info;
    }

    setStartName(name) {
        this.startName.innerHTML = name;
    }
}