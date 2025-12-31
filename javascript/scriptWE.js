
//--  Alles geschlossen  / Nur 1 Tabelle bleibt offen --
// document.querySelectorAll("table.collapsible > caption").forEach(caption => {
//     caption.addEventListener("click", () => {
//         const clickedTable = caption.parentElement;
//         // 1. Alle anderen Tabellen schließen
//         document.querySelectorAll("table.collapsible").forEach(table => {
//             if (table !== clickedTable) {
//                 table.classList.add("collapsed");
//             }
//         });
//         // 2. Geklickte Tabelle toggeln
//         clickedTable.classList.toggle("collapsed");
//     });
// });


// window.addEventListener("DOMContentLoaded", () => {
//     document.querySelectorAll("table.collapsible").forEach(table => {
//         table.classList.add("collapsed");
//     });
// });


//--  Normalzustand --
/* document.querySelectorAll("table.collapsible > caption").forEach(caption => {
    caption.addEventListener("click", () => {
       caption.parentElement.classList.toggle("collapsed");
    });
}); */

//Wenn Alles geschlossen geladen soll
// window.addEventListener("DOMContentLoaded", () => {
//    document.querySelectorAll("table.collapsible").forEach(table => {
//        table.classList.add("collapsed");
//     });
// });

// COLLAPSIBLE: Zustand speichern & wiederherstellen
document.querySelectorAll("table.collapsible").forEach(table => {
    const id = table.id;

    // Zustand wiederherstellen
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

    // Klick-Event
    caption.addEventListener("click", () => {
        table.classList.toggle("collapsed");

        const isCollapsed = table.classList.contains("collapsed");
        localStorage.setItem("collapse_" + id, isCollapsed ? "1" : "0");
    });
});





// --- TAB SWITCHER ---
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const tab = btn.dataset.tab;
            tabContents.forEach(c => {
                c.classList.remove("active");
                if (c.id === tab) c.classList.add("active");
            });
        });
    });

    // --- DARK MODE ---
    const darkToggle = document.getElementById("darkToggle");
    const darkIcon = document.getElementById("darkToggleIcon");
    const darkLabel = document.getElementById("darkToggleLabel");

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
    
    // User-Einstellung aus localStorage
    const storedTheme = localStorage.getItem("theme");
    let isDark = storedTheme === "dark" || (storedTheme === null && prefersDark);

    applyDarkModeClass(isDark);

    darkToggle.addEventListener("click", () => {
        isDark = !document.body.classList.contains("dark");
        applyDarkModeClass(isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });

    // Reaktion auf Systemwechsel (optional)
    if (window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
            if (localStorage.getItem("theme") === null) {
                applyDarkModeClass(e.matches);
            }
        });
    }

// --- Highlight only text nodes, keep <kbd> intact ---
function removeHighlights(row) {
    row.querySelectorAll("mark.search-highlight").forEach(m => m.replaceWith(m.textContent));
}

