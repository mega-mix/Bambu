import SaveGame from "./models/SaveGame.js";

const user = netlifyIdentity.currentUser();
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

/*
if (isLocal && !user) {
    console.warn("⚠️ Entwicklungsumgebung erkannt: Fake-Admin aktiviert!");
    
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
*/

if (!user) {
    window.location.href = "/"; // Zurück zum Login
} else {
    // A. Benutzernamen & E-Mail auslesen
    const email = user.email;
    const fullName = user.user_metadata.full_name || "Unbekannt";
    
    console.log(`Eingeloggt als: ${fullName} (${email})`);
    
    const roles = user.app_metadata.roles || [];
    const isAdmin = roles.includes("admin");

    // Admin-Funktionen freischalten
    if (isAdmin) {
        console.log("Admin-Rechte erkannt.");
    } else {
        console.log("Nur User-Rechte.");
    }
}

const output = document.getElementById("output");
const input = document.getElementById("input");
const btnLaden = document.getElementById("btnLaden");
const btnSpeichern = document.getElementById("btnSpeichern");

btnLaden.addEventListener('click', e => {

});

btnSpeichern.addEventListener('click', e => {
    const playerName = input.value;
    const save = new SaveGame(playerName, 1);
    console.log("Save erstellt:");
    console.log(save.player);


});