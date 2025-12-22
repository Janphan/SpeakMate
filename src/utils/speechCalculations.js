import { logger } from '../utils/logger';
import { SPEECH_ANALYSIS_CONFIG } from '../config/speechAnalysisConfig';
import { safeArrayAccess, validateWordTimestamps } from './speechValidation';

/**
 * Calculates Words Per Minute (WPM) from word count and duration
 * @param {number} wordCount - Number of words spoken
 * @param {number} duration - Duration in seconds
 * @returns {number} - Words per minute
 */
export const calculateWPM = (wordCount, duration) => {
    return duration > 0 ? (wordCount / (duration / 60)) : 0;
};

/**
 * Detects and counts pauses in speech (both silent and filled)
 * @param {Array} words - Array of word objects with timestamps
 * @param {Object} config - Pause configuration from SPEECH_ANALYSIS_CONFIG
 * @returns {Object} - Object containing pauseCount and pauseDuration
 */
export const detectPauses = (words, config = SPEECH_ANALYSIS_CONFIG.PAUSE_CONFIG) => {
    let pauseCount = 0;
    let pauseDuration = 0;
    
    for (let i = 0; i < words.length; i++) {
        const currentWord = safeArrayAccess(words, i);
        const previousWord = safeArrayAccess(words, i - 1);
        
        // Check for filled pauses (filler words)
        if (currentWord && currentWord.word) {
            const wordText = currentWord.word.toLowerCase().trim();
            if (config.fillerWords.includes(wordText)) {
                pauseCount++;
                logger.debug('Detected filler word', { word: wordText, position: i });
            }
        }
        
        // Check for silent pauses (time gaps)
        if (currentWord && previousWord && 
            validateWordTimestamps(currentWord) && validateWordTimestamps(previousWord)) {
            const gap = currentWord.start - previousWord.end;
            if (gap > config.silentPauseThreshold) {
                pauseCount++;
                pauseDuration += gap;
                logger.debug('Detected silent pause', { gap: gap.toFixed(2), position: i });
            }
        }
    }
    
    return { pauseCount, pauseDuration };
};

/**
 * Calculates pause frequency per 30-second interval
 * @param {number} pauseCount - Total number of pauses
 * @param {number} duration - Total duration in seconds
 * @returns {number} - Pauses per 30 seconds
 */
export const calculatePauseFrequency = (pauseCount, duration) => {
    return duration > 0 ? (pauseCount / (duration / 30)) : 0;
};

/**
 * Determines IELTS fluency band based on WPM and pause frequency
 * @param {number} wpm - Words per minute
 * @param {number} pauseFrequency - Pauses per 30 seconds
 * @param {number} duration - Speech duration in seconds
 * @param {Object} config - WPM thresholds configuration
 * @returns {string} - IELTS band level
 */
export const determineFluencyBand = (wpm, pauseFrequency, duration, config = SPEECH_ANALYSIS_CONFIG) => {
    // Check for insufficient data
    if (duration < config.MIN_DURATION) {
        return 'Insufficient Data';
    }
    
    const roundedPause = Math.round(pauseFrequency);
    const thresholds = config.WPM_THRESHOLDS;
    
    // Check each band from highest to lowest
    if (wpm >= thresholds['Band 6+'].minWpm && roundedPause <= thresholds['Band 6+'].maxPauses) {
        return 'Band 6+';
    } else if (wpm >= thresholds['Band 6'].minWpm && roundedPause <= thresholds['Band 6'].maxPauses) {
        return 'Band 6';
    } else if (wpm >= thresholds['Band 5.5'].minWpm && roundedPause <= thresholds['Band 5.5'].maxPauses) {
        return 'Band 5.5';
    } else if (wpm >= thresholds['Band 5'].minWpm && roundedPause <= thresholds['Band 5'].maxPauses) {
        return 'Band 5';
    }
    
    return 'Below Band 5';
};

/**
 * Calculates aggregated metrics from multiple individual results
 * @param {Array} results - Array of individual analysis results
 * @returns {Object} - Aggregated metrics
 */
export const calculateAggregatedMetrics = (results) => {
    if (!results || results.length === 0) {
        return {
            totalWords: 0,
            totalDuration: 0,
            wpm: '0.00',
            pauseCount: 0,
            pauseDuration: '0.00',
            pauseFrequency: '0.00'
        };
    }
    
    const totalWords = results.reduce((sum, result) => sum + result.wordCount, 0);
    const totalDuration = results.reduce((sum, result) => sum + result.totalDuration, 0);
    const wpm = totalDuration > 0 ? (totalWords / (totalDuration / 60)).toFixed(2) : '0.00';
    
    const pauseCount = results.reduce((sum, result) => sum + result.pauseCount, 0);
    const pauseDuration = results.reduce((sum, result) => sum + parseFloat(result.pauseDuration), 0).toFixed(2);
    const pauseFrequency = totalDuration > 0 ? (pauseCount / (totalDuration / 30)).toFixed(2) : '0.00';
    
    return {
        totalWords,
        totalDuration,
        wpm,
        pauseCount,
        pauseDuration,
        pauseFrequency
    };
};

/**
 * Calculates word-level metrics from speech response data
 * @param {Object} responseData - Speech response with words and duration
 * @returns {Object} - Word metrics (wordCount, totalDuration, wpm)
 */
export const calculateWordMetrics = (responseData) => {
    const words = responseData.words || [];
    const wordCount = words.length;
    
    // Calculate total duration
    const totalDuration = responseData.duration || 
        (words.length > 0 ? words[words.length - 1].end : 0);
    
    // Calculate Words Per Minute using existing function
    const wpm = calculateWPM(wordCount, totalDuration);
    
    return {
        wordCount,
        totalDuration,
        wpm
    };
};

/**
 * Calculates pause-related metrics from speech response
 * @param {Object} responseData - Speech response with words
 * @returns {Object} - Pause metrics (pauseCount, pauseDuration, pauseFrequency)  
 */
export const calculatePauseMetrics = (responseData) => {
    const words = responseData.words || [];
    const { pauseCount, pauseDuration } = detectPauses(words);
    
    const totalDuration = calculateWordMetrics(responseData).totalDuration;
    const pauseFrequency = calculatePauseFrequency(pauseCount, totalDuration);
    
    return {
        pauseCount,
        pauseDuration,
        pauseFrequency
    };
};