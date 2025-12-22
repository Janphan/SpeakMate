import { SPEECH_ANALYSIS_CONFIG } from '../config/speechAnalysisConfig';

/**
 * Generates feedback for individual speech response analysis
 * @param {Object} analysis - Individual analysis results
 * @returns {Array} - Array of feedback strings
 */
export const generateIndividualFeedback = (analysis) => {
    const { fluencyBand, wpm, pauseFrequency, totalDuration } = analysis;
    const feedback = [];
    const config = SPEECH_ANALYSIS_CONFIG;
    
    // Main fluency assessment with specific guidance
    if (fluencyBand === 'Insufficient Data') {
        feedback.push(`⏱️ Response too short (${totalDuration.toFixed(1)}s): Please speak for at least ${config.MIN_DURATION}-10 seconds to get a reliable fluency assessment. Try elaborating on your answer with examples or additional details.`);
        return feedback; // Return early for insufficient data
    }
    
    // Band-specific feedback
    switch (fluencyBand) {
        case 'Band 6+':
            feedback.push(`🌟 Outstanding fluency (${wpm.toFixed(0)} WPM)! You demonstrate native-like speech flow. To maintain this level: vary your sentence structures and continue practicing complex topics.`);
            break;
        case 'Band 6':
            feedback.push(`🎯 Excellent Band 6 fluency (${wpm.toFixed(0)} WPM)! You speak at a natural pace with good rhythm. To reach Band 6+: try incorporating more sophisticated vocabulary while maintaining this pace.`);
            break;
        case 'Band 5.5':
            feedback.push(`✅ Good Band 5.5 fluency (${wpm.toFixed(0)} WPM). You're close to Band 6! Practice speaking in longer sentences and work on maintaining consistent speed throughout your response.`);
            break;
        case 'Band 5':
            feedback.push(`📈 Solid Band 5 fluency (${wpm.toFixed(0)} WPM). To improve: practice speaking slightly faster and focus on connecting ideas more smoothly without extra pauses.`);
            break;
        default:
            feedback.push(`🎯 Focus needed: Your pace (${wpm.toFixed(0)} WPM) needs improvement. Practice reading aloud daily, start slowly and gradually increase speed while maintaining clarity.`);
    }
    
    // Add specific pace and pause guidance
    const thresholds = config.FEEDBACK_THRESHOLDS;
    
    // Pace-specific guidance
    if (wpm < thresholds.tooSlow) {
        feedback.push('💡 Speaking tip: Your pace is quite slow. Try recording yourself reading news articles, then gradually increase speed while staying clear.');
    } else if (wpm >= thresholds.tooSlow && wpm < thresholds.slowButImproving) {
        feedback.push('⏩ Speed improvement: You\'re getting there! Practice tongue twisters and read aloud for 10 minutes daily to naturally increase pace.');
    } else if (wpm > thresholds.tooFast) {
        feedback.push('⏸️ Pace control: You\'re speaking very fast. Take deep breaths between sentences and focus on clear pronunciation of each word.');
    } else if (wpm > thresholds.fastButUnclear) {
        feedback.push('🎧 Clarity focus: Good speed, but ensure your pronunciation stays clear. Practice speaking slowly first, then gradually increase pace.');
    }
    
    // Pause-specific guidance
    if (pauseFrequency > thresholds.tooManyPauses) {
        feedback.push('🔗 Fluency tip: Too many hesitations and filler words. Practice linking words together: "and then," "also," "however." Prepare common phrases and avoid "um," "uh," "like."');
    } else if (pauseFrequency > thresholds.slightlyTooManyPauses) {
        feedback.push('🎯 Pause reduction: Slightly too many pauses and fillers. Practice speaking in chunks of 5-7 words without stopping. Reduce "um," "uh" and use linking words instead.');
    } else if (pauseFrequency === 0 && wpm > thresholds.goodSpeed) {
        feedback.push('⚖️ Natural rhythm: Great speed and fluency! Consider adding strategic pauses before important points to make your speech more engaging.');
    } else if (pauseFrequency < 1 && wpm < thresholds.goodSpeed) {
        feedback.push('🎭 Expression tip: Add natural pauses at comma points and between ideas. This makes your speech more organized and easier to follow.');
    }
    
    return feedback;
};

