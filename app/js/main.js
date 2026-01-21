import SaveGame from "./models/SaveGame.js";

const netlifyIdentity = window.netlifyIdentity;

// Hauptfunktion zum Starten der UI
function startApp(user) {
    // Falls wir lokal sind und kein User da ist -> Fake Admin
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (isLocal && !user) {
        console.warn("⚠️ Lokal-Modus: Admin aktiv");
        user = {
            email: "admin@localhost",
            user_metadata: { full_name: "Lokal Admin" },
            app_metadata: { roles: ["admin", "user"] }
        };
    }

    if (!user) {
        document.body.innerHTML = `
            <h1>Fehler: Benutzer nicht erkannt.</h1>
            <p>Obwohl du Zugriff hast, konnte dein Benutzerprofil nicht geladen werden.</p>
            <button onclick="window.netlifyIdentity.open('login')">Neu einloggen</button>
            <a href="/">Zur Startseite</a>
        `;
        return;
    }

    // === User erfolgreich geladen ===
    const fullName = user.user_metadata.full_name || "Unbekannt";
    console.log(`Angemeldet als: ${fullName}`);

    // Admin Check für Konsole (oder UI Logik)
    const roles = user.app_metadata.roles || [];
    if (roles.includes("admin")) {
        console.log("Admin-Rechte bestätigt.");
    }

    setupUI();
}

// UI Event Listener
function setupUI() {
    const btnLaden = document.getElementById("btnLaden");
    const btnSpeichern = document.getElementById("btnSpeichern");
    const input = document.getElementById("input");

    if (btnLaden) {
        btnLaden.addEventListener('click', () => console.log("Laden geklickt"));
    }
    if (btnSpeichern) {
        btnSpeichern.addEventListener('click', () => {
            const name = input ? input.value : "Player";
            const save = new SaveGame(name, 1);
            console.log("Gespeichert:", save);
        });
    }
}

// === INITIALISIERUNG OHNE LOOP-GEFAHR ===

// 1. Prüfen ob User schon da ist
const currentUser = netlifyIdentity.currentUser();

if (currentUser) {
    startApp(currentUser);
} else {
    // 2. Warten auf Init
    netlifyIdentity.on("init", (user) => {
        startApp(user);
    });
    
    netlifyIdentity.init();
}