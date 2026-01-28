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
}

async function resetGame() {
    mySaveGame = new SaveGame(playerName);
    await storage.saveData(mySaveGame);
    gameView.setTopInfo("⚠️ Spielstand resettet!");
    console.log("⚠️ Spielstand resettet!");
}

// --- Gebäude Level kaufen ---
function gebaeudeLevelKauf(gebaeudeName) {
    // Gebäude holen
    const stadt = mySaveGame.aktuelleStadt;
    const lager = stadt.bauwerke.lagerhaus;
    const rathaus = stadt.bauwerke.rathaus;
    const gebaeude = stadt.bauwerke[gebaeudeName];

    if (!gebaeude) return; // Abbruch wenn leer

    // Rathaus Level prüfen
    if (gebaeude.level >= rathaus.level && gebaeude !== rathaus) {
        gameView.setTopInfo("Stufe von Rathaus zu niedrig!");
        console.log("Kauf abgebrochen!");
        console.log("❌ Stufe von Rathaus zu niedrig!");
        return; // Abbruch wenn Rathaus Stufe zu niedrig
    }

    // Kosten holen
    const kostenGold = gebaeude.levelKostenGold || 0;
    const kostenHolz = gebaeude.levelKostenHolz || 0;
    const kostenStein = gebaeude.levelKostenStein || 0;

    // Prüfung auf Liquidität
    if (lager.gold < kostenGold || lager.holz < kostenHolz || lager.stein < kostenStein) {
        gameView.setTopInfo(`${gebaeude.name} zu teuer`);
        console.log("Kauf abgebrochen!");
        console.log(`❌ ${gebaeude.name} ist zu teuer`);
        return; // Abbruch wenn nicht genug
    }

    // Bezahlen
    lager.gold -= kostenGold;
    lager.holz -= kostenHolz;
    lager.stein -= kostenStein;

    // Level erhöhen und speichern
    gebaeude.levelUp();
    saveGame();
    console.log(`Erfolgreich gekauft!`);
    console.log(`🏠 ${gebaeude.name} ist nun Stufe ${gebaeude.level}`);
}

// --- Name der Stadt ändern ---
function stadtUmbenennen() {
    const input = document.getElementById("inputStadtName");

    mySaveGame.aktuelleStadt.name = input.value;

    gameView.setTopInfo(`Stadtname zu ${mySaveGame.aktuelleStadt.name} geändert`);
    console.log(`Stadtname zu ${mySaveGame.aktuelleStadt.name} geändert`);

    saveGame();
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
        "viewStadt": () => gameView.switchView("view-stadt"),
        "viewBauwerke": () => gameView.switchView("view-bauwerke"),
        "viewRathaus": () => gameView.switchView("view-rathaus"),
        "viewLagerhaus": () => gameView.switchView("view-lagerhaus"),
        "viewGoldmine": () => gameView.switchView("view-goldmine"),
        "viewHolzfaeller": () => gameView.switchView("view-holzfaeller"),
        "viewSteinbruch": () => gameView.switchView("view-steinbruch"),
        "viewStadtmauer": () => gameView.switchView("view-stadtmauer"),

        "rathausLevelKauf": () => gebaeudeLevelKauf("rathaus"),
        "lagerhausLevelKauf": () => gebaeudeLevelKauf("lagerhaus"),
        "goldmineLevelKauf": () => gebaeudeLevelKauf("goldmine"),
        "holzfaellerLevelKauf": () => gebaeudeLevelKauf("holzfaeller"),
        "steinbruchLevelKauf": () => gebaeudeLevelKauf("steinbruch"),
        "stadtmauerLevelKauf": () => gebaeudeLevelKauf("stadtmauer"),

        "stadtUmbenennen": stadtUmbenennen
    };

    ui.registerActions(myActions); // Dem uiManager geben
}

// --- Auto-Save ---
setInterval(async () => {
    await storage.saveData(mySaveGame);
    console.log("💾 Auto-Save durchgeführt");
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

// --- Game Dauerschleife ---
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