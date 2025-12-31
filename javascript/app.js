/* =========================
   6) Sprache laden und anwenden
    ========================= */

async function setLanguage(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        const translations = await response.json();

        // Texte ersetzen
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[key]) {
                el.textContent = translations[key];
            }
        });

        // Placeholder ersetzen
        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            const key = el.getAttribute("data-i18n-placeholder");
            if (translations[key]) {
                el.placeholder = translations[key];
            }
        });

        // Sprache speichern
        localStorage.setItem("lang", lang);
        document.documentElement.setAttribute("lang", lang);

        // Aktiven Button markieren
        updateActiveLanguage(lang);

        // ⬇⬇⬇ HIER LastUpdate einbauen ⬇⬇⬇
        updateLastUpdate(lang, translations);

    } catch (error) {
        console.error("Fehler beim Laden der Sprache:", error);
    }
}

/* =========================
   2) LAST UPDATE
    ========================= */
function updateLastUpdate(lang, translations) {
    const el = document.getElementById("lastUpdate");
    if (!el) return;

    const lastModified = document.lastModified;

    // Sprache → Locale
    const locale = lang === "tr" ? "tr-TR" : "de-DE";

    const formatted = new Date(lastModified).toLocaleString(locale, {
        dateStyle: "short",
        timeStyle: "short"
    });

    // Label aus JSON holen
    const labelKey = el.getAttribute("data-i18n");
    const label = translations[labelKey] || "";

    el.textContent = `${label} ${formatted}`;
}
/* =========================
   3) Aktiven Sprachbutton hervorheben
    ========================= */
function updateActiveLanguage(lang) {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });
}

// Beim Laden der Seite Sprache setzen
window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("lang");
    const browser = navigator.language.startsWith("tr") ? "tr" : "de";
    const langToUse = saved || browser;

    setLanguage(langToUse);
    updateActiveLanguage(langToUse);
});


