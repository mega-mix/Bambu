// js/game.js

import { auth, db } from "./config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { StorageModul } from "./models/storageModul.js";
import { SaveGame } from "./models/saveGame.js";

const topGold = document.getElementById("topGold");
const topHolz = document.getElementById("topHolz");
const topStein = document.getElementById("topStein");
const loginLabel = document.getElementById("loginLabel");
const storage = new StorageModul();

let mySaveGame;

const btnSpeichern = document.getElementById("btnSave");

if (btnSpeichern) {
    btnSpeichern.addEventListener('click', () => {
        storage.saveData(mySaveGame);
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {      
        loginLabel.innerHTML = `Hallo ${user.displayName}`;

        if (false) {
            mySaveGame = new SaveGame();
            storage.saveData(mySaveGame);
        }

        gameStart();
    }
});


// --- GAME LOGIK ---

async function gameStart() {
    console.log("Spiel gestartet");

    mySaveGame = await storage.loadData();

    if (mySaveGame === null) {
        mySaveGame = new SaveGame();
        storage.saveData(mySaveGame);
    }

    topGold.innerHTML = `Gold: ${mySaveGame.lagerhaus.gold}`;
    topHolz.innerHTML = `Holz: ${mySaveGame.lagerhaus.holz}`;
    topStein.innerHTML = `Stein: ${mySaveGame.lagerhaus.stein}`;
}