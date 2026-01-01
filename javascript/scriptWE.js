/* ============================================================
   TEIL 1 — COLLAPSIBLES + TAB-SWITCHER
   ============================================================ */

/* ------------------------------------------------------------
   Collapsible-Helferfunktionen
   ------------------------------------------------------------ */

// Alle Collapsibles schließen
function closeAllCollapsibles() {
    document.querySelectorAll("table.collapsible")
        .forEach(c => c.classList.add("collapsed"));
}

// Ein einzelnes Collapsible öffnen
function openCollapsible(c) {
    c.classList.remove("collapsed");
}


/* ------------------------------------------------------------
   Collapsible-Zustand speichern & wiederherstellen
   ------------------------------------------------------------ */

document.querySelectorAll("table.collapsible").forEach(table => {
    const id = table.id;

    // Zustand aus localStorage wiederherstellen
    const saved = localStorage.getItem("collapse_" + id);
    if (saved === "1") {
        table.classList.add("collapsed");
    }

    // Caption finden
    const caption = table.querySelector("caption");
    if (!caption) {
        console.warn("Keine Caption gefunden für Tabelle:", id);
        return;
    }

    caption.style.cursor = "pointer";

    // Klick-Event für Collapsible
    caption.addEventListener("click", () => {
        table.classList.toggle("collapsed");

        const isCollapsed = table.classList.contains("collapsed");
        localStorage.setItem("collapse_" + id, isCollapsed ? "1" : "0");
    });
});


/* ------------------------------------------------------------
   TAB-SWITCHER (mit Suchlogik B) + NavBar Theme
   ------------------------------------------------------------ */

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const navbar = document.querySelector(".navbar");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        /* ------------------------------
           1) Tab-Buttons aktivieren
           ------------------------------ */
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        /* ------------------------------
           2) Tab-Inhalte umschalten
           ------------------------------ */
        const tab = btn.dataset.tab;

        tabContents.forEach(c => {
            c.classList.remove("active");
            if (c.id === tab) c.classList.add("active");
        });

        /* ------------------------------
           3) NavBar Theme setzen
              (Excel → grün, Word → blau, Science → orange)
           ------------------------------ */
        const theme = btn.dataset.theme; // excel | word | science

        // alte Theme-Klassen entfernen
        navbar.classList.remove("excel", "word", "science");

        // neue Theme-Klasse setzen
        navbar.classList.add(theme);

        /* ------------------------------
           4) Collapsibles steuern
              (Logik B: Treffer öffnen)
           ------------------------------ */
        const value = searchInput.value.trim().toLowerCase();
        const words = value.split(/\s+/).filter(w => w.length > 0);

        // Erst alles schließen
        closeAllCollapsibles();

        // Nur Tabellen im aktiven Tab
        const tabTables = document.querySelectorAll(`#${tab} table.collapsible`);

        if (value === "") {
            // Keine Suche → alle öffnen
            tabTables.forEach(table => openCollapsible(table));
        } else {
            // Suche aktiv → nur Treffer öffnen
            let firstHit = null;

            tabTables.forEach(table => {
                const text = table.innerText.toLowerCase();
                const match = words.every(w => text.includes(w));

                if (match) {
                    openCollapsible(table);
                    if (!firstHit) firstHit = table;
                }
            });

            // Optional: sanft zum ersten Treffer scrollen
            if (firstHit) {
                firstHit.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    });
});


/* ============================================================
   TEIL 2 — X‑BUTTON (Tabs schließen) + RESET (Suchfeld‑X)
   ============================================================ */


/* ------------------------------------------------------------
   X‑BUTTON: Tabs schließen, aber Suchergebnis behalten
   ------------------------------------------------------------ */
/*
   Deine gewünschte Logik (Frage 2 = 3):

   ✔ Tabs schließen (kein Tab aktiv)
   ✔ Tab‑Contents schließen
   ✔ Suche bleibt bestehen
   ✔ Treffer bleiben sichtbar
   ✔ Collapsibles bleiben wie sie sind
   ✔ Tabs werden NICHT gelöscht, nur deaktiviert
*/

const closeTabsBtn = document.getElementById("closeTabsBtn");

