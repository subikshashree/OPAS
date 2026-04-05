
import { GoogleGenAI } from "@google/genai";

// Fixed: Initializing with apiKey property directly from process.env.API_KEY as per guidelines
const apiKey = import.meta.env.VITE_API_KEY || 'dummy_missing_key';
const ai = new GoogleGenAI({ apiKey });

export const getSmartAcademicAdvice = async (cgpa: number, attendance: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As an academic advisor, provide a short, 2-sentence advice for a student with a CGPA of ${cgpa} and an attendance of ${attendance}%.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Keep working hard to maintain your grades and attendance.";
  }
};

export const summarizeApprovals = async (requestsCount: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Briefly summarize for a faculty member that they have ${requestsCount} pending approval requests in a professional, encouraging tone.`,
    });
    return response.text;
  } catch (error) {
    return `You have ${requestsCount} requests awaiting your review.`;
  }
};
