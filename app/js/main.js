const instanceID = Math.floor(Math.random() * 1000);
console.log("Skript-Instanz geladen: ID " + instanceID);

import SaveGame from "./models/SaveGame.js";

console.log("Main.js geladen");

const netlifyIdentity = window.netlifyIdentity;

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
console.log(`isLocal: ${isLocal}`);

// === DER SCHUTZ GEGEN DOPPELTE AUSFÜHRUNG ===
let appGestartet = false;

function startApp(user) {
    // Wenn die App schon läuft: Sofort abbrechen!
    console.log("startversuch...");
    if (appGestartet) return;

    // Sonst: Merken, dass wir gestartet sind
    appGestartet = true;
    console.log("Main.js gestartet");

    const fullName = user.user_metadata.full_name || "Unbekannt";
    console.log(`Angemeldet als: ${fullName}`);

    setupUI();
}

function setupUI() {
    const btnLaden = document.getElementById("btnLaden");
    const btnSpeichern = document.getElementById("btnSpeichern");
    const input = document.getElementById("input");

    if (btnLaden) {
        btnLaden.addEventListener('click', () => console.log("Laden..."));
    }
    if (btnSpeichern) {
        btnSpeichern.addEventListener('click', () => {
            const name = input ? input.value : "Player";
            const save = new SaveGame(name, 1);
            console.log("Gespeichert:", save);
        });
    }
}

// === INITIALISIERUNG ===

// Wir hören IMMER auf 'init', prüfen aber auch direkt.
// Durch den 'appGestartet' Schutz oben ist es egal, ob das hier doppelt feuert.
//const currentUser = netlifyIdentity.currentUser();

/*
if (currentUser) {
    console.log(`User startApp: ${currentUser}`);
    startApp(currentUser);
}
*/

if (isLocal) {
    console.warn("⚠️ Lokal-Modus: Admin");
    const user = {
        email: "admin@localhost",
        user_metadata: { full_name: "LokalAdmin" },
        app_metadata: { roles: ["admin", "user"] }
    };
    startApp(user);
}

netlifyIdentity.on("init", (user) => {
    console.log(`Netlify startApp: ${user}`);
    startApp(user);
});

// Init sicherstellen
netlifyIdentity.init();