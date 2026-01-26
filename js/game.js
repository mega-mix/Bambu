// js/game.js

import { auth, db } from "./config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { StorageModul } from "./models/storageModul.js";
import { SaveGame } from "./models/saveGame.js";
import { ViewHandler } from "./models/viewHandler.js";
import { UIManager } from "./models/uiManager.js";

let playerName;
let mySaveGame;
const storage = new StorageModul();
const gameView = new ViewHandler(mySaveGame);
const ui = new UIManager();


async function saveGame() {
    await storage.saveData(mySaveGame);
    gameView.setTopInfo("Spiel gespeichert");
}

async function resetGame() {
    mySaveGame = new SaveGame(playerName);
    await storage.saveData(mySaveGame);
    gameView.setTopInfo("Spielstand resettet!");
}

// FUNKTION VIEW ALLGEMEIN MACHEN!
function viewBauwerke() {
    gameView.switchView("view-bauwerke");
}

function viewStadt() {
    gameView.switchView("view-stadt");
}

function viewRathaus() {
    gameView.switchView("view-rathaus");
}

function viewLagerhaus() {
    gameView.switchView("view-lagerhaus");
}

function viewGoldmine() {
    gameView.switchView("view-goldmine");
}

function viewHolzfaeller() {
    gameView.switchView("view-holzfaeller");
}

function viewSteinbruch() {
    gameView.switchView("view-steinbruch");
}

// FUNKTION ZUM KAUF ALLGEMEIN MACHEN!
async function rathausLevelKauf() {
    if (mySaveGame.lagerhaus.gold < mySaveGame.rathaus.levelKostenGold) {return;}
    if (mySaveGame.lagerhaus.holz < mySaveGame.rathaus.levelKostenHolz) {return;}
    if (mySaveGame.lagerhaus.stein < mySaveGame.rathaus.levelKostenStein) {return;}

    // Genug Rohstoffe vorhanden
    mySaveGame.lagerhaus.gold -= mySaveGame.rathaus.levelKostenGold;
    mySaveGame.lagerhaus.holz -= mySaveGame.rathaus.levelKostenHolz;
    mySaveGame.lagerhaus.stein -= mySaveGame.rathaus.levelKostenStein;
    mySaveGame.rathaus.levelUp();
    await storage.saveData(mySaveGame);
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

async function goldmineLevelKauf() {
    if (mySaveGame.lagerhaus.gold < mySaveGame.goldmine.levelKostenGold) {return;}
    if (mySaveGame.lagerhaus.holz < mySaveGame.goldmine.levelKostenHolz) {return;}
    if (mySaveGame.lagerhaus.stein < mySaveGame.goldmine.levelKostenStein) {return;}

    // Genug Rohstoffe vorhanden
    mySaveGame.lagerhaus.gold -= mySaveGame.goldmine.levelKostenGold;
    mySaveGame.lagerhaus.holz -= mySaveGame.goldmine.levelKostenHolz;
    mySaveGame.lagerhaus.stein -= mySaveGame.goldmine.levelKostenStein;
    mySaveGame.goldmine.levelUp();
    await storage.saveData(mySaveGame);
}

async function holzfaellerLevelKauf() {
    if (mySaveGame.lagerhaus.gold < mySaveGame.holzfaeller.levelKostenGold) {return;}
    if (mySaveGame.lagerhaus.holz < mySaveGame.holzfaeller.levelKostenHolz) {return;}
    if (mySaveGame.lagerhaus.stein < mySaveGame.holzfaeller.levelKostenStein) {return;}

    // Genug Rohstoffe vorhanden
    mySaveGame.lagerhaus.gold -= mySaveGame.holzfaeller.levelKostenGold;
    mySaveGame.lagerhaus.holz -= mySaveGame.holzfaeller.levelKostenHolz;
    mySaveGame.lagerhaus.stein -= mySaveGame.holzfaeller.levelKostenStein;
    mySaveGame.holzfaeller.levelUp();
    await storage.saveData(mySaveGame);
}

async function steinbruchLevelKauf() {
    if (mySaveGame.lagerhaus.gold < mySaveGame.steinbruch.levelKostenGold) {return;}
    if (mySaveGame.lagerhaus.holz < mySaveGame.steinbruch.levelKostenHolz) {return;}
    if (mySaveGame.lagerhaus.stein < mySaveGame.steinbruch.levelKostenStein) {return;}

    // Genug Rohstoffe vorhanden
    mySaveGame.lagerhaus.gold -= mySaveGame.steinbruch.levelKostenGold;
    mySaveGame.lagerhaus.holz -= mySaveGame.steinbruch.levelKostenHolz;
    mySaveGame.lagerhaus.stein -= mySaveGame.steinbruch.levelKostenStein;
    mySaveGame.steinbruch.levelUp();
    await storage.saveData(mySaveGame);
}

onAuthStateChanged(auth, (user) => {
    if (user) {      
        gameView.setStartName(user.displayName);
        playerName = user.displayName;
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
        "viewRathaus": viewRathaus,
        "rathausLevelKauf": rathausLevelKauf,
        "viewLagerhaus": viewLagerhaus,
        "lagerhausLevelKauf": lagerhausLevelKauf,
        "viewGoldmine": viewGoldmine,
        "goldmineLevelKauf": goldmineLevelKauf,
        "viewHolzfaeller": viewHolzfaeller,
        "holzfaellerLevelKauf": holzfaellerLevelKauf,
        "viewSteinbruch": viewSteinbruch,
        "steinbruchLevelKauf": steinbruchLevelKauf
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

    mySaveGame = new SaveGame(playerName);
    let oldSaveGame = await storage.loadData();
    if (oldSaveGame) {
        // Altes SaveGame mit neuem verschmelzen
        mySaveGame.applyData(oldSaveGame);
    }
    storage.saveData(mySaveGame);

    gameView.setTopInfo("Spielstand geladen");

    gameView.setGame(mySaveGame);
    initInteractions();
    requestAnimationFrame(gameLoop);
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
    gameView.aktSaveGame(mySaveGame);
    gameView.update();
}