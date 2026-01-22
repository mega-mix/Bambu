// js/model/viewHandler.js

export class ViewHandler {
    constructor(saveGame) {
        this.startName = document.getElementById("startName");
        this.topGold = document.getElementById("topGold");
        this.topHolz = document.getElementById("topHolz");
        this.topStein = document.getElementById("topStein");
        this.topInfo = document.getElementById("topInfo");
        this.bauwerkeBtnRathaus = document.getElementById("bauwerkeBtnRathaus");
        this.bauwerkeBtnLagerhaus = document.getElementById("bauwerkeBtnLagerhaus");
        this.bauwerkeBtnGoldmine = document.getElementById("bauwerkeBtnGoldmine");
        this.bauwerkeBtnHolzfaeller = document.getElementById("bauwerkeBtnHolzfaeller");
        this.bauwerkeBtnSteinbruch = document.getElementById("bauwerkeBtnSteinbruch");
        this.bauwerkeBtnStadtmauer = document.getElementById("bauwerkeBtnStadtmauer");

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
    }

    aktTopLager(saveGame) {
        this.mySaveGame = saveGame;
        this.topGold.innerHTML = `Gold: ${this.mySaveGame.lagerhaus.gold}`;
        this.topHolz.innerHTML = `Holz: ${this.mySaveGame.lagerhaus.holz}`;
        this.topStein.innerHTML = `Stein: ${this.mySaveGame.lagerhaus.stein}`;
    }

    aktBauwerke(saveGame) {
        this.mySaveGame = saveGame;
        this.bauwerkeBtnRathaus.innerHTML = `Rathaus - Stufe ${this.mySaveGame.rathaus.level}`;
        this.bauwerkeBtnLagerhaus.innerHTML = `Lagerhaus - Stufe ${this.mySaveGame.lagerhaus.level}`;
        this.bauwerkeBtnGoldmine.innerHTML = `Goldmine - Stufe ${this.mySaveGame.goldmine.level}`;
        this.bauwerkeBtnHolzfaeller.innerHTML = `Holzfäller - Stufe ${this.mySaveGame.holzfaeller.level}`;
        this.bauwerkeBtnSteinbruch.innerHTML = `Steinbruch - Stufe ${this.mySaveGame.steinbruch.level}`;
        this.bauwerkeBtnStadtmauer.innerHTML = `Stadtmauer - Stufe ${this.mySaveGame.stadtmauer.level}`;
    }

    setTopInfo(info) {
        this.topInfo.innerHTML = info;
    }

    setStartName(name) {
        this.startName.innerHTML = name;
    }
}