if (closeTabsBtn) {
    closeTabsBtn.addEventListener("click", () => {

        // 1) Alle Tab‑Buttons deaktivieren
        tabButtons.forEach(b => b.classList.remove("active"));

        // 2) Alle Tab‑Inhalte deaktivieren
        tabContents.forEach(c => c.classList.remove("active"));

        // 3) Tabs wieder einblenden (falls Suche Tabs ausgeblendet hat)
        tabButtons.forEach(btn => btn.style.display = "");

        // 4) Collapsibles NICHT verändern
        //    → Suchergebnis bleibt exakt so wie es ist

        // 5) Kleine Klick‑Animation (optional)
        closeTabsBtn.classList.add("clicked");
        setTimeout(() => closeTabsBtn.classList.remove("clicked"), 150);
    });
}


/* ------------------------------------------------------------
   RESET (Suchfeld‑X): Suche löschen & alles wiederherstellen
   ------------------------------------------------------------ */
/*
   Deine gewünschte Logik:

   ✔ Suche löschen
   ✔ Alles wieder sichtbar
   ✔ Alle Collapsibles öffnen
   ✔ Tabs wieder sichtbar
   ✔ Tabs NICHT automatisch aktivieren
*/

searchReset.addEventListener("click", () => {

    // Eingabe zurücksetzen
    searchInput.value = "";
    searchReset.style.display = "none";
    searchCount.textContent = "";

    const sections = document.querySelectorAll(".tab-content");
    const tables = document.querySelectorAll(".tab-content table");
    const rows = document.querySelectorAll(".tab-content tbody tr");
    const headings = document.querySelectorAll(".tab-content h2");

    // Alles wieder anzeigen
    sections.forEach(s => s.style.display = "");
    tables.forEach(t => t.style.display = "");
    rows.forEach(r => {
        r.style.display = "";
        removeHighlights(r);
    });
    headings.forEach(h => h.style.display = "");

    // Collapsibles wieder vollständig öffnen
    closeAllCollapsibles();
    document.querySelectorAll("table.collapsible").forEach(openCollapsible);

    // Tabs wieder einblenden
    tabButtons.forEach(btn => btn.style.display = "");
});

/* ============================================================
   TEIL 3 — SUCHE (α) ÜBER ALLE TABS HINWEG
   ============================================================ */

/*
   Deine gewünschte Logik (Frage 3 = α):

   ✔ Suche wirkt über ALLE Tabs gleichzeitig
   ✔ Tabs wechseln NICHT automatisch
   ✔ Treffer‑Collapsibles öffnen sich
   ✔ Nicht‑Treffer schließen sich
   ✔ Tabs ohne Treffer werden ausgeblendet
   ✔ Tabs mit Treffern bleiben sichtbar
*/

