import { logger } from '../utils/logger';
import { SPEECH_ANALYSIS_CONFIG } from '../config/speechAnalysisConfig';

/**
 * Validates if a response has the required structure and data
 * @param {Object} responseData - Response data to validate
 * @param {number} index - Index of the response for logging
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateResponse = (responseData, index = 0) => {
    if (!responseData || !responseData.words || !Array.isArray(responseData.words) || responseData.words.length === 0) {
        logger.warn('Invalid or empty response data', { index, responseData: !!responseData });
        return false;
    }
    return true;
};

/**
 * Validates if the speech duration is sufficient for analysis
 * @param {number} duration - Duration in seconds
 * @param {number} minDuration - Minimum required duration
 * @param {number} wordCount - Number of words spoken
 * @returns {boolean} - True if sufficient, false otherwise
 */
export const validateDuration = (duration, minDuration, wordCount = 0) => {
    if (duration < minDuration) {
        logger.warn('Speech sample too short for reliable analysis', { 
            duration, 
            wordCount,
            minDuration 
        });
        return false;
    }
    return true;
};

/**
 * Validates word-level timestamp data
 * @param {Object} word - Word object with timestamps
 * @returns {boolean} - True if valid timestamps exist
 */
export const validateWordTimestamps = (word) => {
    return word && 
           typeof word.start === 'number' && 
           typeof word.end === 'number' &&
           word.start >= 0 && 
           word.end > word.start;
};

/**
 * Helper function for safe array access
 * @param {Array} arr - Array to access
 * @param {number} index - Index to access
 * @returns {*} - Element at index or null if out of bounds
 */
export const safeArrayAccess = (arr, index) => {
    return index >= 0 && index < arr.length ? arr[index] : null;
};

/**
 * Validates input responses array and returns error result if invalid
 * @param {Array} responses - Array of speech responses
 * @returns {Object} - Object with isValid boolean and errorResult if invalid
 */
export const validateInput = (responses) => {
    if (!Array.isArray(responses) || responses.length === 0) {
        logger.warn('No valid responses provided for analysis');
        return {
            isValid: false,
            errorResult: {
                wpm: '0.00',
                pauseFrequency: '0.00',
                pauseCount: 0,
                pauseDuration: '0.00',
                fluencyBand: 'N/A',
                clarityScore: 'N/A',
                feedback: ['Error: No valid responses available for analysis.'],
                individualResults: [],
            }
        };
    }
    return { isValid: true };
};

/**
 * Validates individual response data
 * @param {Object} responseData - Individual response data
 * @param {number} index - Index for logging
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateResponseData = (responseData, index = 0) => {
    return validateResponse(responseData, index);
};

/**
 * Checks if duration meets minimum threshold
 * @param {number} duration - Duration in seconds
 * @returns {boolean} - True if meets minimum duration
 */
export const hasMinimumDuration = (duration) => {
    return duration >= SPEECH_ANALYSIS_CONFIG.MIN_DURATION;
};