const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function testaa() {
    try {
        console.log("Yritetään ottaa yhteys OpenAI:hin...");
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Sano 'Yhteys toimii!' jos kuulet minun." }],
        });

        console.log("Vastaus:", completion.choices[0].message.content);
        console.log("--- TESTI ONNISTUI! ---");
    } catch (error) {
        console.error("--- TESTI EPÄONNISTUI ---");
        console.error("Virheviesti:", error.message);
        console.log("\nVarmista että:");
        console.log("1. .env tiedostossa on oikea avain.");
        console.log("2. Olet ladannut vähintään 5$ saldoa OpenAI-tilillesi.");
    }
}

testaa();