searchInput.addEventListener("input", () => {

    /* --------------------------------------------------------
       1) Suchbegriff vorbereiten
       -------------------------------------------------------- */
    const value = searchInput.value.trim().toLowerCase();
    const words = value.split(/\s+/).filter(w => w.length > 0);

    searchReset.style.display = value ? "inline-block" : "none";

    const sections = document.querySelectorAll(".tab-content");
    const tables = document.querySelectorAll(".tab-content table");
    const rows = document.querySelectorAll(".tab-content tbody tr");
    const headings = document.querySelectorAll(".tab-content h2");

    // Alte Highlights entfernen
    rows.forEach(r => removeHighlights(r));


    /* --------------------------------------------------------
       FALL 1: Suchfeld leer → alles wieder normal
       -------------------------------------------------------- */
    if (!value) {

        // Alles wieder anzeigen
        sections.forEach(s => s.style.display = "");
        tables.forEach(t => t.style.display = "");
        rows.forEach(r => r.style.display = "");
        headings.forEach(h => h.style.display = "");

        // Collapsibles vollständig öffnen
        closeAllCollapsibles();
        document.querySelectorAll("table.collapsible").forEach(openCollapsible);

        // Tabs wieder einblenden
        tabButtons.forEach(btn => btn.style.display = "");

        // Trefferzähler zurücksetzen
        searchCount.style.display = "none";
        searchCount.textContent = "";

        return;
    }


    /* --------------------------------------------------------
       FALL 2: Suche aktiv → nur Treffer anzeigen
       -------------------------------------------------------- */
    let totalHits = 0;

    // Erst alles ausblenden
    sections.forEach(s => s.style.display = "none");
    tables.forEach(t => t.style.display = "none");
    rows.forEach(r => r.style.display = "none");
    headings.forEach(h => h.style.display = "none");


    /* --------------------------------------------------------
       Treffer suchen
       -------------------------------------------------------- */
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const match = words.every(w => text.includes(w));

        if (match) {
            row.style.display = "";
            totalHits++;

            // Highlighting
            highlightRow(row, words);

            // Tabelle sichtbar machen
            const table = row.closest("table");
            table.style.display = "";

            // Tab‑Content sichtbar machen
            const section = row.closest(".tab-content");
            section.style.display = "";

            // Überschrift sichtbar machen
            const h2 = table.previousElementSibling;
            if (h2 && h2.tagName === "H2") h2.style.display = "";
        }
    });


    /* --------------------------------------------------------
       Collapsibles steuern: nur Treffer öffnen
       -------------------------------------------------------- */
    closeAllCollapsibles();

    document.querySelectorAll(".tab-content table").forEach(table => {
        if (table.style.display !== "none") {
            openCollapsible(table);
        }
    });


    /* --------------------------------------------------------
       Tabs ohne Treffer ausblenden
       -------------------------------------------------------- */
    tabButtons.forEach(btn => {
        const tab = btn.dataset.tab;
        const tabContent = document.getElementById(tab);

        // Prüfen, ob dieser Tab Treffer enthält
        const hasHits = [...tabContent.querySelectorAll("table")]
            .some(t => t.style.display !== "none");

        btn.style.display = hasHits ? "" : "none";
    });


    /* --------------------------------------------------------
       Trefferzähler aktualisieren
       -------------------------------------------------------- */
    searchCount.textContent = `${totalHits} Treffer`;
    searchCount.style.display = "inline-block";
});

/* ============================================================
   TEIL 4 — DARK MODE + HIGHLIGHT-SYSTEM
   ============================================================ */


/* ------------------------------------------------------------
   DARK MODE — mit Systempräferenz + LocalStorage
   ------------------------------------------------------------ */

/*
   Funktionen & Logik:

   ✔ Dark‑Mode folgt zuerst der User‑Einstellung (localStorage)
   ✔ Wenn keine User‑Einstellung → System‑Theme verwenden
   ✔ Button toggelt zwischen Light/Dark
   ✔ Icon & Label ändern sich dynamisch
   ✔ Reagiert optional auf System‑Theme‑Wechsel
*/

const darkToggle = document.getElementById("darkToggle");
const darkIcon = document.getElementById("darkToggleIcon");
const darkLabel = document.getElementById("darkToggleLabel");

// Anwenden der CSS‑Klasse + UI‑Update
function applyDarkModeClass(isDark) {
    document.body.classList.toggle("dark", isDark);

    if (isDark) {
        darkIcon.textContent = "☀️";
        darkLabel.textContent = "Light‑Mode";
    } else {
        darkIcon.textContent = "🌙";
        darkLabel.textContent = "Dark‑Mode";
    }
}

// Systempräferenz auslesen
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// User‑Einstellung aus localStorage
const storedTheme = localStorage.getItem("theme");

// Wenn User nichts gespeichert hat → Systemwert nutzen
let isDark = storedTheme === "dark" || (storedTheme === null && prefersDark);

// Initial anwenden
applyDarkModeClass(isDark);

// Toggle‑Button
darkToggle.addEventListener("click", () => {
    isDark = !document.body.classList.contains("dark");
    applyDarkModeClass(isDark);

    // User‑Einstellung speichern
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Optional: Reaktion auf System‑Theme‑Wechsel
if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {

        // Nur reagieren, wenn User NICHT manuell überschrieben hat
        if (localStorage.getItem("theme") === null) {
            applyDarkModeClass(e.matches);
        }
    });
}


/* ------------------------------------------------------------
   HIGHLIGHT-SYSTEM — nur Text, <kbd> bleibt unberührt
   ------------------------------------------------------------ */

