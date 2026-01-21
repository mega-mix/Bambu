// js/models/storageModule.js

import { auth, db } from "../config.js";
import FirebaseStorage from "./FirebaseStorage.js";

export class StorageModul{
    constructor() {
        this.storage = new FirebaseStorage(db, auth);
    }

    async saveData(saveGame) {
        if (!auth.currentUser) return; 

        await this.storage.save(saveGame);
    }

    async loadData() {
        if (!auth.currentUser) return;

        const data = await this.storage.load();
        if (data) {
            return data;
        } else {
            return null
        }
    }
}