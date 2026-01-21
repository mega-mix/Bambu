// js/game.js

import { auth, db } from "./config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const loginLabel = document.getElementById("loginLabel");

onAuthStateChanged(auth, (user) => {
    if (user) {      
        loginLabel.innerHTML = `Hallo ${user.displayName}`;

        gameStart();
    }
});


// --- GAME LOGIK ---

function gameStart() {
    console.log("Spiel gestartet");
}