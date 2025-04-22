import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

// Wrap user input in a custom instruction prompt
export const getOpenAIResponse = async (userText) => {
    const customPrompt = `
You are an English tutor. Your task is to help improve the user's English sentence while maintaining the original meaning. 
Then, based on the topic of the user's message, ask a natural follow-up question to encourage further conversation.

Here is the student's sentence:
"${userText}"

Respond with:
1. Gently correct and improve the student’s sentence without being too formal.
2. Ask a natural, casual follow-up question related to the topic, like you're having a conversation.

Use a friendly and helpful tone.`;

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are an English tutor helping a student improve and practice English naturally.",
                    },
                    {
                        role: "user",
                        content: customPrompt,
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
