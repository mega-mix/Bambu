import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export default class FirebaseStorage {
    /**
     * @param {Object} db - Die Firestore Datenbank-Instanz
     * @param {Object} auth - Die Authentication Instanz (um die User-ID zu holen)
     */
    constructor(db, auth) {
        this.db = db;
        this.auth = auth;
    }

    // Hilfsmethode: Checkt, ob wir bereit sind
    _getUser() {
        const user = this.auth.currentUser;
        if (!user) throw new Error("Nicht eingeloggt! Speichern/Laden nicht möglich.");
        return user;
    }

    /**
     * Speichert ein beliebiges Objekt in die Cloud
     * @param {Object} data 
     */
    async save(data) {
        try {
            const user = this._getUser();
            // Wir speichern unter "savegames/USER_ID"
            await setDoc(doc(this.db, "savegames", user.uid), data);
            console.log("✅ Erfolgreich gespeichert für User:", user.uid);
            return true;
        } catch (error) {
            console.error("❌ Fehler beim Speichern:", error);
            throw error;
        }
    }

    /**
     * Lädt die Daten des aktuellen Users
     * @returns {Object|null} Die Daten oder null, wenn nichts existiert
     */
    async load() {
        try {
            const user = this._getUser();
            const docRef = doc(this.db, "savegames", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("✅ Daten geladen.");
                return docSnap.data();
            } else {
                console.warn("⚠️ Kein Spielstand gefunden.");
                return null;
            }
        } catch (error) {
            console.error("❌ Fehler beim Laden:", error);
            throw error;
        }
    }
}