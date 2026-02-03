// js/game.js

import { auth, db } from "./config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { StorageModul } from "./models/storageModul.js";
import { SaveGame } from "./models/saveGame.js";
import { ViewHandler } from "./models/viewHandler.js";
import { UIManager } from "./models/uiManager.js";

let playerName;
let mySaveGame;
export let isAdmin = false;
const storage = new StorageModul();
const gameView = new ViewHandler(mySaveGame);
const ui = new UIManager();


async function saveGame() {
    await storage.saveData(mySaveGame);
}

async function resetGame() {
    mySaveGame = new SaveGame(playerName);
    gameView.updateSaveGame(mySaveGame);
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

    // Bauschleife auf bereits vorhanden prüfen
    if (stadt.bauwerke.isGebaeudeInBauschleife()) {
        gameView.setTopInfo("Gebäude wird schon gebaut!");
        console.log("Kauf abgebrochen!");
        console.log("❌ Wird schon gebaut!");
        return; // Abbruch wenn schon in Bauschleife vorhanden
    }

    // Bauschleife auf Platz prüfen
    if (stadt.bauwerke.isBauschleifeVoll()) {
        gameView.setTopInfo("Bauschleife ist voll!");
        console.log("Kauf abgebrochen!");
        console.log("❌ Bauschleife ist voll!");
        return; // Abbruch wenn Bauschleife voll ist
    }

    // Rathaus Level prüfen
    if (gebaeude.level >= rathaus.level && gebaeude !== rathaus) {
        gameView.setTopInfo("Stufe von Rathaus zu niedrig!");
        console.log("Kauf abgebrochen!");
        console.log("❌ Stufe von Rathaus zu niedrig!");
        return; // Abbruch wenn Rathaus Stufe zu niedrig
    }

    // Kosten holen
    const kostenGold = gebaeude.kostenGold || 0;
    const kostenHolz = gebaeude.kostenHolz || 0;
    const kostenStein = gebaeude.kostenStein || 0;

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
    stadt.bauwerke.addBauwerk(gebaeude);
    saveGame();
    console.log(`Erfolgreich gekauft!`);
    console.log(`🏠 ${gebaeude.name} wird gebaut.`);
}

// --- Einheiten kaufen ---
function einheitenKauf(einheitName) {
    // Gebäude holen
    const stadt = mySaveGame.aktuelleStadt;
    const lager = stadt.bauwerke.lagerhaus;
    const kaserne = stadt.bauwerke.kaserne;
    const einheit = stadt.einheiten[einheitName];

    if (!einheit) return; // Abbruch wenn leer

    // Kaserne Level prüfen
    if (kaserne.level < 1) {
        gameView.setTopInfo("Stufe von Kaserne zu niedrig!");
        console.log("Kauf abgebrochen!");
        console.log("❌ Stufe von Kaserne zu niedrig!");
        return; // Abbruch wenn Kasere Stufe zu niedrig
    }

    // Kosten holen
    const kostenGold = einheit.kostenGold || 0;
    const kostenHolz = einheit.kostenHolz || 0;
    const kostenStein = einheit.kostenStein || 0;

    // Prüfung auf Liquidität
    if (lager.gold < kostenGold || lager.holz < kostenHolz || lager.stein < kostenStein) {
        gameView.setTopInfo(`${einheit.name} zu teuer`);
        console.log("Kauf abgebrochen!");
        console.log(`❌ ${einheit.name} ist zu teuer`);
        return; // Abbruch wenn nicht genug
    }

    // Bezahlen
    lager.gold -= kostenGold;
    lager.holz -= kostenHolz;
    lager.stein -= kostenStein;

    // Level erhöhen und speichern
    stadt.einheiten.addEinheit(einheit);
    saveGame();
    console.log(`🙍‍♂️ ${einheit.name} wird ausgebildet!`);
}

// --- Armee los schicken ---
function starteMarsch(sMenge, pMenge, bMenge, zielId) {
    const stadt = mySaveGame.aktuelleStadt;
    
    // 1. Armee-Objekt erstellen (entnimmt Truppen aus stadt.einheiten)
    const neueArmee = new Armee(sMenge, pMenge, bMenge, stadt.einheiten);
    
    // 2. Ziel und Zeit festlegen (wie in der Bauschleife)
    const marschDauer = 30000; // 30 Sekunden Marschzeit
    neueArmee.ankunftZeit = Date.now() + marschDauer;
    neueArmee.zielId = zielId; // Wer wird angegriffen?

    // 3. In die Liste der Stadt eintragen -> Wird jetzt mitgespeichert!
    stadt.marschierendeArmeen.push(neueArmee);
    
    saveGame(); // Sofort speichern
}

