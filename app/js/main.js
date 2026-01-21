import SaveGame from "./models/SaveGame.js";

const netlifyIdentity = window.netlifyIdentity;

// Diese Funktion führt deine eigentliche Logik aus
const startApp = (user) => {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

    // Fake-User für lokal (falls keiner eingeloggt ist)
    if (isLocal && !user) {
        console.warn("⚠️ Entwicklungsumgebung: Fake-Admin aktiviert!");
        user = {
            email: "admin@localhost",
            user_metadata: { full_name: "Admin (Lokal)" },
            app_metadata: { roles: ["admin", "user"] }
        };
    }

    // Wenn immer noch kein User da ist -> Rauswurf zur Startseite
    if (!user) {
        console.log("Kein User gefunden -> Redirect zu /");
        window.location.href = "/";
        return;
    }

    // === User ist da, App starten ===
    const email = user.email;
    const fullName = user.user_metadata.full_name || "Unbekannt";
    const roles = user.app_metadata.roles || [];
    const isAdmin = roles.includes("admin");

    console.log(`Eingeloggt als: ${fullName} (${email})`);

    if (isAdmin) {
        console.log("Admin-Rechte erkannt.");
    }

    setupUI();
};

// === HIER IST DER FIX: ===

// 1. Prüfen: Ist Netlify schon bereit und hat einen User?
const currentUser = netlifyIdentity.currentUser();

if (currentUser) {
    // Ja, User ist schon da (Event war schon). Direkt starten!
    startApp(currentUser);
} else {
    // Nein, wir müssen noch warten. Event Listener setzen.
    netlifyIdentity.on("init", user => {
        startApp(user);
    });
    
    // Sicherheitshalber Init anstoßen (falls noch nicht passiert)
    netlifyIdentity.init();
}

function setupUI() {
    const output = document.getElementById("output");
    const input = document.getElementById("input");
    const btnLaden = document.getElementById("btnLaden");
    const btnSpeichern = document.getElementById("btnSpeichern");

    if(btnLaden) {
        btnLaden.addEventListener('click', e => {
             // Laden Logik hier
             console.log("Laden geklickt");
        });
    }

    if(btnSpeichern) {
        btnSpeichern.addEventListener('click', e => {
            const playerName = input ? input.value : "Unbekannt";
            const save = new SaveGame(playerName, 1);
            console.log("Save erstellt:", save.player);
        });
    }
}