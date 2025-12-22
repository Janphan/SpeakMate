// Configuration object for speech analysis thresholds
export const SPEECH_ANALYSIS_CONFIG = {
    // Minimum duration (seconds) for reliable analysis
    MIN_DURATION: 5,
    
    // WPM thresholds for different IELTS bands
    WPM_THRESHOLDS: {
        'Band 6+': { minWpm: 140, maxPauses: 2 },
        'Band 6': { minWpm: 120, maxPauses: 3 },
        'Band 5.5': { minWpm: 110, maxPauses: 4 },
        'Band 5': { minWpm: 90, maxPauses: 5 }
    },
    
    // Pause analysis settings
    PAUSE_CONFIG: {
        silentPauseThreshold: 0.5, // seconds
        fillerWords: ['um', 'uh', 'ah', 'like', 'you know', 'sort of', 'kind of', 'actually', 'basically']
    },
    
    // Feedback thresholds
    FEEDBACK_THRESHOLDS: {
        tooSlow: 70,
        slowButImproving: 90,
        tooFast: 150,
        fastButUnclear: 140,
        tooManyPauses: 7,
        slightlyTooManyPauses: 5,
        goodSpeed: 120
    },
    
    // Pronunciation clarity thresholds
    CLARITY_THRESHOLDS: {
        high: -0.3,
        moderate: -0.7
    }
};