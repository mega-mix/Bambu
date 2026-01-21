import SaveGame from "./models/SaveGame.js";

const user = netlifyIdentity.currentUser();

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