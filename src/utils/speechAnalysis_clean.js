import { logger } from '../utils/logger';
import { validateInput, validateResponseData, hasMinimumDuration, safeArrayAccess } from '../utils/speechValidation';
import { calculateWordMetrics, calculatePauseMetrics, determineFluencyBand, calculateAggregatedMetrics } from '../utils/speechCalculations';
import { analyzePronunciation, calculateAggregatedClarity } from '../services/clarityAnalyzer';
import { generateIndividualFeedback, generateAggregatedFeedback } from '../services/feedbackGenerator';
import { SPEECH_ANALYSIS_CONFIG } from '../config/speechAnalysisConfig';

/**
 * Analyzes speech responses for IELTS speaking assessment
 */
export function analyzeSpeech(responses) {
    const inputValidation = validateInput(responses);
    if (!inputValidation.isValid) {
        return inputValidation.errorResult;
    }

    const results = responses
        .map((responseData, index) => {
            if (!validateResponseData(responseData, index)) {
                return null;
            }

            const wordMetrics = calculateWordMetrics(responseData);
            const pauseMetrics = calculatePauseMetrics(responseData);
            
            const fluencyBand = hasMinimumDuration(wordMetrics.totalDuration) 
                ? determineFluencyBand(wordMetrics.wpm, pauseMetrics.pauseFrequency, wordMetrics.totalDuration)
                : 'Insufficient Data';

            const clarityScore = analyzePronunciation(responseData.segments || []);

            const analysis = {
                fluencyBand,
                wpm: wordMetrics.wpm,
                pauseFrequency: pauseMetrics.pauseFrequency,
                totalDuration: wordMetrics.totalDuration
            };
            const feedback = generateIndividualFeedback(analysis);

            return {
                wpm: wordMetrics.wpm.toFixed(2),
                pauseCount: pauseMetrics.pauseCount,
                pauseFrequency: pauseMetrics.pauseFrequency.toFixed(2),
                pauseDuration: pauseMetrics.pauseDuration.toFixed(2),
                fluencyBand,
                clarityScore,
                feedback,
                wordCount: wordMetrics.wordCount,
                totalDuration: wordMetrics.totalDuration,
            };
        })
        .filter(result => result !== null);

    if (results.length === 0) {
        logger.warn('No valid results after processing responses', { responseCount: responses.length });
        return {
            wpm: '0.00',
            pauseFrequency: '0.00',
            pauseCount: 0,
            pauseDuration: '0.00',
            fluencyBand: 'N/A',
            clarityScore: 'N/A',
            feedback: ['Error: No valid speech data available for analysis.'],
            individualResults: [],
        };
    }

    const aggregatedMetrics = calculateAggregatedMetrics(results);
    const fluencyBand = determineFluencyBand(
        parseFloat(aggregatedMetrics.wpm), 
        parseFloat(aggregatedMetrics.pauseFrequency),
        aggregatedMetrics.totalDuration
    );
    const clarityScore = calculateAggregatedClarity(responses, results);
    const feedback = generateAggregatedFeedback(aggregatedMetrics, fluencyBand);

    return {
        wpm: aggregatedMetrics.wpm,
        pauseFrequency: aggregatedMetrics.pauseFrequency,
        pauseCount: aggregatedMetrics.pauseCount,
        pauseDuration: aggregatedMetrics.pauseDuration,
        fluencyBand,
        clarityScore,
        feedback,
        totalWords: aggregatedMetrics.totalWords,
        individualResults: results,
    };
}