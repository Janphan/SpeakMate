import { logger } from '../utils/logger';
import { SPEECH_ANALYSIS_CONFIG } from '../config/speechAnalysisConfig';

/**
 * Analyzes pronunciation clarity from speech segments
 * @param {Array} segments - Array of speech segments with avg_logprob
 * @returns {string} - Clarity score: 'High', 'Moderate', 'Low', or 'Missing Data'
 */
export const analyzePronunciation = (segments) => {
    if (!segments || !Array.isArray(segments) || segments.length === 0) {
        logger.warn('No segments provided for clarity analysis');
        return 'Missing Data';
    }
    
    const segment = segments[0];
    if (!segment || typeof segment.avg_logprob !== 'number') {
        logger.warn('Missing or invalid segment data for clarity analysis', { 
            hasSegments: segments.length > 0,
            hasAvgLogprob: !!segment?.avg_logprob,
            segmentType: typeof segment?.avg_logprob
        });
        return 'Missing Data';
    }
    
    const thresholds = SPEECH_ANALYSIS_CONFIG.CLARITY_THRESHOLDS;
    let clarityScore = 'Low'; // Default
    
    if (segment.avg_logprob > thresholds.high) {
        clarityScore = 'High';
    } else if (segment.avg_logprob > thresholds.moderate) {
        clarityScore = 'Moderate';
    }
    
    logger.debug('Calculated clarity score', { 
        avg_logprob: segment.avg_logprob, 
        clarityScore 
    });
    
    return clarityScore;
};

/**
 * Calculates aggregated pronunciation clarity from multiple responses
 * @param {Array} responses - Array of response objects with segments
 * @param {Array} results - Array of individual analysis results
 * @returns {string} - Aggregated clarity score
 */
export const calculateAggregatedClarity = (responses, results) => {
    if (!responses || !results || responses.length === 0 || results.length === 0) {
        logger.warn('No data provided for aggregated clarity analysis');
        return 'Missing Data';
    }
    
    const validSegments = results
        .map((result, idx) => {
            if (idx >= responses.length) return null;
            
            const response = responses[idx];
            return response && response.segments && Array.isArray(response.segments) && response.segments.length > 0
                ? response.segments[0]
                : null;
        })
        .filter(segment => segment && typeof segment.avg_logprob === 'number');
    
    if (validSegments.length === 0) {
        logger.warn('No valid segments available for aggregated clarity analysis', {
            totalResponses: responses.length,
            resultsCount: results.length,
            validSegmentsCount: validSegments.length
        });
        return 'Missing Data';
    }
    
    const avgLogprob = validSegments.reduce((sum, segment) => sum + segment.avg_logprob, 0) / validSegments.length;
    const thresholds = SPEECH_ANALYSIS_CONFIG.CLARITY_THRESHOLDS;
    
    let clarityScore = 'Low'; // Default
    if (avgLogprob > thresholds.high) {
        clarityScore = 'High';
    } else if (avgLogprob > thresholds.moderate) {
        clarityScore = 'Moderate';
    }
    
    logger.debug('Calculated aggregated clarity score', { 
        avgLogprob: avgLogprob.toFixed(3), 
        clarityScore,
        validSegmentsCount: validSegments.length 
    });
    
    return clarityScore;
};