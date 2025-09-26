import axios from 'axios';
import { OPENAI_API_KEY } from '@env';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

// Track used questions per conversation session
let usedQuestions = new Set();
let currentTopicQuestions = [];

// Reset question tracking for new conversation
export const resetQuestionTracking = () => {
    console.log('🔄 Resetting question tracking for new conversation');
    usedQuestions.clear();
    currentTopicQuestions = [];
};

// Get question progress statistics
export const getQuestionProgress = () => {
    return {
        totalQuestions: currentTopicQuestions.length,
        usedQuestions: usedQuestions.size,
        remainingQuestions: currentTopicQuestions.length - usedQuestions.size,
        progressPercentage: currentTopicQuestions.length > 0
            ? Math.round((usedQuestions.size / currentTopicQuestions.length) * 100)
            : 0
    };
};

// Get a random unused question for the topic from Firestore
export const getOpenAIResponse = async (topic, level) => {
    const systemPrompt = `
You are an IELTS speaking examiner named "LetTalk".
ONLY ask the user one question at a time from the provided list of questions about "${topic}".
Do NOT repeat questions that have already been asked.
Do NOT add greetings, explanations, or feedback.
Do NOT answer the question yourself.
Just ask the next question from the list naturally and conversationally.
Use simple, natural language appropriate for Band ${level}.
Keep questions varied and engaging to simulate a real IELTS interview.
    `;

    try {
        // Fetch questions only if we don't have them cached or if it's a new topic
        if (currentTopicQuestions.length === 0) {
            const questionDocRef = doc(db, 'questions', topic);
            const questionDocSnap = await getDoc(questionDocRef);

            if (questionDocSnap.exists()) {
                const questions = questionDocSnap.data().questions;
                if (questions && questions.length > 0) {
                    currentTopicQuestions = [...questions]; // Cache the questions
                }
            }
        }

        let selectedQuestion = `Let's begin. Tell me about ${topic.toLowerCase()}.`;

        if (currentTopicQuestions.length > 0) {
            // Find unused questions
            const unusedQuestions = currentTopicQuestions.filter((_, index) => !usedQuestions.has(index));

            if (unusedQuestions.length > 0) {
                // Pick a random unused question
                const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
                const selectedQuestionText = unusedQuestions[randomIndex];

                // Find the original index and mark it as used
                const originalIndex = currentTopicQuestions.indexOf(selectedQuestionText);
                usedQuestions.add(originalIndex);
                selectedQuestion = selectedQuestionText;

                console.log(`Selected question ${originalIndex + 1}/${currentTopicQuestions.length}: ${selectedQuestion}`);
            } else {
                // All questions used, provide a wrap-up question
                selectedQuestion = `We've covered many aspects of ${topic.toLowerCase()}. Is there anything else you'd like to share about this topic?`;
                console.log("All questions used, providing wrap-up question");
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
                        content: selectedQuestion,
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
