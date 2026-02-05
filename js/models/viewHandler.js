// js/model/viewHandler.js

// ### Kümmert sich um die Darstellung auf der Seite ###

export class ViewHandler {
    constructor(saveGame, aktuelleStadt) {
        this.startName = document.getElementById("startName"); // Feld für Spielernamen erstellen
        this.topInfo = document.getElementById("topInfo");  // Konsole in TopBar erstellen
        this.postMarker = document.getElementById("postMarker");

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

        // 4. Elemente Ein- und Ausblenden
        if (this.postMarker) {
            if (this.mySaveGame.post.ungeleseneAnzahl > 0) {
                this.postMarker.classList.remove("hidden");
            } else {
                this.postMarker.classList.add("hidden");
            }
        }
    }

    // --- Wert aus Pfad lesen ---
    resolvePath(path, obj) {
        // 1. Ersetze Klammern durch Punkte: "list[0]" wird zu "list.0"
        const cleanPath = path.replace(/\[/g, '.').replace(/\]/g, '');

        // 2. Teilt String an Punkten und gibt Werte passend zurück
        return cleanPath.split('.').reduce((prev, curr) => {
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

    // --- Schieberegler in Armee vorbereiten ---
    prepareAttackView() {
        const einheiten = this.aktuelleStadt.einheiten; //
    
        const setupRange = (id, max, outId) => {
            const el = document.getElementById(id);
            const out = document.getElementById(outId);
            if (el && out) {
                el.max = max;
                el.value = 0;
                out.innerText = "0";
                el.oninput = () => { out.innerText = el.value; };
            }
        };

        setupRange("ui-range-schwert", einheiten.anzahlSchwert, "ui-out-schwert");
        setupRange("ui-range-speer", einheiten.anzahlSpeer, "ui-out-speer");
        setupRange("ui-range-bogen", einheiten.anzahlBogen, "ui-out-bogen");
    }

    // --- Postfach View updaten ---
    updatePostfach() {
        const container = document.getElementById("post-liste-container");
        if (!container || !this.mySaveGame.post) return;

        container.innerHTML = ""; // Container leeren

        this.mySaveGame.post.liste.forEach(msg => {
            const div = document.createElement("div");
            div.className = `list-group-item bg-dark text-white border-secondary mb-2 ${msg.gelesen ? 'opacity-75' : 'fw-bold border-start border-info border-4'}`;
        
            div.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-1">${msg.betreff}</h5>
                    <small class="text-muted">${msg.datum}</small>
                </div>
                <p class="mb-2">${msg.text}</p>
    
                <div class="row g-2 mb-3">
                    <div class="col-6">
                        <div class="p-2 bg-body-tertiary rounded border border-secondary h-100">
                            <p class="fw-bold mb-1 small text-success">Verluste Angreifer:</p>
                            <p class="mb-0 small">Schwert: ${msg.daten.verluste.angreifer.schwert} / ${msg.daten.armee.angreifer.schwert}</p>
                            <p class="mb-0 small">Speer: ${msg.daten.verluste.angreifer.speer} / ${msg.daten.armee.angreifer.speer}</p>
                            <p class="mb-0 small">Bogen: ${msg.daten.verluste.angreifer.bogen} / ${msg.daten.armee.angreifer.bogen}</p>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="p-2 bg-body-tertiary rounded border border-secondary h-100">
                            <p class="fw-bold mb-1 small text-success">Verluste Verteidiger:</p>
                            <p class="mb-0 small">Schwert: ${msg.daten.verluste.verteidiger.schwert} / ${msg.daten.armee.verteidiger.schwert}</p>
                            <p class="mb-0 small">Speer: ${msg.daten.verluste.verteidiger.speer} / ${msg.daten.armee.verteidiger.speer}</p>
                            <p class="mb-0 small">Bogen: ${msg.daten.verluste.verteidiger.bogen} / ${msg.daten.armee.verteidiger.bogen}</p>
                            <p class="mb-0 small">Mauerbonus: ${msg.daten.mauer}</p>
                        </div>
                    </div>
                </div>
                <div class="row g-2 mb-3">
                    <div class="col-12">
                        <div class="p-2 bg-body-tertiary rounded border border-secondary h-100">
                            <p class="fw-bold mb-1 small text-success">Beute:</p>
                            <div class="d-flex gap-3">
                                <span class="mb-0 small">Gold: ${msg.daten.gold}</span>
                                <span class="mb-0 small">Holz: ${msg.daten.holz}</span>
                                <span class="mb-0 small">Stein: ${msg.daten.stein}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="d-flex gap-2">
                    ${!msg.gelesen ? `<button class="btn btn-sm btn-info" onclick="window.msgGelesen('${msg.id}')">Gelesen</button>` : ''}
                    <button class="btn btn-sm btn-outline-danger" onclick="window.msgLoeschen('${msg.id}')">Löschen</button>
                </div>
            `;
            container.appendChild(div);
        });
    }

    // --- Quest View update ---
    updateQuests() {
        const container = document.getElementById("quest-liste-container");
        if (!container || !this.mySaveGame.quests) return;

        container.innerHTML = ""; // Container leeren

        this.mySaveGame.quests.questList.forEach((quest, index) => {
            const div = document.createElement("div");
        
            div.innerHTML = `
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>${quest.name}</span>
                        <button class="btn btn-sm btn-secondary" data-action="prepareAngriffQuest" data-target-id="quest_${index}">Angriff planen</button>
                    </div>
                    <div class="card-body">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent text-white">
                                <span>Schwertkämpfer: <span>${quest.einheiten.anzahlSchwert}</span></span>
                                <span>Speerträger: <span>${quest.einheiten.anzahlSpeer}</span></span>
                                <span>Bogenschützen: <span>${quest.einheiten.anzahlBogen}</span></span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent text-white">
                                <span>Mauer Stufe: <span>${quest.bauwerke.stadtmauer.verteidigung}</span></span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent text-white">
                                Beute
                                <span class="badge bg-warning text-dark border border-warning">
                                    Gold: <span>${quest.beute.gold}</span>
                                </span>
                                <span class="badge bg-success border border-success">
                                    Holz: <span>${quest.beute.holz}</span>
                                </span>
                                <span class="badge bg-secondary border border-secondary">
                                    Stein: <span>${quest.beute.stein}</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <br>
            `;
            container.appendChild(div);
        });
    }
}