/*
   ✔ Entfernt nur <mark>-Elemente
   ✔ Lässt <kbd> und andere HTML‑Strukturen intakt
   ✔ Verhindert kaputte Tastenkombinationen
*/

function removeHighlights(row) {
    row.querySelectorAll("mark.search-highlight")
        .forEach(m => m.replaceWith(m.textContent));
}

// Text highlighting (nur Text, <kbd> bleibt unberührt)
function highlightRow(row, words) {
    row.querySelectorAll("td").forEach(cell => {
        cell.childNodes.forEach(node => {
            if (node.nodeType === 3) { // Nur Textknoten
                let text = node.textContent;
                words.forEach(w => {
                    const re = new RegExp(`(${w})`, "gi");
                    text = text.replace(re, `<mark class="search-highlight">$1</mark>`);
                });
                const span = document.createElement("span");
                span.innerHTML = text;
                node.replaceWith(span);
            }
        });
    });
}

/* ============================================================
   TEIL 5 — COPY-BUTTON + LASTUPDATE
   ============================================================ */


/* ------------------------------------------------------------
   COPY-BUTTON: Tastenkombination korrekt extrahieren & kopieren
   ------------------------------------------------------------ */

/*
   ✔ Liest alle <kbd>-Elemente aus
   ✔ Erkennt automatisch den Operator (+, /, ,)
   ✔ Baut den Shortcut korrekt zusammen
   ✔ Kopiert in die Zwischenablage
   ✔ Zeigt visuelles Feedback ("Kopiert!")
*/

document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("copy-btn")) return;

    const cell = e.target.closest(".shortcut-cell");
    const kbdList = cell.querySelectorAll("kbd");

    // Alle <kbd>-Texte sammeln
    const keys = Array.from(kbdList).map(k => k.textContent.trim());

    // Operator aus dem Text extrahieren
    const rawText = cell.querySelector(".shortcut-text").textContent;

    let operator = "+";
    if (rawText.includes("/")) operator = "/";
    if (rawText.includes(",")) operator = ",";

    // Shortcut zusammenbauen
    const finalShortcut = keys.join(` ${operator} `);

    // In Zwischenablage kopieren
    navigator.clipboard.writeText(finalShortcut).then(() => {
        e.target.textContent = "Kopiert!";
        setTimeout(() => {
            e.target.textContent = "Copy";
        }, 1200);
    });
});

/* ============================================================
   PDF EXPORT — aktueller Tab als PDF (window.print)
   ============================================================ */

const pdfBtn = document.getElementById("pdfExportBtn");

if (pdfBtn) {
    pdfBtn.addEventListener("click", () => {

        // Aktiven Tab ermitteln
        const activeTab = document.querySelector(".tab-btn.active");

        // Sichtbaren Tab‑Namen extrahieren (Icon wird ignoriert)
        const tabName = activeTab
            ? activeTab.textContent.trim()
            : "Export";

        // Titel temporär ändern → wird PDF‑Dateiname
        document.title = tabName;

        // PDF erzeugen (Browser-Print)
        window.print();
    });
}

// Nach dem Drucken Titel zurücksetzen
window.onafterprint = () => {
    document.title = "Deine Shortcut‑Dokumentation";
};


/* ------------------------------------------------------------
   Druckdatum (für PDF-Fußzeile)
   ------------------------------------------------------------ */

const printDateEl = document.getElementById("printDate");
if (printDateEl) {
    printDateEl.textContent = new Date().toLocaleDateString("de-DE");
}



/* ------------------------------------------------------------
   LASTUPDATE — Datum/Uhrzeit der Datei anzeigen
   ------------------------------------------------------------ */

/*
   ✔ Nutzt document.lastModified
   ✔ Formatiert Datum/Zeit in Türkisch (tr-TR)
   ✔ Setzt Text in #lastUpdate
*/

const el = document.getElementById("lastUpdate");

if (el) {
    const lastModified = document.lastModified;

    const formatted = new Date(lastModified).toLocaleString("tr-TR", {
        dateStyle: "short",
        timeStyle: "short"
    });

    el.textContent = "Güncelleme: " + formatted;
}
