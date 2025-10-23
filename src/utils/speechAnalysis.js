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

            if (wpm > 140 && roundedPause <= 1) {
                fluencyBand = 'Band 6+';
            }
            else if (wpm >= 120 && wpm <= 140 && roundedPause >= 1 && roundedPause <= 2) {
                fluencyBand = 'Band 6';
            }
            else if (wpm >= 110 && wpm <= 130 && roundedPause >= 2 && roundedPause <= 4) {
                fluencyBand = 'Band 5.5';
            }
            else if (wpm >= 90 && wpm <= 110 && roundedPause >= 3 && roundedPause <= 5) {
                fluencyBand = 'Band 5';
            }

            // Pronunciation clarity (using avg_logprob from first segment)
            const segment = segments[0] || {};
            const clarityScore =
                segment.avg_logprob && segment.avg_logprob > -0.3 ? 'High' :
                    segment.avg_logprob && segment.avg_logprob > -0.7 ? 'Moderate' : 'Low';

            // Feedback for individual response
            const feedback = [];
            if (fluencyBand === 'Band 6+') {
                feedback.push('Excellent fluency at Band 6+! Your speech rate is advanced level.');
            } else if (fluencyBand === 'Band 6') {
                feedback.push('Great job! Fluency aligns with Band 6.');
            } else if (fluencyBand === 'Band 5.5') {
                feedback.push('Fluency at Band 5.5. Maintain consistent pacing and natural pauses.');
            } else if (fluencyBand === 'Band 5') {
                feedback.push('Fluency at Band 5. Increase speed slightly and reduce pauses if applicable.');
            } else {
                feedback.push('Fluency below Band 5. Focus on increasing speech rate.');
            }
            if (wpm < 90) {
                feedback.push('Pace too slow. Aim for 90–110 WPM.');
            } else if (wpm > 140) {
                feedback.push('Pace too fast. Slow down for clarity.');
            }
            if (pauseFrequency > 5) {
                feedback.push('Too many pauses. Aim for 1–3 pauses per 30s.');
            } else if (pauseFrequency === 0) {
                feedback.push('No pauses detected. Add natural pauses for coherent speech.');
            } else if (pauseFrequency < 1) {
                feedback.push('Minimal pauses. Ensure pauses are natural for coherence.');
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

    // Prioritize highest band: Check Band 6+ first (future extension for advanced users)
    if (wpm > 140 && roundedPause <= 1) {
        fluencyBand = 'Band 6+';
    }
    else if (wpm >= 120 && wpm <= 140 && roundedPause >= 1 && roundedPause <= 2) {
        fluencyBand = 'Band 6';
    }
    else if (wpm >= 110 && wpm <= 130 && roundedPause >= 2 && roundedPause <= 4) {
        fluencyBand = 'Band 5.5';
    }
    else if (wpm >= 90 && wpm <= 110 && roundedPause >= 3 && roundedPause <= 5) {
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

    // Generate aggregated feedback
    const feedback = [];
    if (fluencyBand === 'Band 6+') {
        feedback.push(`Outstanding average fluency at Band 6+! Your speech rate (${wpm} WPM) and pause frequency (${pauseFrequency} per 30s) exceed Band 6 standards.`);
    } else if (fluencyBand === 'Band 6') {
        feedback.push(`Excellent average fluency! Your speech rate (${wpm} WPM) and pause frequency (${pauseFrequency} per 30s) align with Band 6.`);
    } else if (fluencyBand === 'Band 5.5') {
        feedback.push(`Good average fluency at Band 5.5 (${wpm} WPM, ${pauseFrequency} pauses per 30s). Maintain consistency to reach Band 6.`);
    } else if (fluencyBand === 'Band 5') {
        feedback.push(`Average fluency at Band 5 (${wpm} WPM, ${pauseFrequency} pauses per 30s). Increase speed slightly for improvement.`);
    } else {
        feedback.push(`Average fluency below Band 5 (${wpm} WPM, ${pauseFrequency} pauses per 30s). Adjust speech rate to 90–140 WPM.`);
    }
    if (wpm < 90) {
        feedback.push('Your average pace is too slow. Aim for 90–110 WPM.');
    } else if (wpm > 140) {
        feedback.push('Your average pace is too fast. Slow down for clearer delivery.');
    }
    if (pauseFrequency > 5) {
        feedback.push('Too many pauses on average. Aim for 1–3 pauses per 30s.');
    } else if (parseFloat(pauseFrequency) === 0) {
        feedback.push('No pauses detected on average. Add natural pauses for coherent speech.');
    } else if (pauseFrequency < 1) {
        feedback.push('Minimal pauses on average. Ensure pauses are natural for coherence.');
    }

    // Log aggregated results
    logger.info(`Aggregated Speech Analysis:
    - WPM: ${wpm} (Band 5: 90–110, Band 5.5: 110–130, Band 6: 120–140, Band 6+: >140)
    - Pause Frequency: ${pauseFrequency} pauses per 30s (Band 5: 3–5, Band 5.5: 2–4, Band 6: 1–2, Band 6+: ≤1)
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