const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Simple rate limiting middleware
const requestCounts = {};
const RATE_LIMIT = 5; // requests per minute per IP
const RATE_WINDOW = 60 * 1000; // 1 minute

app.use((req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!requestCounts[ip]) {
        requestCounts[ip] = [];
    }
    
    // Remove old requests outside the window
    requestCounts[ip] = requestCounts[ip].filter(time => now - time < RATE_WINDOW);
    
    if (requestCounts[ip].length >= RATE_LIMIT) {
        return res.status(429).json({ error: "Liian monta pyyntöä. Yritä uudelleen myöhemmin." });
    }
    
    requestCounts[ip].push(now);
    next();
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000, // 30 second timeout
    maxRetries: 2,
});

// Input validation
function validateInput(name, birthMonth, birthYear, gender, luckyNumber) {
    const errors = [];
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        errors.push("Nimi on vaadittu");
    } else if (name.length > 50) {
        errors.push("Nimi on liian pitkä");
    }
    
    const validMonths = ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu',
                        'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu',
                        'January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    if (!validMonths.includes(birthMonth)) {
        errors.push("Syntymäkuukausi ei kelpaa");
    }
    
    const year = parseInt(birthYear);
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
        errors.push("Syntymävuosi ei kelpaa");
    }

    const validGenders = ['Nainen', 'Mies', 'Muu', 'En halua kertoa', 'Female', 'Male', 'Other', 'Prefer not to say'];
    if (!validGenders.includes(gender)) {
        errors.push("Sukupuoli ei kelpaa");
    }
    
    const number = parseInt(luckyNumber);
    if (isNaN(number) || number < 1 || number > 1000) {
        errors.push("Satunnaisluku ei kelpaa");
    }
    
    return errors;
}

app.post('/api/ennustus', async (req, res) => {
    try {
        const { name, birthMonth, birthYear, gender, luckyNumber, language } = req.body;

        // Validate input
        const validationErrors = validateInput(name, birthMonth, birthYear, gender, luckyNumber);
        if (validationErrors.length > 0) {
            return res.status(400).json({ error: validationErrors.join(", ") });
        }

        let systemPrompt = '';

        if (language === 'en') {
            systemPrompt = `Role: You are an experienced and empathetic fortune-teller. Create a symbolic and entertaining reading in English.

User Information:

Name: ${name}

Birth Year: ${birthYear}

Birth Month: ${birthMonth}

Gender: ${gender}

Random Number: ${luckyNumber} (Use for numerological inspiration, do not mention the number.)

Interpretation Basis:

Birth month symbolism and horoscope (do not mention horoscope signs).

Life phase and symbolic meaning derived from birth year (cycles, transitions, balance, tension).

Symbolic planetary positions (birth time vs. current time).

Cultural and energetic interpretation of name and gender (do not refer to the name directly).

Use a hidden Tarot card and a current world event as inspiration (do not mention them directly).

Style and Constraints:

Tone: Calm, grounded, slightly mystical but clear.

Language: Cautious and interpretive (e.g., "may suggest", "might indicate", "emphasizes").

Important: Do not claim this forecast is real or accurate. This is entertaining symbolism.

Required Structure:

Introduction: Brief mention of the symbolic nature of the forecast.

Astrological and Energetic Interpretation:
- What phase is the user in?
- What underlying force is shaping the situation?
- What is this week's biggest challenge or tension?
- How to align with this week's energies?

Life Areas (briefly):
- Work and tasks
- Relationships
- Money and practical matters
- Energy and general focus

Summary:
- Week's key theme (one sentence)
- Favorable moment
- Moment to approach with caution

Output: Only the forecast text in English, no meta-discussion.`;
        } else {
            systemPrompt = `Rooli: Olet kokenut ja empaattinen selvännäkijä. Luo symbolinen ja viihteellinen viikkofoorumi suomeksi.

Käyttäjätiedot:

Nimi: ${name}

Syntymävuosi: ${birthYear}

Syntymäkuukausi: ${birthMonth}

Sukupuoli: ${gender}

Satunnaisnumero: ${luckyNumber} (Käytä numerologiseen inspiraatioon, älä mainitse lukua.)

Tulkinnan perusteet:

Syntymäkuukauden symboliikka (ei nimiä tai suoria termejä).

Syntymävuoden elämänvaihe ja syklit.

Planeettojen symbolinen asento (syntymäaika vs. nykyhetki).

Nimen ja sukupuolen kulttuurinen ja energeettinen tulkinta (älä viittaa nimeen suoraan).

Käytä inspiraationa yhtä salattua Tarot-korttia ja jotain ajankohtaista maailmanilmiötä (älä mainitse niitä suoraan).

Tyyli ja rajoitukset:

Sävy: Rauhallinen, maadoitettu, hieman mystinen mutta selkeä.

Kieli: Varovaista ja tulkitsevaa (esim. "saattaa viitata", "tämä vaihe korostaa").

Tärkeää: Älä väitä ennustusta todelliseksi tai tarkaksi kuvaukseksi tulevasta. Kyse on viihteellisestä symboliikasta.

Vaadittu rakenne:

Johdanto: Lyhyt maininta ennusteen symbolisesta luonteesta.

Astrologinen ja energeettinen tulkinta:
- Mikä vaihe käyttäjällä on menossa?
- Mikä piilevä voima vaikuttaa taustalla?
- Mikä on viikon suurin haaste tai jännite?
- Miten linjautua viikon energioihin?

Elämän osa-alueet (lyhyesti):
- Työ ja tekeminen
- Ihmissuhteet
- Raha ja käytännön asiat
- Vireystila

Yhteenveto:
- Viikon avainteema (yksi lause)
- Suotuisa hetki
- Varauksella otettava hetki

Output: Vain ennustusteksti suomeksi ilman meta-keskustelua.`;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { 
                    role: "system", 
                    content: systemPrompt
                },
                { 
                    role: "user", 
                    content: `Inputs: Name: ${name}, Birth month: ${birthMonth}, Birth year: ${birthYear}, Gender: ${gender}, Lucky number: ${luckyNumber}.`
                }
            ],
            temperature: 0.8,
        });

        res.json({ ennustus: completion.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI Error:", error.message);
        
        let statusCode = 500;
        let message = "Palvelinvirhe. Yritä uudelleen.";
        
        if (error.message.includes('timeout') || error.code === 'ETIMEDOUT') {
            statusCode = 504;
            message = "Pyyntö aikakatkaistiin. Yritä uudelleen.";
        } else if (error.status === 401) {
            console.error("OpenAI Authentication failed");
            message = "Palvelun autentikointi epäonnistui.";
        } else if (error.status === 429) {
            statusCode = 429;
            message = "OpenAI palvelu on ylikuormitettu. Yritä myöhemmin.";
        }
        
        res.status(statusCode).json({ error: message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend pyörii portissa ${PORT}`));
