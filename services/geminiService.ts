
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are an expert SVG artist and senior frontend developer. 
Your task is to generate high-quality, clean, and valid SVG code based on user descriptions. 
Follow these rules:
1. Return ONLY the SVG code starting with <svg and ending with </svg>.
2. Use modern SVG attributes.
3. Include comments for complex shapes.
4. Ensure the SVG is responsive (use viewBox and width/height="100%").
5. Do not include any text before or after the SVG block.
6. If asked to modify an existing SVG, incorporate the changes while maintaining the structure.
7. Use vivid color palettes unless a specific style is requested.
8. Focus on minimalist, modern, or flat design aesthetics by default.`;

export const generateSVG = async (prompt: string, existingCode?: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  let fullPrompt = prompt;
  if (existingCode) {
    fullPrompt = `Modify the following SVG code based on this request: "${prompt}".\n\nExisting SVG:\n${existingCode}`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
        thinkingConfig: { thinkingBudget: 2000 }
      },
    });

    const text = response.text || "";
    // Robust parsing for when the model includes markdown blocks
    const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/);
    return svgMatch ? svgMatch[0] : text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate SVG. Please check your prompt or try again.");
  }
};
