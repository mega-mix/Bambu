// js/model/viewHandler.js

// ### Kümmert sich um die Darstellung auf der Seite ###

export class ViewHandler {
    constructor(saveGame, aktuelleStadt) {
        this.startName = document.getElementById("startName"); // Feld für Spielernamen erstellen
        this.topInfo = document.getElementById("topInfo");  // Konsole in TopBar erstellen

        this.mySaveGame = saveGame; // Spielstand für Werte zum anzeigen
        this.aktuelleStadt = aktuelleStadt; // Daten der aktuellen Stadt für Werte
        this.cache = []; // Cache für HTML Elemente die Daten ziehen
        this.buttonCache = []; // Cache für Buttons die Liquidität prüfen
        this.globalCache = []; // Cache für HTML Elemente mit Globalen Daten
    }

    // --- Seitenwechsel ---
    switchView(viewName) {
        // 1. Alle Views verstecken
        document.querySelectorAll(".view").forEach(div => {
            div.classList.remove("active");
        });

        // 2. Den gewünschten View anzeigen
        const targetView = document.getElementById(viewName);
        if (targetView) {
            targetView.classList.add("active");
        }
    }

    // --- mySaveGame aktualisieren ---
    updateSaveGame(saveGame) {
        this.mySaveGame = saveGame;
    }

    // --- aktuelleStadt aktualisieren ---
    updateStadt(stadt) {
        this.aktuelleStadt = stadt;
    }

    // --- Füllen der Chachs mit den vorhandenen HTML Elementen ---
    setGame(saveGame) {
        // 1. mySaveGame aktualisieren
        this.mySaveGame = saveGame;
        
        // 2. Elementen mit "data-bind" finden und speichern
        const elements = document.querySelectorAll("[data-bind]");
        
        // 3. Cache mit Element und Pfad aus "data-bind" füllen
        this.cache = []; // Reset
        elements.forEach(el => {
            this.cache.push({
                element: el,          // Das HTML-Element selbst
                path: el.dataset.bind // Der Pfad z.B. "lagerhaus.gold"
                // data-bind wird angesprochen über
                // .dateset (aus data-)
                // .bind (aus bind) Bindestrich entfällt und CamelCase wird angewendet
            });
        });

        // 4. ButtonCache mit Element und Gebäudename aus "data-check-cost" füllen
        this.buttonCache = []; // Reset
        document.querySelectorAll("[data-check-cost]").forEach(btn => {
            this.buttonCache.push({
                element: btn,                       // Das HTML-Element selbst
                targetName: btn.dataset.checkCost   // Der Name des Gebäudes
                // data-check-cost wird angesprochen über
                // .dateset (aus data-)
                // .checkCoast (aus check-coast) Bindestrich entfällt und CamelCase wird angewendet
            });
        });

        // 5. Cache mit Element und Pfad aus "data-bind" füllen
        this.globalCache = []; // Reset
        document.querySelectorAll("[data-bind-global]").forEach(el => {
            this.globalCache.push({
                element: el,          // Das HTML-Element selbst
                path: el.dataset.bindGlobal // Der Pfad z.B. "lagerhaus.gold"
                // data-bind wird angesprochen über
                // .dateset (aus data-)
                // .bind (aus bind) Bindestrich entfällt und CamelCase wird angewendet
            });
        });

        // 6. Update der Daten durchführen
        this.update();
    }

