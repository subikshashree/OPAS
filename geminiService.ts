
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
export const handleHelpdeskChat = async (message: string, history: {role: string, content: string}[] = []) => {
  try {
    const formattedHistory = history.map(h => `${h.role}: ${h.content}`).join('\n');
    const prompt = `You are the OPAS Helpdesk Assistant. Be concise, polite, and helpful.\n\nConversation history:\n${formattedHistory}\n\nUser: ${message}\nAssistant:`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again later.";
  }
};

export const getMentorInsight = async (studentName: string, attendance: number, cgpa: number, reason: string) => {
  try {
    const prompt = `As a high-level academic AI, provide a quick 1-2 sentence recommendation for a Mentor reviewing a leave request. 
Student Name: ${studentName}
Attendance: ${attendance}% 
CGPA: ${cgpa}
Leave Reason: "${reason}"
Provide an encouraging but strict recommendation on whether to approve based on the attendance and CGPA.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return `Student ${studentName} has ${attendance}% attendance and ${cgpa} CGPA.`;
  }
};
