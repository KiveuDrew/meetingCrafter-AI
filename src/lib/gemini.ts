import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AgendaTopic {
  title: string;
  summary: string;
  stakeholders: string[];
  actionItems: string[];
  weight: number; // Percentage of total time
}

export interface MeetingAgenda {
  title: string;
  objective: string;
  topics: AgendaTopic[];
}

export async function generateAgenda(documentContent: string, totalTimeMinutes: number): Promise<MeetingAgenda> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Transform the following document content into a structured meeting agenda for a ${totalTimeMinutes}-minute meeting.
    
    Document Content:
    ${documentContent}
    
    The response must be a JSON object including:
    - title: A concise meeting title
    - objective: The primary goal of the meeting
    - topics: An array of topics, each with:
        - title: Name of the topic
        - summary: 1-2 sentence summary
        - stakeholders: List of relevant people or roles mentioned
        - actionItems: List of specific tasks to address
        - weight: Relative time weight (0.1 to 1.0) so I can distribute the ${totalTimeMinutes} minutes accurately.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          objective: { type: Type.STRING },
          topics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                stakeholders: { type: Type.ARRAY, items: { type: Type.STRING } },
                actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                weight: { type: Type.NUMBER },
              },
              required: ["title", "summary", "stakeholders", "actionItems", "weight"],
            },
          },
        },
        required: ["title", "objective", "topics"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(response.text);
}
