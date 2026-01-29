// js/models/storageModul.js

import { auth, db } from "../config.js";
import FirebaseStorage from "./FirebaseStorage.js";

export class StorageModul {
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
            return null;
        }
    }

    // --- Multiplayer Funktionen durchreichen ---

    async loadEnemyPlayers() {
        if (!auth.currentUser) return [];
        return await this.storage.loadEnemyPlayers();
    }

    async sendBattleResult(targetUserId, lootData) {
        if (!auth.currentUser) return;
        await this.storage.sendBattleResult(targetUserId, lootData);
    }

    async checkInbox() {
        if (!auth.currentUser) return [];
        return await this.storage.checkInbox();
    }
}