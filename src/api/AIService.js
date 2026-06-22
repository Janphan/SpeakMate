import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { logger } from '../utils/logger';

const usedQuestions = { part1: new Set(), part2: new Set(), part3: new Set() };
let sessionData = { part1: [], part2: [], part3: [] };
let sessionPlan = null;

const normalizeLevel = (level) => {
    if (!level) return '';
    return level
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

const buildDocId = (topic, level) => {
    const normalizedLevel = normalizeLevel(level);
    return `${topic}_${normalizedLevel}`.replace(/\s+/g, '_');
};

const pickRandomUnused = (arr, usedSet) => {
    const unused = [];
    for (let i = 0; i < arr.length; i++) {
        if (!usedSet.has(i)) unused.push(i);
    }
    if (unused.length === 0) return null;
    const idx = unused[Math.floor(Math.random() * unused.length)];
    usedSet.add(idx);
    return idx;
};

// Normalize question bank: convert flat 'questions' array to part1/part2/part3 if needed
const normalizeBankData = (data, topic) => {
    if (data.part1 && data.part2 && data.part3) return data;
    // Legacy format: split flat questions into parts
    const qs = data.questions || [];
    const mid = Math.floor(qs.length / 3);
    return {
        part1: qs.slice(0, mid),
        part2: qs.slice(mid, mid * 2).map(q => ({
            cueCard: q,
            prompts: []
        })),
        part3: qs.slice(mid * 2),
    };
};

export const resetQuestionTracking = () => {
    usedQuestions.part1.clear();
    usedQuestions.part2.clear();
    usedQuestions.part3.clear();
    sessionData = { part1: [], part2: [], part3: [] };
    sessionPlan = null;
};

// Fetch the full session plan for a topic + level
export const fetchSessionPlan = async (topic, level) => {
    try {
        let questionDocRef;
        if (level) {
            const docId = buildDocId(topic, level);
            questionDocRef = doc(db, 'questions', docId);
        } else {
            questionDocRef = doc(db, 'questions', topic);
        }

        let questionDocSnap = await getDoc(questionDocRef);

        if (level && !questionDocSnap.exists()) {
            logger.warn('Level-specific questions not found, falling back to topic-only', { topic, level });
            questionDocRef = doc(db, 'questions', topic);
            questionDocSnap = await getDoc(questionDocRef);
        }

        if (!questionDocSnap.exists()) {
            logger.warn('No questions found for topic', { topic });
            return null;
        }

        const data = normalizeBankData(questionDocSnap.data(), topic);
        sessionData = {
            part1: data.part1 || [],
            part2: data.part2 || [],
            part3: data.part3 || [],
        };

        sessionPlan = {
            part1Questions: data.part1 || [],
            part2CueCards: data.part2 || [],
            part3Questions: data.part3 || [],
        };

        logger.info('Session plan loaded', {
            topic,
            level,
            part1Count: sessionData.part1.length,
            part2Count: sessionData.part2.length,
            part3Count: sessionData.part3.length,
        });

        return sessionPlan;
    } catch (error) {
        logger.error('Error fetching session plan', { error: error.message, topic, level });
        return null;
    }
};

// Get next Part 1 question
export const getNextPart1Question = () => {
    const idx = pickRandomUnused(sessionData.part1, usedQuestions.part1);
    if (idx === null) return null;
    return sessionData.part1[idx];
};

// Get next Part 2 cue card (in order, not random)
export const getNextPart2CueCard = () => {
    const idx = pickRandomUnused(sessionData.part2, usedQuestions.part2);
    if (idx === null) return null;
    return sessionData.part2[idx];
};

// Get next Part 3 question
export const getNextPart3Question = () => {
    const idx = pickRandomUnused(sessionData.part3, usedQuestions.part3);
    if (idx === null) return null;
    return sessionData.part3[idx];
};

// Legacy: get random unused question from any part (backward compat)
export const getOpenAIResponse = async (topic, level) => {
    if (!sessionPlan) {
        await fetchSessionPlan(topic, level);
    }
    const q = getNextPart1Question() || getNextPart3Question();
    return q || `Let's begin. Tell me about ${topic.toLowerCase()}.`;
};

export const getProgress = () => {
    const total = sessionData.part1.length + sessionData.part3.length;
    const used = usedQuestions.part1.size + usedQuestions.part3.size;
    return {
        totalQuestions: total + sessionData.part2.length,
        usedQuestions: used + usedQuestions.part2.size,
        remainingQuestions: (total + sessionData.part2.length) - (used + usedQuestions.part2.size),
        progressPercentage: total > 0 ? Math.round((used / total) * 100) : 0,
        part1Progress: `${usedQuestions.part1.size}/${sessionData.part1.length}`,
        part3Progress: `${usedQuestions.part3.size}/${sessionData.part3.length}`,
    };
};
