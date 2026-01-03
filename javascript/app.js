/*Ganz oben: Speicher für Original-DE */
const originalDeTexts = {};

/* Funktionen DEFINIEREN (noch nichts ausführen) */
async function setLanguage(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Sprachdatei nicht gefunden: ${lang}.json`);
        }

        const translations = await response.json();

        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.dataset.i18n;
            if (translations[key]) {
                el.innerHTML = translations[key]; // ← WICHTIG
            }
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (translations[key]) {
                el.placeholder = translations[key];
            }
        });

        localStorage.setItem("lang", lang);
        document.documentElement.lang = lang;

        updateActiveLanguage(lang);
        updateLastUpdate(lang, translations);

    } catch (error) {
        console.error("Fehler beim Laden der Sprache:", error);
    }
}

/* Export-Funktion: NUR aus originalDeTexts */
function generateDeJson() {
    const json = JSON.stringify(originalDeTexts, null, 2);

    const blob = new Blob([json], {
        type: "application/json;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "de.json";
    a.click();

    URL.revokeObjectURL(url);

    console.info("Reine de.json exportiert.");
}

/* Update-Funktionen */
function updateLastUpdate(lang, translations) {
    const el = document.getElementById("lastUpdate");
    if (!el) return;

    const locale = lang === "tr" ? "tr-TR" : "de-DE";
    const formatted = new Date(document.lastModified).toLocaleString(locale, {
        dateStyle: "short",
        timeStyle: "short"
    });

    const labelKey = el.dataset.i18n;
    const label = translations[labelKey] || "";

    el.textContent = `${label} ${formatted}`;
}

function updateActiveLanguage(lang) {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });
}

document.addEventListener("DOMContentLoaded", () => {

    // 1️⃣ ORIGINAL-DE sichern (BEVOR irgendwas übersetzt wird)
    document.querySelectorAll("[data-i18n]").forEach(el => {
        originalDeTexts[el.dataset.i18n] = el.innerHTML.trim();
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        originalDeTexts[el.dataset.i18nPlaceholder] = el.placeholder.trim();
    });

    // 2️⃣ Sprache bestimmen
    const saved = localStorage.getItem("lang");
    const browser = navigator.language.startsWith("tr") ? "tr" : "de";
    const langToUse = saved || browser;

    // 3️⃣ Nur wenn NICHT Deutsch → Sprache laden
    if (langToUse !== "de") {
        setLanguage(langToUse);
    } else {
        updateActiveLanguage("de");
    }
});
