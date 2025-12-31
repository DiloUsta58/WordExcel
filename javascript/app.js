// Sprache laden und anwenden
async function setLanguage(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        const translations = await response.json();

        // Normale Texte ersetzen
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

        // Aktive Sprache speichern
        localStorage.setItem("lang", lang);

        // HTML lang-Attribut setzen
        document.documentElement.setAttribute("lang", lang);

        // Aktiven Button markieren
        updateActiveLanguage(lang);

    } catch (error) {
        console.error("Fehler beim Laden der Sprache:", error);
    }
}

// Aktiven Sprachbutton hervorheben
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
