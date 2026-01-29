// js/models/FirebaseStorage.js

import { doc, setDoc, getDoc, collection, getDocs, addDoc, query, where, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
     * @param {Object} data - Das komplette SaveGame Objekt
     */
    async save(data) {
        try {
            const user = this._getUser();
            const plainData = JSON.parse(JSON.stringify(data));
            
            // 1. Speichern unter "savegames/USER_ID" (Privat)
            await setDoc(doc(this.db, "savegames", user.uid), plainData);
            
            // 2. Öffentliche Daten speichern ("Telefonbuch" für andere Spieler) [NEU]
            await this._savePublicData(data, user);

            //console.log("💾 Erfolgreich gespeichert");
            return true;
        } catch (error) {
            console.error("❌ Fehler beim Speichern:", error);
            throw error;
        }
    }

    // --- Hilfsmethode um öffentliche Daten zu extrahieren ---
    async _savePublicData(saveGame, user) {
        // Wir gehen durch alle Städte und sammeln die Infos für Angreifer
        const publicCities = saveGame.staedte.map(stadt => {
            const lager = stadt.bauwerke.lagerhaus;
            const mauer = stadt.bauwerke.stadtmauer;
            const einheiten = stadt.einheiten;

            return {
                name: stadt.name,
                verteidigung: stadt.verteidigungGesamt,
                mauerLevel: mauer.level,
                
                // Einheitenanzahl (Spionage-Infos)
                anzahlSchwert: einheiten.anzahlSchwert,
                anzahlSpeer: einheiten.anzahlSpeer,
                anzahlBogen: einheiten.anzahlBogen,

                // Plünderbare Ressourcen (Wir sagen mal 50% sind ungeschützt)
                lootableGold: Math.floor(lager.gold * 0.5),
                lootableHolz: Math.floor(lager.holz * 0.5),
                lootableStein: Math.floor(lager.stein * 0.5)
            };
        });

        const publicInfo = {
            playerName: saveGame.playerName,
            userId: user.uid, // Wichtig für den Angriff später
            cities: publicCities,
            lastUpdate: Date.now()
        };

        // Speichern in "publicPlayers" Collection
        await setDoc(doc(this.db, "publicPlayers", user.uid), publicInfo);
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

    // --- Lädt alle FEINDLICHEN Spieler ---
    async loadEnemyPlayers() {
        try {
            const user = this._getUser();
            const querySnapshot = await getDocs(collection(this.db, "publicPlayers"));
            
            const enemies = [];
            querySnapshot.forEach((doc) => {
                // Nicht mich selbst in die Liste packen
                if (doc.id !== user.uid) {
                    enemies.push(doc.data());
                }
            });
            return enemies;
        } catch (error) {
            console.error("❌ Fehler beim Laden der Gegner:", error);
            return [];
        }
    }

    // --- Briefkasten - Angriff senden ---
    async sendBattleResult(targetUserId, lootData) {
        // lootData sollte enthalten: { gold: 100, holz: 50, deadSchwert: 2, ... }
        try {
            const user = this._getUser();
            
            const battleReport = {
                attackerName: user.displayName, // Wer hat angegriffen?
                targetId: targetUserId,         // Für wen ist der Brief?
                timestamp: Date.now(),
                ...lootData                     // Die Beute und Verluste
            };

            // In die "battles" Sammlung werfen
            await addDoc(collection(this.db, "battles"), battleReport);
            console.log("⚔️ Kampfergebnis versendet!");
        } catch (error) {
            console.error("❌ Fehler beim Senden des Angriffs:", error);
        }
    }

    // --- Briefkasten leeren (Beim Login) ---
    async checkInbox() {
        try {
            const user = this._getUser();
            
            // Suche alle Dokumente in "battles", wo targetId == MEINE ID ist
            const q = query(
                collection(this.db, "battles"), 
                where("targetId", "==", user.uid)
            );

            const snapshot = await getDocs(q);
            const attacks = [];

            // Alle Berichte sammeln und sofort LÖSCHEN (damit sie nicht 2x wirken)
            for (const docSnap of snapshot.docs) {
                attacks.push(docSnap.data());
                await deleteDoc(docSnap.ref); // Brief verbrennen
            }

            return attacks; // Gibt Array mit Angriffen zurück
        } catch (error) {
            console.error("❌ Fehler beim Prüfen der Inbox:", error);
            return [];
        }
    }
}