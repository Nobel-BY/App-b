import { GoogleGenAI, Type } from "@google/genai";
import { HealthMetrics, HealthAdvice } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const getHealthAnalysis = async (metrics: HealthMetrics): Promise<HealthAdvice> => {
  const model = "gemini-3-flash-preview";
  
  // Calculate BMI locally first to ensure data integrity
  const heightM = metrics.height / 100;
  const bmi = heightM > 0 ? parseFloat((metrics.weight / (heightM * heightM)).toFixed(1)) : 0;
  const genderStr = metrics.gender === 'female' ? 'Female' : 'Male';

  const prompt = `
    Analyze the following health metrics for a ${genderStr} user:
    - Height: ${metrics.height} cm
    - Weight: ${metrics.weight} kg
    - BMI: ${bmi}
    ${metrics.bodyFatPercentage ? `- Body Fat: ${metrics.bodyFatPercentage}%` : ''}
    ${metrics.muscleMass ? `- Muscle Mass: ${metrics.muscleMass} kg` : ''}
    ${metrics.visceralFatLevel ? `- Visceral Fat Level: ${metrics.visceralFatLevel}` : ''}

    Please provide:
    1. A short assessment status (e.g., "Healthy", "Overweight", "Athletic", etc.).
    2. A concise, friendly, and actionable advice paragraph (max 100 words) based on these specific numbers and gender. Focus on positive reinforcement or gentle warnings if needed.
    Language: Chinese (Simplified).
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                bmi: { type: Type.NUMBER },
                status: { type: Type.STRING },
                advice: { type: Type.STRING }
            },
            required: ["status", "advice"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text);
    return {
        bmi: bmi, 
        status: result.status,
        advice: result.advice
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("无法连接到 AI 助手，请稍后再试。");
  }
};