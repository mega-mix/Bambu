// js/models/storageModule.js

import { auth, db } from "./config.js";
import FirebaseStorage from "../models/FirebaseStorage.js";

export class storageModule{
    constructor() {
        this.storage = new FirebaseStorage(db, auth);
    }

    async saveData(saveGame) {
        if (!auth.currentUser) return; 

        await storage.save(saveGame);
        console.log("gespeichert...");
    }

    async loadData() {
        if (!auth.currentUser) return;

        const data = await storage.load();
        if (data) {
            console.log("geladen...");
            return data.characterName;
        }
        console.log("Fehler beim laden!");
    }
}