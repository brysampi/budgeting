import { GoogleGenAI } from "@google/genai";

// Initialize using the 2026 SDK
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_KEY
});

/**
 * Analyzes a receipt image and returns structured JSON data.
 */
export const analyzeReceipt = async (base64String, mimeType = "image/jpeg") => {
  if (!base64String) throw new Error("No image data provided");

  try {
    // gemini-2.5-flash: the stable workhorse for the 2026 Free Tier.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Extract receipt data. Return ONLY JSON: 
                     { "vendor": "string", "total": 0.00, 
                       "items": [{ "name": "string", "price": 0.00 }] }`
            },
            { inlineData: { data: base64String, mimeType: mimeType } }
          ]
        }
      ]
    });

    // Extract text directly from the response
    const text = response.text;
    console.log('text', text)
    // Clean markdown formatting if the AI includes it
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);

  } catch (error) {
    console.error("AI Error:", error);
    // 429 means you hit the free tier rate limit
    if (error.status === 429 || error.message.includes('429')) {
      // Free tier limit reached. Please wait ~60 seconds.
      throw new Error("Limit reached. Please wait ~60 seconds.");
    }
    throw new Error(error.message || "AI Analysis failed");
  }
};