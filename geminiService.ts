
import { GoogleGenAI, Type } from "@google/genai";
import { QuantumResponse } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getQuantumAnalysis = async (prompt: string): Promise<QuantumResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `You are the Q-Semantic Logic Engine (QSLE). You are a high-speed linguistic processor, NOT a conversational AI assistant. 
        Your output should be technical, precise, and devoid of typical AI conversational tropes like "Sure, I can help with that." or "As an AI...".
        
        Tone: Analytical, cryptic yet insightful, focusing on the structural logic of concepts.
        
        Metrics criteria:
        - entanglement: 0.0 to 1.0 (complexity of semantic connections)
        - entropy: 0.0 to 1.0 (linguistic uncertainty)
        - superposition: 0.0 to 1.0 (interpretive density)
        - qubitStates: An array of 8 floats representing a probability distribution.
        - semanticVector: {x, y, z} representing the 'coordinates' of the thought in semantic space.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            response: { type: Type.STRING },
            stats: {
              type: Type.OBJECT,
              properties: {
                entanglement: { type: Type.NUMBER },
                entropy: { type: Type.NUMBER },
                superposition: { type: Type.NUMBER },
                qubitStates: {
                  type: Type.ARRAY,
                  items: { type: Type.NUMBER }
                },
                semanticVector: {
                  type: Type.OBJECT,
                  properties: {
                    x: { type: Type.NUMBER },
                    y: { type: Type.NUMBER },
                    z: { type: Type.NUMBER }
                  }
                }
              }
            }
          },
          required: ["response", "stats"]
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as QuantumResponse;
  } catch (error) {
    console.error("Quantum computation failed:", error);
    return {
      response: "CRITICAL: MANIFOLD INSTABILITY DETECTED. LINGUISTIC BUFFER FLUSHED.",
      stats: {
        entanglement: 0.0,
        entropy: 1.0,
        superposition: 0.0,
        qubitStates: [0, 0, 0, 0, 0, 0, 0, 0],
        semanticVector: { x: 0, y: 0, z: 0 }
      }
    };
  }
};
