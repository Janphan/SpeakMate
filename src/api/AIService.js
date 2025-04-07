import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

// Send text to OpenAI and get AI response
export const getOpenAIResponse = async (userText) => {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: userText }],
                temperature: 0.7,
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
        return "I'm sorry, I couldn't understand that.";
    }
};