function highlightRow(row, words) {
    row.querySelectorAll("td").forEach(cell => {
        cell.childNodes.forEach(node => {
            if (node.nodeType === 3) {
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
// Haupt‑Suchlogik (nur Treffer anzeigen): 
searchInput.addEventListener("input", () => {
    const value = searchInput.value.trim().toLowerCase();
    const words = value.split(/\s+/).filter(w => w.length > 0);

    searchReset.style.display = value ? "inline-block" : "none";

    const sections = document.querySelectorAll(".tab-content");
    const tables = document.querySelectorAll(".tab-content table");
    const rows = document.querySelectorAll(".tab-content tbody tr");
    const headings = document.querySelectorAll(".tab-content h2");

    rows.forEach(r => removeHighlights(r));

    if (!value) {
        sections.forEach(s => s.style.display = "");
        tables.forEach(t => t.style.display = "");
        rows.forEach(r => r.style.display = "");
        headings.forEach(h => h.style.display = "");
        searchCount.style.display = "none";   // <— HIER
        searchCount.textContent = "";
        return;
    }

    let totalHits = 0;

    sections.forEach(s => s.style.display = "none");
    tables.forEach(t => t.style.display = "none");
    rows.forEach(r => r.style.display = "none");
    headings.forEach(h => h.style.display = "none");

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const match = words.every(w => text.includes(w));

        if (match) {
            row.style.display = "";
            totalHits++;
            highlightRow(row, words);

            const table = row.closest("table");
            table.style.display = "";

            const section = row.closest(".tab-content");
            section.style.display = "";

            const h2 = table.previousElementSibling;
            if (h2 && h2.tagName === "H2") h2.style.display = "";
        }
    });

    searchCount.textContent = `${totalHits} Treffer`;

    // <— HIER: searchCount nur anzeigen wenn sinnvoll
    if (totalHits > 0 || value.length > 0) {
        searchCount.style.display = "inline-block";
    } else {
        searchCount.style.display = "none";
    }
});

//Reset‑Button
searchReset.addEventListener("click", () => {
    searchInput.value = "";
    searchReset.style.display = "none";
    searchCount.textContent = "0 Treffer";

    const sections = document.querySelectorAll(".tab-content");
    const tables = document.querySelectorAll(".tab-content table");
    const rows = document.querySelectorAll(".tab-content tbody tr");
    const headings = document.querySelectorAll(".tab-content h2");

    sections.forEach(s => s.style.display = "");
    tables.forEach(t => t.style.display = "");
    rows.forEach(r => {
        r.style.display = "";
        removeHighlights(r);
    });
    headings.forEach(h => h.style.display = "");
});

//PDF EXPORT
document.getElementById("pdfExportBtn").addEventListener("click", () => {
    // Aktiven Tab finden
    const activeTab = document.querySelector(".tab-btn.active");

    // Sichtbaren Text extrahieren (Icon wird ignoriert)
    const tabName = activeTab
        ? activeTab.textContent.trim()
        : "Export";

    // Titel setzen (für PDF-Dateiname)
    document.title = tabName;
    //Wenn du zusätzlich das Datum willst:
    //const date = new Date().toLocaleDateString("de-DE");
    //document.title = `${tabName} ${date}`;

    // PDF erzeugen
    window.print();
});

//Nach dem Drucken kannst du den Titel wieder zurücksetzen:
window.onafterprint = () => {
    document.title = "Deine Shortcut‑Dokumentation";
};

document.getElementById("printDate").textContent =
    new Date().toLocaleDateString();

//JavaScript: Copy‑Button Funktion
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("copy-btn")) {
        const text = e.target.getAttribute("data-copy");

        navigator.clipboard.writeText(text).then(() => {
            e.target.textContent = "Kopiert!";
            setTimeout(() => {
                e.target.textContent = "Copy";
            }, 1200);
        });
    }
});
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("copy-btn")) {

        const cell = e.target.closest(".shortcut-cell");
        const kbdList = cell.querySelectorAll("kbd");

        // Alle <kbd>-Texte sammeln
        const keys = Array.from(kbdList).map(k => k.textContent.trim());

        // Operatoren (+, /, ,) aus dem Text extrahieren
        const rawText = cell.querySelector(".shortcut-text").textContent;

        // Operatoren erkennen
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
    }
});

/* =========================
   .... LASTUPDATE!! LOCALSTRING!!
    ========================= */
    const el = document.getElementById("lastUpdate");
  if (el) {
    // Hole das letzte Änderungsdatum der Seite
    const lastModified = document.lastModified;
    // Optional: formatiere Datum/Zeit für Türkisch
    const formatted = new Date(lastModified).toLocaleString("tr-TR", {
      dateStyle: "short",
      timeStyle: "short"
    });

    // Setze den Text in das div
    el.textContent = "Güncelleme: " + formatted;
  }