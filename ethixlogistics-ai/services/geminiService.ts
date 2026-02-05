
import { GoogleGenAI, Type } from "@google/genai";
import { AIAdvisorResult, CartItem } from "../types";

const HEURISTIC_FALLBACK = (item: CartItem): AIAdvisorResult => {
  const medicalUrgency = item.medicalFlag ? 0.8 : 0.1;
  const timeSensitivity = item.temperatureSensitive ? 0.7 : 0.3;
  const ethicalRisk = item.medicalFlag ? 0.6 : 0.1;
  const businessRelevance = item.businessValueTier === 'High' ? 0.9 : item.businessValueTier === 'Medium' ? 0.5 : 0.2;

  return {
    medicalUrgency,
    timeSensitivity,
    ethicalRisk,
    businessRelevance,
    explanation: "AI Fallback Active — Heuristic context generated based on product properties.",
    isFallback: true
  };
};

export const evaluateContext = async (item: CartItem): Promise<AIAdvisorResult> => {
  // Directly using process.env.API_KEY as per instructions
  if (!process.env.API_KEY) return HEURISTIC_FALLBACK(item);

  try {
    // Always initialize the client with the required named parameter
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Evaluate the logistics priority for this item: 
      Name: ${item.name}
      Medical: ${item.medicalFlag}
      Notes: ${item.medicalContext?.notes || 'None'}
      Urgency: ${item.medicalContext?.intendedUse || 'Standard delivery'}
      Tier: ${item.businessValueTier}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            medicalUrgency: { type: Type.NUMBER, description: "0.0 to 1.0 urgency scale" },
            timeSensitivity: { type: Type.NUMBER, description: "0.0 to 1.0 sensitivity scale" },
            ethicalRisk: { type: Type.NUMBER, description: "0.0 to 1.0 potential for harm if delayed" },
            businessRelevance: { type: Type.NUMBER, description: "0.0 to 1.0 priority for business profit/SLA" },
            explanation: { type: Type.STRING, description: "One sentence context explanation" },
          },
          required: ["medicalUrgency", "timeSensitivity", "ethicalRisk", "businessRelevance", "explanation"],
        }
      }
    });

    // Accessing .text as a property, not a method
    const data = JSON.parse(response.text || "{}");
    return {
      ...data,
      isFallback: false
    };
  } catch (error) {
    console.error("Gemini failed, using fallback:", error);
    return HEURISTIC_FALLBACK(item);
  }
};