// --- Name der Stadt ändern ---
function stadtUmbenennen() {
    const input = document.getElementById("inputStadtName");

    mySaveGame.aktuelleStadt.name = input.value;

    gameView.setTopInfo(`Stadtname zu ${mySaveGame.aktuelleStadt.name} geändert`);
    console.log(`Stadtname zu ${mySaveGame.aktuelleStadt.name} geändert`);

    saveGame();
}

// --- Spielernamen ändern ---
function spielerUmbenennen() {
    const input = document.getElementById("inputPlayerName");

    mySaveGame.playerName = input.value;

    gameView.setTopInfo(`Spielername zu ${mySaveGame.playerName} geändert`);
    console.log(`Spielername zu ${mySaveGame.playerName} geändert`);

    saveGame();
}

// --- Admin Seite anzeigen ---
function openAdminView() {
    if (!isAdmin) {
        console.warn("⛔ Zugriff verweigert! Du bist kein Admin.");
        gameView.setTopInfo("⛔ Zugriff verweigert!");
        return; // Sofortiger Abbruch
    }

    // Wenn Admin: Erlaubt
    gameView.switchView("view-admin");
}

// --- User Anmeldung ---
onAuthStateChanged(auth, (user) => {
    if (user) { 
        playerName = user.displayName;
        gameStart(); // Spiel initialisieren
    }
});

// --- Admin Rohstoffpaket ---
function adminAddResources() {
    if (!isAdmin) return; 

    const lager = mySaveGame.aktuelleStadt.bauwerke.lagerhaus;
    lager.addGold(10000);
    lager.addHolz(10000);
    lager.addStein(10000);

    updateView();
    saveGame(); // Speichern
    gameView.setTopInfo("💰 Admin-Paket erhalten!");
}

