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
    if (mySaveGame.aktuelleStadt.bauwerke.lagerhaus.gold < mySaveGame.aktuelleStadt.bauwerke.rathaus.levelKostenGold) {return;}
    if (mySaveGame.aktuelleStadt.bauwerke.lagerhaus.holz < mySaveGame.aktuelleStadt.bauwerke.rathaus.levelKostenHolz) {return;}
    if (mySaveGame.aktuelleStadt.bauwerke.lagerhaus.stein < mySaveGame.aktuelleStadt.bauwerke.rathaus.levelKostenStein) {return;}

    // Genug Rohstoffe vorhanden
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.gold -= mySaveGame.aktuelleStadt.bauwerke.rathaus.levelKostenGold;
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.holz -= mySaveGame.aktuelleStadt.bauwerke.rathaus.levelKostenHolz;
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.stein -= mySaveGame.aktuelleStadt.bauwerke.rathaus.levelKostenStein;
    mySaveGame.aktuelleStadt.bauwerke.rathaus.levelUp();
    await storage.saveData(mySaveGame);
}

async function lagerhausLevelKauf() {
    if (mySaveGame.aktuelleStadt.bauwerke.lagerhaus.gold < mySaveGame.aktuelleStadt.bauwerke.lagerhaus.levelKostenGold) {return;}
    if (mySaveGame.aktuelleStadt.bauwerke.lagerhaus.holz < mySaveGame.aktuelleStadt.bauwerke.lagerhaus.levelKostenHolz) {return;}
    if (mySaveGame.aktuelleStadt.bauwerke.lagerhaus.stein < mySaveGame.aktuelleStadt.bauwerke.lagerhaus.levelKostenStein) {return;}

    // Genug Rohstoffe vorhanden
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.gold -= mySaveGame.aktuelleStadt.bauwerke.lagerhaus.levelKostenGold;
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.holz -= mySaveGame.aktuelleStadt.bauwerke.lagerhaus.levelKostenHolz;
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.stein -= mySaveGame.aktuelleStadt.bauwerke.lagerhaus.levelKostenStein;
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.levelUp();
    await storage.saveData(mySaveGame);
}

async function goldmineLevelKauf() {
    if (mySaveGame.aktuelleStadt.bauwerke.lagerhaus.gold < mySaveGame.aktuelleStadt.bauwerke.goldmine.levelKostenGold) {return;}
    if (mySaveGame.aktuelleStadt.bauwerke.lagerhaus.holz < mySaveGame.aktuelleStadt.bauwerke.goldmine.levelKostenHolz) {return;}
    if (mySaveGame.aktuelleStadt.bauwerke.lagerhaus.stein < mySaveGame.aktuelleStadt.bauwerke.goldmine.levelKostenStein) {return;}

    // Genug Rohstoffe vorhanden
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.gold -= mySaveGame.aktuelleStadt.bauwerke.goldmine.levelKostenGold;
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.holz -= mySaveGame.aktuelleStadt.bauwerke.goldmine.levelKostenHolz;
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.stein -= mySaveGame.aktuelleStadt.bauwerke.goldmine.levelKostenStein;
    mySaveGame.aktuelleStadt.bauwerke.goldmine.levelUp();
    await storage.saveData(mySaveGame);
}

async function holzfaellerLevelKauf() {
    if (mySaveGame.aktuelleStadt.bauwerke.lagerhaus.gold < mySaveGame.aktuelleStadt.bauwerke.holzfaeller.levelKostenGold) {return;}
    if (mySaveGame.aktuelleStadt.bauwerke.lagerhaus.holz < mySaveGame.aktuelleStadt.bauwerke.holzfaeller.levelKostenHolz) {return;}
    if (mySaveGame.aktuelleStadt.bauwerke.lagerhaus.stein < mySaveGame.aktuelleStadt.bauwerke.holzfaeller.levelKostenStein) {return;}

    // Genug Rohstoffe vorhanden
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.gold -= mySaveGame.aktuelleStadt.bauwerke.holzfaeller.levelKostenGold;
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.holz -= mySaveGame.aktuelleStadt.bauwerke.holzfaeller.levelKostenHolz;
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.stein -= mySaveGame.aktuelleStadt.bauwerke.holzfaeller.levelKostenStein;
    mySaveGame.aktuelleStadt.bauwerke.holzfaeller.levelUp();
    await storage.saveData(mySaveGame);
}

