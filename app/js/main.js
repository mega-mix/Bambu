// Importiere Firebase Module
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Dein Modell importieren
import FirebaseStorage from "./models/FirebaseStorage.js";

// --- KONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyDzHEMSShjWa5eZwrDGojwoe08UWZxNFVg",
    authDomain: "bambu-4d63e.firebaseapp.com",
    projectId: "bambu-4d63e",
    storageBucket: "bambu-4d63e.firebasestorage.app",
    messagingSenderId: "5255686189",
    appId: "1:5255686189:web:7875a815d3729006e0b0a4"
};

// --- INITIALISIERUNG ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Instanz unserer Speicher-Klasse erstellen
const storage = new FirebaseStorage(db, auth);


// --- LOGIN LOGIK ---
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const divApp = document.getElementById("appArea"); // Der Bereich mit dem Spiel
const divLogin = document.getElementById("loginArea"); // Der Bereich mit dem Login-Button

// Login Button
if (btnLogin) {
    btnLogin.addEventListener("click", () => {
        signInWithPopup(auth, provider)
            .catch((error) => console.error("Login fehlgeschlagen:", error));
    });
}

// Logout Button
if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        signOut(auth);
    });
}

// Der "Türsteher" (Observer) - Feuert automatisch bei Statusänderung
onAuthStateChanged(auth, (user) => {
    if (user) {
        // === USER IST DRIN ===
        console.log("Angemeldet als:", user.displayName);
        divLogin.style.display = "none";
        divApp.style.display = "block";
        
        // Optional: Direkt beim Login laden?
        // loadGameData(); 
    } else {
        // === USER IST DRAUSSEN ===
        console.log("Nicht angemeldet.");
        divLogin.style.display = "block";
        divApp.style.display = "none";
    }
});


// --- APP LOGIK (Speichern / Laden Buttons) ---
const btnSave = document.getElementById("btnSave");
const btnLoad = document.getElementById("btnLoad");
const inputData = document.getElementById("gameInput");

if (btnSave) {
    btnSave.addEventListener("click", async () => {
        const spielstand = {
            level: 1,
            characterName: inputData.value || "Unbekannt",
            timestamp: new Date().toISOString()
        };
        
        // Nutzung der ausgelagerten Klasse
        await storage.save(spielstand);
        alert("Gespeichert!");
    });
}

if (btnLoad) {
    btnLoad.addEventListener("click", async () => {
        // Nutzung der ausgelagerten Klasse
        const data = await storage.load();
        
        if (data) {
            inputData.value = data.characterName;
            alert("Geladen: " + JSON.stringify(data));
        } else {
            alert("Nichts gefunden!");
        }
    });
}