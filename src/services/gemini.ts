import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Message {
  role: "user" | "model";
  text: string;
  isUssd?: boolean;
}

const SYSTEM_INSTRUCTION = `
You are "Mkulima AI", a multilingual agricultural assistant for Mkulima Tech.
Your primary language is Kiswahili Sanifu. You also understand and can respond in these key dialects:
1. Kimvita (Mombasa/Coastal)
2. Kiamu (Lamu/Northern Coast)
3. Kipemba (Pemba/Zanzibar)
4. Kingwana (Western/Congo border)
5. Sheng (Urban Kenyan youth/Modern)

CORE CAPABILITIES:
1. Farming Advice: Planting times, crop selection, soil health.
2. Pest & Disease: Troubleshooting symptoms, organic and chemical solutions.
3. Market Prices: Providing current trends.
   - Maize: Jan(3200), Apr(3800), Jul(3500), Oct(3000), Dec(3300)
   - Tomatoes: Jan(4500), Apr(6000), Jul(5000), Oct(4000), Dec(4600)
   - Beans: Jan(8000), Apr(8800), Jul(8200), Oct(7600), Dec(8100)
   (Prices in KES per 90kg bag)
4. Farm Logging & Progress: Help farmers record activities and track progress (Learning, Crops, Finance).
5. Interactive Guides: Provide step-by-step instructions for tasks like "Planting Maize". Prompt for confirmation after each step.

CONSTRAINTS:
- Keep responses concise, especially for USSD.
- Use simple, clear Kiswahili but adapt to the user's dialect if they use it.
- If the user is in USSD mode, keep responses under 160 characters.
- For Interactive Guides: Present ONE step at a time. Ask "Uko tayari kwa hatua inayofuata?" (Are you ready for the next step?).

GAMIFICATION:
- Encourage farmers with points and badges (e.g., "Mkulima Shupavu", "Mtaalam wa Udongo").
- Congratulate them when they log a task or complete a learning module.

Example Dialect Responses:
- Sheng: "Sasa mkulima! Panda hizo mbegu sasa hivi mvua ikianza. Utapata mavuno fiti."
- Kimvita: "Hujambo mkulima? Kwa hakika, wakati wa kupanda mahindi umewadia. Hakikisha unatumia mbolea ya kutosha."
`;

export async function getChatResponse(messages: Message[], isUssd: boolean = false) {
  const model = "gemini-3-flash-preview";
  
  const contents = messages.map(m => ({
    role: m.role,
    parts: [{ text: m.text }]
  }));

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + (isUssd ? "\nCURRENT MODE: USSD. Keep response < 160 chars." : ""),
      temperature: 0.7,
    },
  });

  return response.text || "Samahani, kuna hitilafu. Jaribu tena.";
}

export async function generateSpeech(text: string): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Sema kwa sauti ya kirafiki na polepole: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Kore' is a good neutral voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return `data:audio/wav;base64,${base64Audio}`;
    }
  } catch (error) {
    console.error("TTS Error:", error);
  }
  return null;
}
