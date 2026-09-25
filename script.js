/**
 * ==========================================================================
 * SKRIPT PRO STRÁNKU O MANGU
 * Demonstrace práce s DOM, obsluhy událostí a interaktivity
 * ==========================================================================
 */

// Spustíme skript až po načtení celého DOM stromu
document.addEventListener("DOMContentLoaded", () => {

    /* --------------------------------------------------------------------------
     * 1. INTERAKTIVNÍ PRVEK: Rozbalení a skrytí doplňujících zajímavostí
     * -------------------------------------------------------------------------- */
    const toggleFactsBtn = document.getElementById("toggle-facts-btn");
    const extraFactsContainer = document.getElementById("extra-facts");

    if (toggleFactsBtn && extraFactsContainer) {
        toggleFactsBtn.addEventListener("click", () => {
            // Přepnutí třídy 'hidden'
            const isHidden = extraFactsContainer.classList.toggle("hidden");

            // Změna textu tlačítka a ARIA atributu pro čtečky obrazovky
            if (isHidden) {
                toggleFactsBtn.textContent = "Zobrazit další zajímavosti ▼";
                toggleFactsBtn.setAttribute("aria-expanded", "false");
            } else {
                toggleFactsBtn.textContent = "Skrýt zajímavosti ▲";
                toggleFactsBtn.setAttribute("aria-expanded", "true");
            }
        });
    }

    /* --------------------------------------------------------------------------
     * 2. INTERAKTIVNÍ PRVEK: Nutriční kalkulačka manga v reálném čase
     * -------------------------------------------------------------------------- */
    const weightInput = document.getElementById("mango-weight");
    const presetButtons = document.querySelectorAll(".btn-preset");
    
    // Elementy pro zobrazení výsledků
    const nutriKcal = document.getElementById("nutri-kcal");
    const nutriCarbs = document.getElementById("nutri-carbs");
    const nutriFiber = document.getElementById("nutri-fiber");
    const nutriVitc = document.getElementById("nutri-vitc");

    // Nutriční hodnoty na 100 g čerstvého manga
    const NUTRITION_PER_100G = {
        kcal: 60,
        carbs: 15.0,
        fiber: 1.6,
        vitc: 36
    };

    /**
     * Funkce pro přepočet a aktualizaci hodnot v DOM
     */
    function updateNutrition() {
        const weight = parseFloat(weightInput.value);

        // Ošetření neplatného nebo prázdného vstupu
        if (isNaN(weight) || weight <= 0) {
            nutriKcal.textContent = "-";
            nutriCarbs.textContent = "-";
            nutriFiber.textContent = "-";
            nutriVitc.textContent = "-";
            return;
        }

        // Výpočet poměru vůči 100 gramům
        const ratio = weight / 100;

        // Aktualizace hodnot v DOM pomocí textContent
        nutriKcal.textContent = Math.round(NUTRITION_PER_100G.kcal * ratio);
        nutriCarbs.textContent = (NUTRITION_PER_100G.carbs * ratio).toFixed(1);
        nutriFiber.textContent = (NUTRITION_PER_100G.fiber * ratio).toFixed(1);
        nutriVitc.textContent = Math.round(NUTRITION_PER_100G.vitc * ratio);
    }

    // Reakce na změnu v číselném vstupu (událost input)
    if (weightInput) {
        weightInput.addEventListener("input", () => {
            // Zrušíme aktivní styl u preset tlačítek, pokud uživatel píše ručně
            presetButtons.forEach(btn => btn.classList.remove("active"));
            updateNutrition();
        });
    }

    // Reakce na kliknutí na rychlé předvolby (100g, 150g, 250g)
    presetButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Zvýraznění aktivního tlačítka
            presetButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            // Přepsání hodnoty v inputu a přepočet
            const presetWeight = button.getAttribute("data-weight");
            if (weightInput) {
                weightInput.value = presetWeight;
                updateNutrition();
            }
        });
    });

    /* --------------------------------------------------------------------------
     * 3. INTERAKTIVNÍ PRVEK: Znalostní minikvíz o mangu
     * -------------------------------------------------------------------------- */
    const quizButtons = document.querySelectorAll(".btn-quiz");
    const quizFeedback = document.getElementById("quiz-feedback");

    quizButtons.forEach(button => {
        button.addEventListener("click", () => {
            const isCorrect = button.getAttribute("data-correct") === "true";

            // Deaktivace všech tlačítek, aby nešlo hlasovat opakovaně
            quizButtons.forEach(btn => {
                btn.disabled = true;
                if (btn.getAttribute("data-correct") === "true") {
                    btn.classList.add("correct");
                }
            });

            // Zobrazení reakce podle správnosti
            quizFeedback.className = "quiz-feedback show";
            if (isCorrect) {
                quizFeedback.classList.add("success");
                quizFeedback.textContent = "Správně! 🎉 Mango pochází z oblasti jižní Asie (především z Indie a Barmy), kde se pěstuje přes 4 000 let.";
            } else {
                button.classList.add("incorrect");
                quizFeedback.classList.add("error");
                quizFeedback.textContent = "Bohužel špatně. Správná odpověď je B) Jižní Asie (Indie a Barma).";
            }
        });
    });

    /* --------------------------------------------------------------------------
     * 4. INTERAKTIVNÍ PRVEK: Validace a odeslání kontaktního formuláře
     * -------------------------------------------------------------------------- */
    const contactForm = document.getElementById("contact-form");
    const formFeedback = document.getElementById("form-feedback");

    if (contactForm && formFeedback) {
        contactForm.addEventListener("submit", (event) => {
            // Zabránění obnovení celé stránky
            event.preventDefault();

            // Získání hodnot z formuláře
            const nameInput = document.getElementById("user-name");
            const emailInput = document.getElementById("user-email");
            const topicSelect = document.getElementById("topic-select");

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();

            // Jednoduchá kontrola platnosti (validace)
            if (name.length < 2) {
                showFormMessage("Prosím vyplňte platné jméno (alespoň 2 znaky).", "error");
                nameInput.focus();
                return;
            }

            if (!validateEmail(email)) {
                showFormMessage("Prosím zadejte platnou e-mailovou adresu.", "error");
                emailInput.focus();
                return;
            }

            // Úspěšné odeslání – manipulace s DOM a potvrzení
            const selectedTopicText = topicSelect.options[topicSelect.selectedIndex].text;
            showFormMessage(`Děkujeme, ${name}! Vaše zpráva s tématem „${selectedTopicText}“ byla úspěšně přijata.`, "success");
            
            // Vymazání formuláře po úspěšném odeslání
            contactForm.reset();
        });
    }

    /**
     * Pomocná funkce pro zobrazení zprávy formuláře
     */
    function showFormMessage(message, type) {
        formFeedback.className = `form-feedback show ${type}`;
        formFeedback.textContent = message;
    }

    /**
     * Jednoduché ověření formátu e-mailu
     */
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /* --------------------------------------------------------------------------
     * 5. EASTER EGG: "POLOŽTE TO MANGO!"
     * -------------------------------------------------------------------------- */
    const easterEggModal = document.getElementById("easter-egg-modal");
    const closeEasterEggBtn = document.getElementById("close-easter-egg");
    const easterEggBackdrop = document.getElementById("easter-egg-backdrop");
    const heroMangoImg = document.getElementById("hero-mango-img");
    const siteLogo = document.getElementById("site-logo");

    function openEasterEgg() {
        if (easterEggModal) {
            easterEggModal.style.display = "flex";
            easterEggModal.setAttribute("aria-hidden", "false");
            if (closeEasterEggBtn) {
                closeEasterEggBtn.focus();
            }
        }
    }

    function closeEasterEgg() {
        if (easterEggModal) {
            easterEggModal.style.display = "none";
            easterEggModal.setAttribute("aria-hidden", "true");
        }
    }

    if (closeEasterEggBtn) {
        closeEasterEggBtn.addEventListener("click", closeEasterEgg);
    }
    if (easterEggBackdrop) {
        easterEggBackdrop.addEventListener("click", closeEasterEgg);
    }

    // Zavření klávesou Escape
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && easterEggModal && easterEggModal.style.display === "flex") {
            closeEasterEgg();
        }
    });

    // Spouštěč 1: Kliknutí na velkou fotografii manga
    if (heroMangoImg) {
        heroMangoImg.style.cursor = "pointer";
        heroMangoImg.addEventListener("click", () => {
            openEasterEgg();
        });
    }

    // Spouštěč 2: 3x rychlé kliknutí na logo v hlavičce
    let logoClicks = 0;
    let logoTimer = null;
    if (siteLogo) {
        siteLogo.addEventListener("click", () => {
            logoClicks++;
            clearTimeout(logoTimer);
            if (logoClicks >= 3) {
                openEasterEgg();
                logoClicks = 0;
            } else {
                logoTimer = setTimeout(() => {
                    logoClicks = 0;
                }, 1000);
            }
        });
    }

    // Spouštěč 3: Napsání slova 'mango' na klávesnici (mimo formulářová pole)
    let typedBuffer = "";
    document.addEventListener("keydown", (event) => {
        const activeTag = document.activeElement ? document.activeElement.tagName : "";
        if (activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT") {
            return;
        }

        typedBuffer += event.key.toLowerCase();
        if (typedBuffer.length > 8) {
            typedBuffer = typedBuffer.slice(-8);
        }

        if (typedBuffer.includes("mango")) {
            openEasterEgg();
            typedBuffer = "";
        }
    });

    // Inicializace výpočtu kalkulačky při prvním načtení stránky
    updateNutrition();
});
