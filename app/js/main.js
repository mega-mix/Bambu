import SaveGame from "./models/SaveGame.js";

window.netlifyIdentity.on("init", user => {
    
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";


    if (isLocal && !user) {
        console.warn("⚠️ Entwicklungsumgebung erkannt: Lokal-Admin aktiviert!");
        user = {
            email: "admin@localhost",
            user_metadata: { 
                full_name: "Admin (Lokal)" 
            },
            app_metadata: { 
                roles: ["admin", "user"]
            }
        };
    }

    if (!user) {
        window.location.href = "/"; 
        return;
    }

    const email = user.email;
    const fullName = user.user_metadata.full_name || "Unbekannt";
    
    console.log(`Eingeloggt als: ${fullName} (${email})`);
    
    const roles = user.app_metadata.roles || [];
    const isAdmin = roles.includes("admin");

    if (isAdmin) {
        console.log("Admin-Rechte erkannt.");
    } else {
        console.log("Nur User-Rechte.");
    }

    // LOGIK ERST AB HIER!
    setupUI();
});


function setupUI() {
    const output = document.getElementById("output");
    const input = document.getElementById("input");
    const btnLaden = document.getElementById("btnLaden");
    const btnSpeichern = document.getElementById("btnSpeichern");

    btnLaden.addEventListener('click', e => {
        // Laden Logik
    });

    btnSpeichern.addEventListener('click', e => {
        const playerName = input.value;
        const save = new SaveGame(playerName, 1);
        console.log("Save erstellt:", save.player);
    });
}


if (window.netlifyIdentity.currentUser()) {

}

window.netlifyIdentity.init();