async function steinbruchLevelKauf() {
    if (mySaveGame.aktuelleStadt.bauwerke.lagerhaus.gold < mySaveGame.aktuelleStadt.bauwerke.steinbruch.levelKostenGold) {return;}
    if (mySaveGame.aktuelleStadt.bauwerke.lagerhaus.holz < mySaveGame.aktuelleStadt.bauwerke.steinbruch.levelKostenHolz) {return;}
    if (mySaveGame.aktuelleStadt.bauwerke.lagerhaus.stein < mySaveGame.aktuelleStadt.bauwerke.steinbruch.levelKostenStein) {return;}

    // Genug Rohstoffe vorhanden
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.gold -= mySaveGame.aktuelleStadt.bauwerke.steinbruch.levelKostenGold;
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.holz -= mySaveGame.aktuelleStadt.bauwerke.steinbruch.levelKostenHolz;
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.stein -= mySaveGame.aktuelleStadt.bauwerke.steinbruch.levelKostenStein;
    mySaveGame.aktuelleStadt.bauwerke.steinbruch.levelUp();
    await storage.saveData(mySaveGame);
}

// --- User Anmeldung ---
onAuthStateChanged(auth, (user) => {
    if (user) { 
        playerName = user.displayName;    
        gameView.setStartName(playerName);

        gameStart(); // Spiel initialisieren
    }
});

// --- Button click Tabelle ---
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

    ui.registerActions(myActions); // Dem uiManager geben
}

// --- Auto-Save ---
setInterval(async () => {
    await storage.saveData(mySaveGame);
    console.log("Auto-Save durchgeführt");
}, 60000);



// ----------------------
// ----- GAME LOGIK -----
// ----------------------

// --- Initialer Start ---
async function gameStart() {
    mySaveGame = new SaveGame(playerName); // Neues SaveGame erstellen
    let oldSaveGame = await storage.loadData(); // Altes SaveGame laden
    if (oldSaveGame) {
        mySaveGame.applyData(oldSaveGame); // Altes SaveGame mit neuem verschmelzen
    }
    storage.saveData(mySaveGame); // SaveGame in Datenbank speichern

    gameView.setTopInfo("Spielstand geladen");

    gameView.setGame(mySaveGame); // View initialisieren
    gameView.updateStadt(mySaveGame.aktuelleStadt); // View aktuelle Stadt geben

    initInteractions(); // Buttons initialisieren
    requestAnimationFrame(gameLoop); // GameLoop starten
}

function gameLoop() {
    updateData(); // Daten aktualisieren
    updateView(); // Darstellung aktualisieren

    requestAnimationFrame(gameLoop); // GameLoop wiederholen
}

// --- Daten aktualisieren ---
function updateData() {
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.addGold(mySaveGame.aktuelleStadt.bauwerke.goldmine.einsammeln());     // Gold einsammeln
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.addHolz(mySaveGame.aktuelleStadt.bauwerke.holzfaeller.einsammeln());  // Holz einsammeln
    mySaveGame.aktuelleStadt.bauwerke.lagerhaus.addStein(mySaveGame.aktuelleStadt.bauwerke.steinbruch.einsammeln());  // Stein einsammeln
}

// --- Darstellung aktualisieren ---
function updateView() {
    gameView.updateSaveGame(mySaveGame); // aktuelles Savegame an viewHandler geben
    gameView.update(); // Werte in HTML aktualisieren
}