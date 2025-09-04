// speechAnalysis.js

export function analyzeSpeech(responseData) {
    const segments = responseData.segments || [];
    const words = responseData.words || [];
    if (segments.length === 0) {
        console.warn('No segments provided for analysis.');
        return {
            wpm: 0,
            pauseCount: 0,
            pauseDuration: 0,
            fluencyBand: 'N/A',
            feedback: ['No speech data available for analysis.'],
        };
    }

    // Calculate WPM
    let wpm = 0;
    let wordCount = 0;
    let totalDuration = responseData.duration || (segments.length > 0 ? segments[segments.length - 1].end : 0);

    if (words.length > 0) {
        // Use word-level timestamps if available
        wordCount = words.length;
        wpm = totalDuration > 0 ? (wordCount / (totalDuration / 60)) : 0;
    } else {
        // Fallback: Estimate WPM from segment text
        wordCount = segments.reduce((count, segment) => {
            return count + segment.text.trim().split(/\s+/).length;
        }, 0);
        wpm = totalDuration > 0 ? (wordCount / (totalDuration / 60)) : 0;
    }

    // Calculate pause frequency (>0.5s gaps)
    let pauseCount = 0;
    let pauseDuration = 0;
    if (words.length > 0) {
        // Use word-level timestamps for precise pauses
        for (let i = 1; i < words.length; i++) {
            const gap = words[i].start - words[i - 1].end;
            if (gap > 0.5) {
                pauseCount++;
                pauseDuration += gap;
            }
        }
    } else if (segments.length > 1) {
        // Use segment-level timestamps
        for (let i = 1; i < segments.length; i++) {
            const gap = segments[i].start - segments[i - 1].end;
            if (gap > 0.5) {
                pauseCount++;
                pauseDuration += gap;
            }
        }
    }

    // Normalize pause frequency to pauses per 30 seconds
    const pauseFrequency = totalDuration > 0 ? (pauseCount / (totalDuration / 30)) : 0;

    // Determine fluency band
    let fluencyBand = 'Below Band 5';
    if (wpm >= 120 && wpm <= 140 && pauseFrequency >= 1 && pauseFrequency <= 3) {
        fluencyBand = 'Band 6';
    } else if (wpm >= 110 && wpm <= 130 && pauseFrequency >= 2 && pauseFrequency <= 4) {
        fluencyBand = 'Band 5.5';
    } else if (wpm >= 90 && wpm < 110 && pauseFrequency >= 3 && pauseFrequency <= 5) {
        fluencyBand = 'Band 5';
    }

    // Pronunciation clarity (using avg_logprob from first segment)
    const segment = segments[0] || {};
    const clarityScore =
        segment.avg_logprob > -0.3 ? 'High' :
            segment.avg_logprob > -0.7 ? 'Moderate' : 'Low';

    // Feedback
    const feedback = [];
    if (wpm < 90) {
        feedback.push('- Speaking pace is too slow. Aim for 90–110 WPM for better fluency.');
    } else if (wpm > 140) {
        feedback.push('- You are doing great! Your level can increase to new band soon');
    }
    if (pauseFrequency > 5) {
        feedback.push('- Too many pauses. Aim for 1–3 pauses per 30 seconds (Band 6).');
    } else if (pauseFrequency < 1 && wpm < 100) {
        feedback.push('- Too few pauses may indicate rushed speech. Allow natural breaks.');
    }
    if (segment.avg_logprob < -0.7) {
        feedback.push('- Pronunciation may be unclear. Practice clear enunciation.');
    }
    if (segment.no_speech_prob > 0.1) {
        feedback.push('- Background noise detected. Record in a quiet environment.');
    }

    // Log results
    console.log(`Speech Analysis:
    - Words Per Minute: ${wpm.toFixed(2)} (Band 5: 90–110, Band 5.5: 110–130, Band 6: 140–150)
    - Pause Frequency: ${pauseFrequency.toFixed(2)} pauses per 30s (Band 5: 3–5, Band 5.5: 2–4, Band 6: 1–2)
    - Fluency Band: ${fluencyBand}
    - Pronunciation Clarity: ${clarityScore} (avg_logprob: ${segment.avg_logprob || 'N/A'})
    - Total Duration: ${totalDuration.toFixed(2)}s
    `);
    console.log('Feedback:', feedback.join('\n'));

    return {
        wpm: wpm.toFixed(2),
        pauseCount,
        pauseFrequency: pauseFrequency.toFixed(2),
        pauseDuration: pauseDuration.toFixed(2),
        fluencyBand,
        clarityScore,
        feedback,
    };
}