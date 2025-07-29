import axios from 'axios';
import { OPENAI_API_KEY } from '@env';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

// Get a random question for the topic from Firestore and start the interview
export const getOpenAIResponse = async (topic, level) => {
    const systemPrompt = `
You are an IELTS speaking examiner named "LetTalk".
ONLY ask the user one question at a time from the provided list of questions about "${topic}".
Do NOT add greetings, explanations, or feedback.
Do NOT answer the question yourself.
Just ask the next question from the list.
Use simple, natural language appropriate for Band ${level}.
    `;

    try {
        // Fetch the question document by topic (topic is the document ID)
        const questionDocRef = doc(db, 'questions', topic);
        const questionDocSnap = await getDoc(questionDocRef);
        let firstQuestion = `Let's begin. Tell me about ${topic.toLowerCase()}.`;
        if (questionDocSnap.exists()) {
            const questions = questionDocSnap.data().questions;
            if (questions && questions.length > 0) {
                // Pick a random question
                const randomIndex = Math.floor(Math.random() * questions.length);
                firstQuestion = questions[randomIndex];
            }
        }

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "user",
                        content: firstQuestion,
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