// --- Button click Tabelle ---
function initInteractions() {
    const myActions = {
        // "Name im HTML" : Funktion im Code
        "saveGame": saveGame,
        "resetGame": resetGame,
        "viewPlayer": () => gameView.switchView("view-player"),
        "viewStadt": () => gameView.switchView("view-stadt"),
        "viewQuests": () => gameView.switchView("view-quests"),
        "viewBauwerke": () => gameView.switchView("view-bauwerke"),
        "viewRathaus": () => gameView.switchView("view-rathaus"),
        "viewLagerhaus": () => gameView.switchView("view-lagerhaus"),
        "viewGoldmine": () => gameView.switchView("view-goldmine"),
        "viewHolzfaeller": () => gameView.switchView("view-holzfaeller"),
        "viewSteinbruch": () => gameView.switchView("view-steinbruch"),
        "viewStadtmauer": () => gameView.switchView("view-stadtmauer"),
        "viewKaserne": () => gameView.switchView("view-kaserne"),
        "viewKaserneAusbildung": () => gameView.switchView("view-kaserneAusbildung"),

        "rathausLevelKauf": () => gebaeudeLevelKauf("rathaus"),
        "lagerhausLevelKauf": () => gebaeudeLevelKauf("lagerhaus"),
        "goldmineLevelKauf": () => gebaeudeLevelKauf("goldmine"),
        "holzfaellerLevelKauf": () => gebaeudeLevelKauf("holzfaeller"),
        "steinbruchLevelKauf": () => gebaeudeLevelKauf("steinbruch"),
        "stadtmauerLevelKauf": () => gebaeudeLevelKauf("stadtmauer"),
        "kaserneLevelKauf": () => gebaeudeLevelKauf("kaserne"),

        "einheitSchwertKauf": () => einheitenKauf("schwert"),
        "einheitSpeerKauf": () => einheitenKauf("speer"),
        "einheitBogenKauf": () => einheitenKauf("bogen"),

        "stadtUmbenennen": stadtUmbenennen,
        "spielerUmbenennen": spielerUmbenennen,

        "viewAdmin": openAdminView,
        "rohstoffPaket": adminAddResources,

        "prepareAngriff": () => {
            gameView.prepareAttackView();
            gameView.switchView("view-angriff");
        },
        "execAngriff": () => {
            const s = parseInt(document.getElementById("ui-range-schwert").value);
            const p = parseInt(document.getElementById("ui-range-speer").value);
            const b = parseInt(document.getElementById("ui-range-bogen").value);
        
            starteMarsch(s, p, b); // Wir starten erst mal nur den Marsch
        }
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
    // Admin prüfen
    isAdmin = await storage.checkIsAdmin();
    
    if (isAdmin) {
        console.log("👮‍♂️ ADMIN-RECHTE ERKANNT");
        document.body.classList.add("admin-mode"); 
        gameView.setTopInfo("🛡️ Admin Modus aktiv");
    }

    // Savegame laden
    mySaveGame = new SaveGame(playerName); // Neues SaveGame erstellen
    let oldSaveGame = await storage.loadData(); // Altes SaveGame laden
    if (oldSaveGame) {
        mySaveGame.applyData(oldSaveGame); // Altes SaveGame mit neuem verschmelzen
    }

    await checkAttacks(); // Inbox auf Angriff prüfen

    storage.saveData(mySaveGame); // SaveGame in Datenbank speichern

    gameView.setTopInfo("Spielstand geladen");
    gameView.setStartName(mySaveGame.playerName);

    gameView.setGame(mySaveGame); // View initialisieren
    gameView.updateStadt(mySaveGame.aktuelleStadt); // View aktuelle Stadt geben

    initInteractions(); // Buttons initialisieren
    requestAnimationFrame(gameLoop); // GameLoop starten
}

// --- Hilfsfunktion zum Prüfen auf einen Angriff ---
async function checkAttacks() {
    const attacks = await storage.checkInbox();

    if (attacks.length > 0) {
        let verlorenGold = 0;
        let verlorenHolz = 0;
        let verlorenStein = 0;
        let deadSchwert = 0;
        let deadSpeer = 0;
        let deadBogen = 0;

        attacks.forEach(attack => {
            // Rohstoffe summieren
            if (attack.lootGold) verlorenGold += attack.lootGold;
            if (attack.lootHolz) verlorenHolz += attack.lootHolz;
            if (attack.lootStein) verlorenStein += attack.lootStein;

            // Tote Einheiten summieren
            if (attack.deadSchwert) deadSchwert += attack.deadSchwert;
            if (attack.deadSpeer) deadSpeer += attack.deadSpeer;
            if (attack.deadBogen) deadBogen += attack.deadBogen;
        });

        // 1. Rohstoffe abziehen (Verhindern, dass es unter 0 geht)
        const lager = mySaveGame.aktuelleStadt.bauwerke.lagerhaus;
        lager.gold = Math.max(0, lager.gold - verlorenGold);
        lager.holz = Math.max(0, lager.holz - verlorenHolz);
        lager.stein = Math.max(0, lager.stein - verlorenStein);

        // 2. Einheiten töten (Arrays kürzen)
        const armee = mySaveGame.aktuelleStadt.einheiten;
        
        // Hilfsfunktion zum Löschen
        const killUnits = (array, count) => {
            for(let i=0; i<count; i++) { array.pop(); } // Entfernt die letzten Einheiten
        };

        killUnits(armee.unitsSchwert, deadSchwert);
        killUnits(armee.unitsSpeer, deadSpeer);
        killUnits(armee.unitsBogen, deadBogen);

        // Meldung an den Spieler
        alert(`ALARM! Du wurdest während deiner Abwesenheit ${attacks.length}x angegriffen!\n\nVerluste:\nGold: ${verlorenGold}\nHolz: ${verlorenHolz}\nStein: ${verlorenStein}\n\nGefallene Truppen:\nSchwert: ${deadSchwert}\nSpeer: ${deadSpeer}\nBogen: ${deadBogen}`);
    }
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
    mySaveGame.aktuelleStadt.einheiten.updateAusbildungsschleife();
    mySaveGame.aktuelleStadt.bauwerke.updateBauschleife();

    const stadt = mySaveGame.aktuelleStadt;
    const now = Date.now();

    // Schleife rückwärts laufen lassen, um Elemente sicher zu entfernen
    for (let i = stadt.marschierendeArmeen.length - 1; i >= 0; i--) {
        const armee = stadt.marschierendeArmeen[i];
        
        if (now >= armee.ankunftZeit) {
            // Logik: Kampf ausführen und Armee entfernen
            console.log("Armee ist am Ziel angekommen!");
            
            // Hier folgt der Aufruf deines KampfSystems
            // Danach: stadt.marschierendeArmeen.splice(i, 1);
            // Danach: saveGame();
        }
    }
}

// --- Darstellung aktualisieren ---
function updateView() {
    gameView.update(); // Werte in HTML aktualisieren
}