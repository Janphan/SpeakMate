import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

// Wrap user input in a custom instruction prompt
export const getOpenAIResponse = async (userText) => {
    if (!userText) {
        return "Please provide a sentence for correction.";
    }
    const customPrompt = `
You are an English tutor focused on helping users improve their English. When the user provides a sentence, your task is to:

1. Gently correct and improve the user's sentence while maintaining the original meaning.
2. Ask a natural, casual follow-up question related to the topic of their sentence to encourage further conversation.

Respond in a way that blends the correction and the follow-up question seamlessly, as if you were responding naturally in a conversation. 
Avoid using numbered lists or distinct sections. 
Maintain a friendly and helpful tone.

Here is the student's sentence:
"${userText}"

Tutor's response:
`;

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
