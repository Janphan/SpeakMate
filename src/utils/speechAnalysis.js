import { logger } from '../utils/logger';

// Helper function for safe array access
const safeArrayAccess = (arr, index) => index >= 0 && index < arr.length ? arr[index] : null;

export function analyzeSpeech(responses) {
    // Validate input
    if (!Array.isArray(responses) || responses.length === 0) {
        logger.warn('No valid responses provided for analysis');
        return {
            wpm: '0.00',
            pauseFrequency: '0.00',
            pauseCount: 0,
            pauseDuration: '0.00',
            fluencyBand: 'N/A',
            clarityScore: 'N/A',
            feedback: ['Error: No valid responses available for analysis.'],
            individualResults: [],
        };
    }

    // Process each response
    const results = responses
        .map((responseData, index) => {
            // Validate responseData
            if (!responseData || !responseData.words || !Array.isArray(responseData.words) || responseData.words.length === 0) {
                logger.warn('Invalid or empty response data', { index, responseData: !!responseData });
                return null;
            }

            const segments = responseData.segments || [];
            const words = responseData.words;

            // Calculate WPM using word-level timestamps
            const wordCount = words.length;
            const totalDuration = responseData.duration || (words.length > 0 ? words[words.length - 1].end : 0);
            const wpm = totalDuration > 0 ? (wordCount / (totalDuration / 60)) : 0;

            // Calculate pause frequency (>0.5s gaps) using word-level timestamps
            let pauseCount = 0;
            let pauseDuration = 0;
            for (let i = 0; i < words.length; i++) {
                const currentWord = safeArrayAccess(words, i);
                const previousWord = safeArrayAccess(words, i - 1);
                if (currentWord && previousWord &&
                    typeof currentWord.start === 'number' &&
                    typeof previousWord.end === 'number') {
                    const gap = currentWord.start - previousWord.end;
                    if (gap > 0.5) {
                        pauseCount++;
                        pauseDuration += gap;
                    }
                }
            }
            const pauseFrequency = totalDuration > 0 ? (pauseCount / (totalDuration / 30)) : 0;

            let fluencyBand = 'Below Band 5';
            const roundedPause = Math.round(pauseFrequency);

            // Improved band logic - prioritize WPM, then consider pauses
            if (wpm >= 140 && roundedPause <= 2) {
                fluencyBand = 'Band 6+';
            }
            else if (wpm >= 120 && roundedPause <= 3) {
                fluencyBand = 'Band 6';
            }
            else if (wpm >= 110 && roundedPause <= 4) {
                fluencyBand = 'Band 5.5';
            }
            else if (wpm >= 90 && roundedPause <= 5) {
                fluencyBand = 'Band 5';
            }

            // Pronunciation clarity (using avg_logprob from first segment)
            const segment = segments[0] || {};
            const clarityScore =
                segment.avg_logprob && segment.avg_logprob > -0.3 ? 'High' :
                    segment.avg_logprob && segment.avg_logprob > -0.7 ? 'Moderate' : 'Low';

            // Feedback for individual response
            const feedback = [];

            // Main fluency assessment with specific guidance
            if (fluencyBand === 'Band 6+') {
                feedback.push(`🌟 Outstanding fluency (${wpm.toFixed(0)} WPM)! You demonstrate native-like speech flow. To maintain this level: vary your sentence structures and continue practicing complex topics.`);
            } else if (fluencyBand === 'Band 6') {
                feedback.push(`🎯 Excellent Band 6 fluency (${wpm.toFixed(0)} WPM)! You speak at a natural pace with good rhythm. To reach Band 6+: try incorporating more sophisticated vocabulary while maintaining this pace.`);
            } else if (fluencyBand === 'Band 5.5') {
                feedback.push(`✅ Good Band 5.5 fluency (${wpm.toFixed(0)} WPM). You're close to Band 6! Practice speaking in longer sentences and work on maintaining consistent speed throughout your response.`);
            } else if (fluencyBand === 'Band 5') {
                feedback.push(`📈 Solid Band 5 fluency (${wpm.toFixed(0)} WPM). To improve: practice speaking slightly faster and focus on connecting ideas more smoothly without extra pauses.`);
            } else {
                feedback.push(`🎯 Focus needed: Your pace (${wpm.toFixed(0)} WPM) needs improvement. Practice reading aloud daily, start slowly and gradually increase speed while maintaining clarity.`);
            }

            // Specific pace guidance
            if (wpm < 70) {
                feedback.push('💡 Speaking tip: Your pace is quite slow. Try recording yourself reading news articles, then gradually increase speed while staying clear.');
            } else if (wpm >= 70 && wpm < 90) {
                feedback.push('⏩ Speed improvement: You\'re getting there! Practice tongue twisters and read aloud for 10 minutes daily to naturally increase pace.');
            } else if (wpm > 150) {
                feedback.push('⏸️ Pace control: You\'re speaking very fast. Take deep breaths between sentences and focus on clear pronunciation of each word.');
            } else if (wpm > 140) {
                feedback.push('🎧 Clarity focus: Good speed, but ensure your pronunciation stays clear. Practice speaking slowly first, then gradually increase pace.');
            }

            // Pause-specific guidance
            if (pauseFrequency > 7) {
                feedback.push('🔗 Fluency tip: Too many hesitations. Practice linking words together: "and then," "also," "however." Prepare common phrases beforehand.');
            } else if (pauseFrequency > 5) {
                feedback.push('🎯 Pause reduction: Slightly too many pauses. Practice speaking in chunks of 5-7 words without stopping. Use linking words to connect ideas.');
            } else if (pauseFrequency === 0 && wpm > 120) {
                feedback.push('⚖️ Natural rhythm: Great speed! Consider adding strategic pauses before important points to make your speech more engaging.');
            } else if (pauseFrequency < 1 && wpm < 120) {
                feedback.push('🎭 Expression tip: Add natural pauses at comma points and between ideas. This makes your speech more organized and easier to follow.');
            }

            return {
                wpm: wpm.toFixed(2),
                pauseCount,
                pauseFrequency: pauseFrequency.toFixed(2),
                pauseDuration: pauseDuration.toFixed(2),
                fluencyBand,
                clarityScore,
                feedback,
                wordCount,
                totalDuration,
            };
        })
        .filter(result => result !== null);

    // Calculate averages across valid results
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

    // Calculate aggregated WPM (total words / total duration in minutes)
    const totalWords = results.reduce((sum, result) => sum + result.wordCount, 0);
    const totalDuration = results.reduce((sum, result) => sum + result.totalDuration, 0);
    const wpm = totalDuration > 0 ? (totalWords / (totalDuration / 60)).toFixed(2) : '0.00';

    // Calculate aggregated pause metrics
    const pauseCount = results.reduce((sum, result) => sum + result.pauseCount, 0);
    const pauseDuration = results.reduce((sum, result) => sum + parseFloat(result.pauseDuration), 0).toFixed(2);
    const pauseFrequency = totalDuration > 0 ? (pauseCount / (totalDuration / 30)).toFixed(2) : '0.00';

    // Determine aggregated fluency band
    let fluencyBand = 'Below Band 5';
    const roundedPause = Math.round(parseFloat(pauseFrequency));

    // Improved band logic - prioritize WPM, then consider pauses
    if (parseFloat(wpm) >= 140 && roundedPause <= 2) {
        fluencyBand = 'Band 6+';
    }
    else if (parseFloat(wpm) >= 120 && roundedPause <= 3) {
        fluencyBand = 'Band 6';
    }
    else if (parseFloat(wpm) >= 110 && roundedPause <= 4) {
        fluencyBand = 'Band 5.5';
    }
    else if (parseFloat(wpm) >= 90 && roundedPause <= 5) {
        fluencyBand = 'Band 5';
    }

    // Aggregated pronunciation clarity (average avg_logprob across segments)
    const validSegments = results
        .map((result, idx) => {
            const response = safeArrayAccess(responses, idx);
            return response && response.segments && Array.isArray(response.segments) && response.segments.length > 0
                ? response.segments[0]
                : null;
        })
        .filter(segment => segment && segment.avg_logprob);
    const clarityScore = validSegments.length > 0
        ? (validSegments.reduce((sum, segment) => sum + segment.avg_logprob, 0) / validSegments.length > -0.3 ? 'High' :
            validSegments.reduce((sum, segment) => sum + segment.avg_logprob, 0) / validSegments.length > -0.7 ? 'Moderate' : 'Low')
        : 'N/A';

    // Generate aggregated feedback with actionable advice
    const feedback = [];

    // Main performance summary with specific guidance
    if (fluencyBand === 'Band 6+') {
        feedback.push(`🏆 Exceptional overall performance! Average ${wpm} WPM with ${pauseFrequency} pauses per 30s demonstrates advanced fluency. Continue practicing with challenging topics to maintain this excellent level.`);
    } else if (fluencyBand === 'Band 6') {
        feedback.push(`🌟 Excellent overall fluency! Your average ${wpm} WPM and ${pauseFrequency} pauses per 30s meet Band 6 standards. To reach Band 6+: focus on using more complex sentence structures while maintaining this natural pace.`);
    } else if (fluencyBand === 'Band 5.5') {
        feedback.push(`✨ Strong Band 5.5 performance (${wpm} WPM, ${pauseFrequency} pauses per 30s). You're very close to Band 6! Practice speaking for longer periods (2-3 minutes) without stopping to build stamina.`);
    } else if (fluencyBand === 'Band 5') {
        feedback.push(`📊 Solid Band 5 achievement (${wpm} WPM, ${pauseFrequency} pauses per 30s). To reach Band 5.5: practice speaking slightly faster and use more connecting phrases like "furthermore," "in addition," "however."`);
    } else {
        feedback.push(`🎯 Growth opportunity: Your average ${wpm} WPM and ${pauseFrequency} pauses per 30s indicate room for improvement. Focus on daily speaking practice with a timer to build fluency gradually.`);
    }

    // Targeted improvement suggestions
    if (parseFloat(wpm) < 70) {
        feedback.push('🚀 Speed building strategy: Start with 5-minute daily reading aloud sessions. Gradually increase your natural speaking pace by practicing familiar topics first.');
    } else if (parseFloat(wpm) < 90) {
        feedback.push('⚡ Pace enhancement: You\'re making progress! Practice describing pictures or telling stories to build natural speaking speed. Aim for 15-20 words per breath.');
    } else if (parseFloat(wpm) > 150) {
        feedback.push('🎯 Pace control needed: Your speed is impressive but may affect clarity. Practice with a metronome or count "1-2-3" between sentences to find your optimal pace.');
    } else if (parseFloat(wpm) > 140) {
        feedback.push('⚖️ Balance speed and clarity: Great pace! Ensure each word is pronounced clearly. Record yourself and listen back for any unclear pronunciations.');
    }

    // Strategic pause guidance
    if (parseFloat(pauseFrequency) > 7) {
        feedback.push('🔄 Fluency strategy: Practice "chunking" - group 5-7 words together before pausing. Use phrases like "what I mean is..." to buy thinking time naturally.');
    } else if (parseFloat(pauseFrequency) > 5) {
        feedback.push('🎪 Smooth transitions: Work on connecting ideas without hesitation. Practice using transitional phrases and prepare 2-3 examples for common topics beforehand.');
    } else if (parseFloat(pauseFrequency) < 1) {
        feedback.push('🎭 Natural rhythm: Consider adding strategic pauses for emphasis and to organize your thoughts. Pause briefly after main points and before examples.');
    }

    // Log aggregated results
    logger.info(`Aggregated Speech Analysis:
    - WPM: ${wpm} (Band 5: ≥90, Band 5.5: ≥110, Band 6: ≥120, Band 6+: ≥140)
    - Pause Frequency: ${pauseFrequency} pauses per 30s (Band 5: ≤5, Band 5.5: ≤4, Band 6: ≤3, Band 6+: ≤2)
    - Pause Count: ${pauseCount}
    - Pause Duration: ${pauseDuration}s
    - Fluency Band: ${fluencyBand}
    - Clarity Score: ${clarityScore}
    - Feedback: ${feedback.join('\n')}
    `);

    // Return aggregated results for feedback screen
    return {
        wpm,
        pauseFrequency,
        pauseCount,
        pauseDuration,
        fluencyBand,
        clarityScore,
        feedback,
        totalWords,
        individualResults: results,
    };
}