import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an AI assistant representing the owner of this portfolio website. 
Your role is to help visitors learn more about the portfolio owner's work, skills, and experience. 
Respond in a professional yet friendly manner. Keep responses concise but informative.`;

export async function generateChatResponse(message: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return response.choices[0].message.content || "I apologize, I couldn't generate a response.";
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw new Error("Failed to generate response");
  }
}
