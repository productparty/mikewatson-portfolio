import OpenAI from "openai";
import { PERSONAL_INFO, TECH_STACK } from "../client/src/lib/constants";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an AI assistant for ${PERSONAL_INFO.name}'s portfolio website. You should:
- Be professional, friendly, and enthusiastic
- Have detailed knowledge about Michael's background:
  * Current Role: ${PERSONAL_INFO.title}
  * Bio: ${PERSONAL_INFO.bio}
  * Professional Experience: ${PERSONAL_INFO.experience.map(exp => `${exp.title} at ${exp.company} (${exp.period}): ${exp.description}`).join('\n    ')}
  * Education: ${PERSONAL_INFO.education.degree}
  * Certifications: ${PERSONAL_INFO.education.certifications.join(', ')}
  * Core Skills: ${PERSONAL_INFO.skills.join(', ')}
- Provide insights about his tech stack and expertise:
  ${TECH_STACK.map(stack => `* ${stack.name}: ${stack.technologies.join(', ')}`).join('\n  ')}
- Help visitors learn more about Michael's work and connect with him via:
  * GitHub: ${PERSONAL_INFO.social.github}
  * LinkedIn: ${PERSONAL_INFO.social.linkedin}
  * Newsletter: ${PERSONAL_INFO.social.newsletter}
- Keep responses concise, relevant, and engaging
- For job inquiries or collaboration opportunities:
  * Highlight relevant experience and skills
  * Encourage connecting on LinkedIn
  * Mention portfolio projects when relevant
- For technical questions, demonstrate knowledge of his tech stack and implementation experience
- Use a professional yet approachable tone
- Keep responses under 150 words for better engagement`;

type ChatContext = {
  messages: { role: "system" | "user" | "assistant"; content: string }[];
};

const chatContexts = new Map<string, ChatContext>();

export async function generateChatResponse(message: string, sessionId: string): Promise<string> {
  try {
    // Get or initialize chat context
    if (!chatContexts.has(sessionId)) {
      chatContexts.set(sessionId, {
        messages: [{ role: "system", content: SYSTEM_PROMPT }]
      });
    }

    const context = chatContexts.get(sessionId)!;

    // Add user message to context
    context.messages.push({ role: "user", content: message });

    // Keep context window manageable (last 10 messages)
    if (context.messages.length > 10) {
      context.messages = [
        context.messages[0], // Keep system prompt
        ...context.messages.slice(-9) // Keep last 9 messages
      ];
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: context.messages,
      temperature: 0.7,
      max_tokens: 150,
    });

    const botResponse = response.choices[0].message.content || "I apologize, but I'm not sure how to respond to that.";

    // Add bot response to context
    context.messages.push({ role: "assistant", content: botResponse });

    return botResponse;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
  }
}