/**
 * Generates aggregated feedback from multiple speech responses
 * @param {Object} aggregatedMetrics - Aggregated analysis metrics
 * @param {string} fluencyBand - Overall fluency band
 * @returns {Array} - Array of aggregated feedback strings
 */
export const generateAggregatedFeedback = (aggregatedMetrics, fluencyBand) => {
    const { wpm, pauseFrequency } = aggregatedMetrics;
    const feedback = [];
    const thresholds = SPEECH_ANALYSIS_CONFIG.FEEDBACK_THRESHOLDS;
    
    // Main performance summary with specific guidance
    switch (fluencyBand) {
        case 'Band 6+':
            feedback.push(`🏆 Exceptional overall performance! Average ${wpm} WPM with ${pauseFrequency} pauses per 30s demonstrates advanced fluency. Continue practicing with challenging topics to maintain this excellent level.`);
            break;
        case 'Band 6':
            feedback.push(`🌟 Excellent overall fluency! Your average ${wpm} WPM and ${pauseFrequency} pauses per 30s meet Band 6 standards. To reach Band 6+: focus on using more complex sentence structures while maintaining this natural pace.`);
            break;
        case 'Band 5.5':
            feedback.push(`✨ Strong Band 5.5 performance (${wpm} WPM, ${pauseFrequency} pauses per 30s). You're very close to Band 6! Practice speaking for longer periods (2-3 minutes) without stopping to build stamina.`);
            break;
        case 'Band 5':
            feedback.push(`📊 Solid Band 5 achievement (${wpm} WPM, ${pauseFrequency} pauses per 30s). To reach Band 5.5: practice speaking slightly faster and use more connecting phrases like "furthermore," "in addition," "however."`);
            break;
        default:
            feedback.push(`🎯 Growth opportunity: Your average ${wpm} WPM and ${pauseFrequency} pauses per 30s indicate room for improvement. Focus on daily speaking practice with a timer to build fluency gradually.`);
    }
    
    // Targeted improvement suggestions based on WPM
    const wpmValue = parseFloat(wpm);
    if (wpmValue < thresholds.tooSlow) {
        feedback.push('🚀 Speed building strategy: Start with 5-minute daily reading aloud sessions. Gradually increase your natural speaking pace by practicing familiar topics first.');
    } else if (wpmValue < thresholds.slowButImproving) {
        feedback.push('⚡ Pace enhancement: You\'re making progress! Practice describing pictures or telling stories to build natural speaking speed. Aim for 15-20 words per breath.');
    } else if (wpmValue > thresholds.tooFast) {
        feedback.push('🎯 Pace control needed: Your speed is impressive but may affect clarity. Practice with a metronome or count "1-2-3" between sentences to find your optimal pace.');
    } else if (wpmValue > thresholds.fastButUnclear) {
        feedback.push('⚖️ Balance speed and clarity: Great pace! Ensure each word is pronounced clearly. Record yourself and listen back for any unclear pronunciations.');
    }
    
    // Strategic pause guidance
    const pauseValue = parseFloat(pauseFrequency);
    if (pauseValue > thresholds.tooManyPauses) {
        feedback.push('🔄 Fluency strategy: Practice "chunking" - group 5-7 words together before pausing. Use phrases like "what I mean is..." to buy thinking time naturally.');
    } else if (pauseValue > thresholds.slightlyTooManyPauses) {
        feedback.push('🎪 Smooth transitions: Work on connecting ideas without hesitation. Practice using transitional phrases and prepare 2-3 examples for common topics beforehand.');
    } else if (pauseValue < 1) {
        feedback.push('🎭 Natural rhythm: Consider adding strategic pauses for emphasis and to organize your thoughts. Pause briefly after main points and before examples.');
    }
    
    return feedback;
};