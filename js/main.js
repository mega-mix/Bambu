// Importiere Firebase Module
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// Für den Whitelist-Check
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Modell importieren
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

// Instanz der Speicher-Klasse erstellen
const storage = new FirebaseStorage(db, auth);


// --- LOGIN LOGIK ---
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");

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

// --- WHITELIST CHECK ---
onAuthStateChanged(auth, async (user) => {
    // Wo sind wir gerade? (Pfad checken)
    const currentPath = window.location.pathname;
    // Prüfen, ob wir auf der Startseite (Spiel) sind
    const isGamePage = currentPath.includes("start.html");

    if (user) {
        // === USER IST EINGELOGGT ===
        console.log("Eingeloggt als:", user.email);

        try {
            // 1. Whitelist Check (wie vorher)
            const whitelistRef = doc(db, "whitelist", user.email);
            const snapshot = await getDoc(whitelistRef);

            if (!snapshot.exists()) {
                throw new Error("Nicht auf der Whitelist");
            }

            // 2. Zugriff ERLAUBT:
            // Wenn wir noch auf der Login-Seite (index.html) sind -> Weiterleiten zum Spiel!
            if (!isGamePage) {
                console.log("Weiterleitung zum Spiel...");
                window.location.href = "start.html";
            }
            
            // Wenn wir schon auf start.html sind, bleiben wir einfach hier.

        } catch (error) {
            console.warn("⛔ Zugriff verweigert:", user.email);
            alert("Keine Berechtigung!");
            await signOut(auth);
            window.location.href = "index.html";
        }

    } else {
        // === NICHT EINGELOGGT ===
        console.log("Nicht angemeldet.");

        // Wenn jemand versucht, start.html ohne Login aufzurufen -> Rauswurf!
        if (isGamePage) {
            console.warn("Unerlaubter Zugriff auf Spielseite -> Rauswurf.");
            window.location.href = "index.html";
        }
        
        // Auf der index.html bleiben wir einfach und zeigen den Login-Button (falls vorhanden)
        if (divLogin) divLogin.style.display = "block";
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