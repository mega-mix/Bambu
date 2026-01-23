// js/game.js

import { auth, db } from "./config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { StorageModul } from "./models/storageModul.js";
import { SaveGame } from "./models/saveGame.js";
import { ViewHandler } from "./models/viewHandler.js";
import { UIManager } from "./models/uiManager.js";

let mySaveGame;
const storage = new StorageModul();
const gameView = new ViewHandler(mySaveGame);
const ui = new UIManager();


async function saveGame() {
    await storage.saveData(mySaveGame);
    gameView.setTopInfo("Spiel gespeichert");
}

async function resetGame() {
    mySaveGame = new SaveGame();
    await storage.saveData(mySaveGame);
    gameView.setTopInfo("Spielstand resettet!");
}

function viewBauwerke() {
    gameView.aktBauwerke(mySaveGame);
    gameView.switchView("view-bauwerke");
}

function viewStadt() {
    gameView.switchView("view-stadt");
}

function viewLagerhaus() {
    gameView.aktLagerhaus(mySaveGame);
    gameView.switchView("view-lagerhaus");
}

async function lagerhausLevelKauf() {
    if (mySaveGame.lagerhaus.gold < mySaveGame.lagerhaus.levelKostenGold) {return;}
    if (mySaveGame.lagerhaus.holz < mySaveGame.lagerhaus.levelKostenHolz) {return;}
    if (mySaveGame.lagerhaus.stein < mySaveGame.lagerhaus.levelKostenStein) {return;}

    // Genug Rohstoffe vorhanden
    mySaveGame.lagerhaus.gold -= mySaveGame.lagerhaus.levelKostenGold;
    mySaveGame.lagerhaus.holz -= mySaveGame.lagerhaus.levelKostenHolz;
    mySaveGame.lagerhaus.stein -= mySaveGame.lagerhaus.levelKostenStein;
    mySaveGame.lagerhaus.levelUp();
    await storage.saveData(mySaveGame);
}

onAuthStateChanged(auth, (user) => {
    if (user) {      
        gameView.setStartName(user.displayName);

        gameStart();
    }
});

// Button click Tabelle
function initInteractions() {
    const myActions = {
        // "Name im HTML" : Funktion im Code
        "saveGame": saveGame,
        "resetGame": resetGame,
        "viewStadt": viewStadt,
        "viewBauwerke": viewBauwerke,
        "viewLagerhaus": viewLagerhaus,
        "lagerhausLevelKauf": lagerhausLevelKauf
    };

    // Dem uiManager geben
    ui.registerActions(myActions);
}

// Auto-Save
setInterval(async () => {
    await storage.saveData(mySaveGame);
    console.log("Auto-Save durchgeführt");
}, 60000);


// --- GAME LOGIK ---

async function gameStart() {
    console.log("Spiel gestartet");

    mySaveGame = new SaveGame();
    let oldSaveGame = await storage.loadData();
    if (oldSaveGame) {
        // Altes SaveGame mit neuem verschmelzen
        mySaveGame.applyData(oldSaveGame);
    }
    storage.saveData(mySaveGame);

    gameView.setTopInfo("Spielstand geladen");
    gameView.aktTopLager(mySaveGame);

    gameView.aktSaveGame(mySaveGame);
    initInteractions();
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