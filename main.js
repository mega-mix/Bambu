import SaveGame from "./models/SaveGame.js";

const netlifyIdentity = window.netlifyIdentity;

// === DER SCHUTZ GEGEN DOPPELTE AUSFÜHRUNG ===
let appGestartet = false;

function startApp(user) {
    // Wenn die App schon läuft: Sofort abbrechen!
    if (appGestartet) return;
    
    // Sonst: Merken, dass wir gestartet sind
    appGestartet = true;
    
    // Falls lokal und kein User -> Lokal Admin
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (isLocal && !user) {
        console.warn("⚠️ Lokal-Modus: Admin");
        user = {
            email: "admin@localhost",
            user_metadata: { full_name: "Lokal Admin" },
            app_metadata: { roles: ["admin", "user"] }
        };
    }

    if (!user) {
        document.body.innerHTML = `<h1>Fehler: Kein Benutzer gefunden.</h1><a href="/">Zurück</a>`;
        return;
    }

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
const currentUser = netlifyIdentity.currentUser();

if (currentUser) {
    startApp(currentUser);
}

// Zur Sicherheit auch auf das Event hören (falls currentUser noch null war)
netlifyIdentity.on("init", (user) => {
    startApp(user);
});

// Init sicherstellen
netlifyIdentity.init();