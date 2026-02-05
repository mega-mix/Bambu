// js/models/nachrichten.js

export class Nachrichten {
    constructor() {
        this.liste = []; // Enthält Objekte: { id, sender, betreff, text, gelesen, datum, daten }
    }

    // --- Nachricht hinzufügen ---
    add(sender, betreff, text, extraDaten = {}) {
        this.liste.unshift({ // Neue Nachrichten nach oben
            id: Date.now() + Math.random(),
            sender: sender,
            betreff: betreff,
            text: text,
            gelesen: false,
            datum: new Date().toLocaleString(),
            daten: extraDaten
        });
    }

    // --- Nachricht löschen ---
    loeschen(id) {
        this.liste = this.liste.filter(n => n.id != id);
    }

    // --- Als gelesen markieren ---
    markiereGelesen(id) {
        const n = this.liste.find(msg => msg.id == id);
        if (n) n.gelesen = true;
    }

    // --- Gibt anzahl ungelesener zurück ---
    get ungeleseneAnzahl() {
        return this.liste.filter(n => !n.gelesen).length;
    }

    // --- Spielstand laden ---
    applyData(data) {
        if (data && data.liste) this.liste = data.liste;
    }
}