    // --- Update der HTML Elemente aus den Cachs ---
    update() {
        if (!this.aktuelleStadt) return;

        // 1. Werte in HTML Elemente (aus Cache) schreiben
        this.cache.forEach(item => {
            const wert = this.resolvePath(item.path, this.aktuelleStadt);
            
            if (item.element.tagName === "INPUT" || item.element.tagName === "TEXTAREA") {
                // Input feld
                if (document.activeElement === item.element) { return; } // Nicht überschreiben wenn Item Fokus hat

                if (item.element.value != wert) {
                    item.element.value = wert;
                }

            } else {
                // Kein Input oder Textarea
                if (item.element.innerText != wert) {
                    // Nur schreiben wenn sich etwas geändert hat
                    if (typeof wert === 'number') {
                        item.element.innerText = Math.floor(wert);
                    } else {
                        item.element.innerText = wert;
                    }
                }
            }
            
        });

        // 2. Buttons (aus ButtonCache) prüfen
        const lager = this.aktuelleStadt.bauwerke.lagerhaus;
        const rathaus = this.aktuelleStadt.bauwerke.rathaus;
        const kaserne = this.aktuelleStadt.bauwerke.kaserne;

        this.buttonCache.forEach(item => {
            const data = this.resolvePath(item.targetName, this.aktuelleStadt); // Objekt holen

            if (data.tag === "BAUWERK") {
                const inSchleife = this.aktuelleStadt.bauwerke.isGebaeudeInBauschleife(data.name); // Prüfen ob schon in Bauschleife vorhanden
                const schleifeVoll = this.aktuelleStadt.bauwerke.isBauschleifeVoll(); // Prüfen ob Bauschleife voll ist
                const preisOk = this.checkAffordability(lager, data); // Prüfen ob genug Rohstoffe vorhanden sind
                const levelOk = data.level < rathaus.level || data === rathaus; // Prüfen ob Rathaus Level ok oder Rathaus selbst
                const kannKaufen = (!inSchleife && !schleifeVoll && preisOk && levelOk); // Vorprüfungen sind ok?
                
                // Button aktivieren oder deaktivieren
                item.element.disabled = !kannKaufen; // disabled = true (wenn man es NICHT kaufen kann)
            }

            if (data.tag === "EINHEIT") {
                const schleifeVoll = this.aktuelleStadt.einheiten.isAusbildungsschleifeVoll(); // Prüfen ob Ausbildungsschleife voll ist
                const inSchleife = this.aktuelleStadt.einheiten.isEinheitInSchleife(data); // Prüfen ob bereits in Ausbildungsschleife drin
                const preisOk = this.checkAffordability(lager, data); // Prüfen ob genug Rohstoffe vorhanden sind
                const levelOk = kaserne.level > 0; // Prüfen ob Kaserne Level ok
                const kannKaufen = ((!schleifeVoll || inSchleife) && preisOk && levelOk); // Vorprüfungen sind ok?
                
                // Button aktivieren oder deaktivieren
                item.element.disabled = !kannKaufen; // disabled = true (wenn man es NICHT kaufen kann)
            }
        });

        // 3. Werte in HTML Elemente (aus globalCache) schreiben
        this.globalCache.forEach(item => {
            const wert = this.resolvePath(item.path, this.mySaveGame);
            
            if (item.element.tagName === "INPUT" || item.element.tagName === "TEXTAREA") {
                // Input feld
                if (document.activeElement === item.element) { return; } // Nicht überschreiben wenn Item Fokus hat

                if (item.element.value != wert) {
                    item.element.value = wert;
                }

            } else {
                // Kein Input oder Textarea
                if (item.element.innerText != wert) {
                    // Nur schreiben wenn sich etwas geändert hat
                    if (typeof wert === 'number') {
                        item.element.innerText = Math.floor(wert);
                    } else {
                        item.element.innerText = wert;
                    }
                }
            }
            
        });
    }

    // --- Wert aus Pfad lesen ---
    resolvePath(path, obj) {
        // Teilt String an Punkten und gibt Werte passend zurück
        return path.split('.').reduce((prev, curr) => {
            return prev ? prev[curr] : undefined;
        }, obj);
    }

    // --- Liquiditätsprüfung ---
    checkAffordability(lager, data) {
        // Prüfen ob Kosten definiert sind
        // Falls undefined, nehme 0
        const kostenGold = data.kostenGold || 0;
        const kostenHolz = data.kostenHolz || 0;
        const kostenStein = data.kostenStein || 0;

        return (
            lager.gold >= kostenGold &&
            lager.holz >= kostenHolz &&
            lager.stein >= kostenStein
        );
    }

    // --- Konsole in TopBar schreiben ---
    setTopInfo(info) {
        this.topInfo.innerHTML = info;
        setTimeout(() => {
            this.topInfo.innerHTML = this.aktuelleStadt.name;
        }, 5000);
    }

    /// --- Element StartName schreiben ---
    setStartName(name) {
        this.startName.innerHTML = name;
    }
}