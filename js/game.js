// js/game.js

import { auth, db } from "./config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { StorageModul } from "./models/storageModul.js";
import { SaveGame } from "./models/saveGame.js";
import { ViewHandler } from "./models/viewHandler.js";

let mySaveGame;
const storage = new StorageModul();
const gameView = new ViewHandler(mySaveGame);


const topBtnSpeichern = document.getElementById("topBtnSave");
if (topBtnSpeichern) {
    topBtnSpeichern.addEventListener('click', () => {
        storage.saveData(mySaveGame);
        gameView.setTopInfo("Spiel gespeichert");
    });
}

const topBtnReset = document.getElementById("topBtnReset");
if (topBtnReset) {
    topBtnReset.addEventListener('click', () => {
        mySaveGame = new SaveGame();
        storage.saveData(mySaveGame);
        gameView.setTopInfo("Spielstand resettet!");
    });
}

const btnBauwerke = document.getElementById("btnBauwerke");
if (btnBauwerke) {
    btnBauwerke.addEventListener('click', () => {
        gameView.aktBauwerke(mySaveGame);
        gameView.switchView("view-bauwerke");
    });
}

const btnStadt = document.getElementById("btnStadt");
if (btnStadt) {
    btnStadt.addEventListener('click', () => {
        gameView.switchView("view-stadt");
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {      
        gameView.setStartName(user.displayName);

        gameStart();
    }
});

// --- GAME LOGIK ---

async function gameStart() {
    console.log("Spiel gestartet");

    mySaveGame = new SaveGame();
    let oldSaveGame = await storage.loadData();
    if (oldSaveGame && false) {
        // Altes SaveGame mit neuem verschmelzen
        mySaveGame.applyData(oldSaveGame);
    }
    storage.saveData(mySaveGame);

    gameView.setTopInfo("Spielstand geladen");
    gameView.aktTopLager(mySaveGame);

    gameLoop();
}

function gameLoop() {
    updateData();
    updateView();

    requestAnimationFrame(gameLoop);
}

function updateData() {
    mySaveGame.lagerhaus.addGold(mySaveGame.goldmine.einsammeln());
    mySaveGame.lagerhaus.addHolz(mySaveGame.holzfaeller.einsammeln());
    mySaveGame.lagerhaus.addStein(mySaveGame.steinbruch.einsammeln());
}

function updateView() {
    gameView.aktTopLager(mySaveGame);
}