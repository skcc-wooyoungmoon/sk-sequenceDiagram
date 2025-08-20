
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSequenceDiagram = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
       config: {
        systemInstruction: "You are an expert software architect specializing in UML and system design. Your task is to generate a sequence diagram in Mermaid syntax based on user requirements. Provide a clear analysis first, followed by the Mermaid code block.",
        temperature: 0.2,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating sequence diagram:", error);
    if (error instanceof Error) {
        return `Error: ${error.message}`;
    }
    return "An unknown error occurred while generating the diagram.";
  }
};
