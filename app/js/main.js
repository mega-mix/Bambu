import SaveGame from "./models/SaveGame.js";

// Hilfsfunktion: Wartet garantiert, bis Netlify Identity bereit ist
function waitForUser() {
    return new Promise((resolve) => {
        // Fall 1: User ist schon geladen (z.B. durch Cache)
        const existingUser = window.netlifyIdentity.currentUser();
        if (existingUser) {
            resolve(existingUser);
            return;
        }

        // Fall 2: Wir müssen warten, bis das 'init' Event feuert
        window.netlifyIdentity.on("init", (user) => {
            resolve(user);
        });

        // Sicherheitshalber Init erzwingen, falls noch nicht geschehen
        window.netlifyIdentity.init();
    });
}

// Hauptfunktion starten
async function initApp() {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    
    // Wir warten hier, bis Netlify "Fertig!" meldet. Das verhindert den Loop.
    let user = await waitForUser();

    // DEV-MODUS: Fake User falls lokal
    if (isLocal && !user) {
        console.warn("⚠️ Lokal-Modus: Fake-Admin aktiv");
        user = {
            email: "admin@localhost",
            user_metadata: { full_name: "Lokal Admin" },
            app_metadata: { roles: ["admin", "user"] }
        };
    }

    // JETZT erst prüfen wir, ob wir redirecten müssen
    if (!user) {
        // Nur redirecten, wenn wir sicher sind, dass kein User da ist
        window.location.href = "/";
        return;
    }

    // === App Start ===
    const fullName = user.user_metadata.full_name || "Unbekannt";
    console.log(`Angemeldet als: ${fullName}`);
    
    // UI aufbauen
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

// App starten
initApp();