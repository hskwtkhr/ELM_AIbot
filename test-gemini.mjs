import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBMDNvmtcVgNzxHgL5GhxNfqLA7O3g_c1k");

async function main() {
    const models = ["gemini-1.5-flash-001", "gemini-1.5-flash-002", "gemini-1.5-pro", "gemini-1.0-pro"];

    for (const m of models) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Hello");
            console.log(`Success with ${m}:`, result.response.text());
            // return; // Don't return, check all
        } catch (error) {
            console.error(`Error with ${m}:`, error.message);
        }
    }
}

main();
