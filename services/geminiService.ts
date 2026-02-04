
import { GoogleGenAI } from "@google/genai";
import { RainfallRecord } from "../types";

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeRainfallData = async (records: RainfallRecord[], userLocation?: { lat: number; lng: number }) => {
  const ai = getAIClient();
  const recordsSummary = records
    .slice(-10)
    .map(r => `${r.date}: ${r.amount}mm`)
    .join(", ");

  const prompt = `Analiza estos registros de lluvia: ${recordsSummary}. 
  Ubicación actual: Lat ${userLocation?.lat}, Lng ${userLocation?.lng}.
  Proporciona un resumen de tendencias, impacto local y recomendaciones para agricultura/seguridad.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const text = response.text || "No se pudo generar el análisis.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || "Fuente externa",
        uri: chunk.web?.uri || "#"
      })) || [];

    return {
      analysis: text,
      sources
    };
  } catch (error) {
    console.error("Error Gemini:", error);
    return {
      analysis: "Error al conectar con la IA.",
      sources: []
    };
  }
};

export const getQuickTip = async (lastAmount: number) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Se han registrado ${lastAmount}mm de lluvia. Dame un consejo de 10 palabras sobre qué hacer.`,
      config: { temperature: 0.9 }
    });
    return response.text;
  } catch {
    return "Mantente informado sobre el clima local.";
  }
};
