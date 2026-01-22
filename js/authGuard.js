// js/authGuard.js

import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// Fertige Verbindung aus der config.js holen
import { auth, db } from "./config.js";

const provider = new GoogleAuthProvider();

// HTML Elemente prüfen ob sie existieren
const btnLogin = document.getElementById("btnLogin");
const topBtnLogout = document.getElementById("topBtnLogout");

// --- LOGIN / LOGOUT BUTTONS ---
if (btnLogin) {
    btnLogin.addEventListener("click", () => signInWithPopup(auth, provider));
}
if (topBtnLogout) {
    topBtnLogout.addEventListener("click", () => signOut(auth));
}

// --- ÜBERWACHUNG ---
onAuthStateChanged(auth, async (user) => {
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.endsWith("index.html") || currentPath.endsWith("/");

    if (user) {
        // === EINGELOGGT ===
        try {
            // Whitelist Check
            const whitelistRef = doc(db, "whitelist", user.email);
            const snapshot = await getDoc(whitelistRef);

            if (snapshot.exists()) {
                // Redirect: Wenn auf der Login-Seite -> ab ins Spiel
                if (isLoginPage) {
                    window.location.href = "start.html";
                }
            } else {
                throw new Error("Nicht auf Whitelist");
            }
        } catch (e) {
            alert("Zugriff verweigert!");
            await signOut(auth);
            window.location.href = "index.html";
        }
    } else {
        // === AUSGELOGGT ===
        if (!isLoginPage) {
            window.location.href = "index.html";
        }
    }
});