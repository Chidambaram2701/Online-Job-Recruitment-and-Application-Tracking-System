
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const GeminiService = {
  async analyzeJobMatching(resume: string, jobDescription: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the following resume and job description. Provide a match score (0-100) and three key reasons why they are or are not a good fit.
        
        RESUME: ${resume}
        JOB: ${jobDescription}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
              advice: { type: Type.STRING }
            },
            required: ["score", "reasons", "advice"]
          }
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini Error:", error);
      return { score: 0, reasons: ["Error analyzing match"], advice: "Could not generate advice." };
    }
  },

  async generateJobDescription(title: string, company: string, skills: string[]) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a professional and engaging job description for the role of ${title} at ${company}. Required skills: ${skills.join(', ')}. Keep it concise but attractive.`,
      });
      return response.text;
    } catch (error) {
      return "Default job description placeholder.";
    }
  }
};
