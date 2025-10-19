import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { logger } from '../utils/logger';

// Track used questions per conversation session
const usedQuestions = new Set();
let currentTopicQuestions = [];

// Reset question tracking for new conversation
export const resetQuestionTracking = (newTopic = null) => {
    logger.debug('Resetting question tracking for new conversation', {
        previouslyUsed: usedQuestions.size,
        totalQuestions: currentTopicQuestions.length,
        newTopic: newTopic
    });
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
    try {
        // Always fetch fresh questions for the topic to ensure we have the latest data
        logger.info('Fetching questions for topic', { topic: topic });
        const questionDocRef = doc(db, 'questions', topic);
        const questionDocSnap = await getDoc(questionDocRef);

        if (questionDocSnap.exists()) {
            const questions = questionDocSnap.data().questions;
            if (questions && questions.length > 0) {
                // Only update cache if we don't have questions or if it's a different set
                if (currentTopicQuestions.length === 0 ||
                    JSON.stringify(currentTopicQuestions) !== JSON.stringify(questions)) {
                    currentTopicQuestions = [...questions];
                    logger.info('Questions loaded for topic', {
                        topic: topic,
                        questionCount: questions.length
                    });
                }
            }
        } else {
            logger.warn('No questions found for topic in Firestore', {
                topic: topic,
                message: 'Question document does not exist - check if initializeQuestionBanks completed successfully'
            });
        }

        let selectedQuestion = `Let's begin. Tell me about ${topic.toLowerCase()}.`;

        if (currentTopicQuestions.length > 0) {
            // Find unused question indices
            const unusedQuestionIndices = [];
            for (let i = 0; i < currentTopicQuestions.length; i++) {
                if (!usedQuestions.has(i)) {
                    unusedQuestionIndices.push(i);
                }
            }

            if (unusedQuestionIndices.length > 0) {
                // Pick a random unused question index
                const randomIndexPosition = Math.floor(Math.random() * unusedQuestionIndices.length);
                const selectedQuestionIndex = unusedQuestionIndices[randomIndexPosition];

                // Get the question text and mark the index as used
                selectedQuestion = currentTopicQuestions[selectedQuestionIndex];
                usedQuestions.add(selectedQuestionIndex);

                logger.debug('Question selected', {
                    questionIndex: selectedQuestionIndex,
                    questionNumber: selectedQuestionIndex + 1,
                    totalQuestions: currentTopicQuestions.length,
                    remainingQuestions: unusedQuestionIndices.length - 1,
                    question: selectedQuestion
                });
            } else {
                // All questions used, provide a wrap-up question
                selectedQuestion = `We've covered many aspects of ${topic.toLowerCase()}. Is there anything else you'd like to share about this topic?`;
                logger.info("All questions used, providing wrap-up question");
            }
        }

        // Return the selected question directly - no need for OpenAI to generate it
        logger.info('Returning selected question', {
            selectedQuestion: selectedQuestion,
            topic: topic
        });

        return selectedQuestion;
    } catch (error) {
        logger.error("OpenAI API Error", {
            error: error.message,
            status: error.response?.status,
            topic: topic,
            level: level
        });
        return "I'm sorry, I couldn't process your request.";
    }
};
