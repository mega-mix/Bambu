// js/config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDzHEMSShjWa5eZwrDGojwoe08UWZxNFVg",
    authDomain: "bambu-4d63e.firebaseapp.com",
    projectId: "bambu-4d63e",
    storageBucket: "bambu-4d63e.firebasestorage.app",
    messagingSenderId: "5255686189",
    appId: "1:5255686189:web:7875a815d3729006e0b0a4"
};

// Initialisieren
const app = initializeApp(firebaseConfig);

// Exportieren (damit andere Skripte es nutzen können)
export const auth = getAuth(app);
export const db = getFirestore(app);