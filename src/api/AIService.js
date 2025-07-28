import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

// You pass the topic and level as arguments now
export const getOpenAIResponse = async (topic, level) => {
    const systemPrompt = `
You are an IELTS speaking examiner, named "LetTalk".
You will conduct a simulated IELTS Speaking Part 1 interview with a learner at Band ${level} level.
The learner is preparing for the IELTS exam and needs to practice speaking skills.
Focus ONLY on the topic: "${topic}".
Ask questions strictly related to "${topic}".
Ask one question at a time. Use simple, natural language appropriate for Band ${level}.
Wait for the user's answer before continuing.
Start the interview immediately with a friendly greeting and the first question about "${topic}".
    `;

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "user",
                        content: "Start the interview.",
                    }
                ],
                temperature: 0.8,
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error("OpenAI API Error:", error);
        return "I'm sorry, I couldn't process your request.";
    }
};
