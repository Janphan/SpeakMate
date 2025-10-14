/**
 * Centralized logging utility for SpeakMate
 * Replaces console.log statements with structured logging
 */

class Logger {
    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
        this.logLevel = this.isDevelopment ? 'debug' : 'error';
    }

    // Log levels: debug < info < warn < error
    shouldLog(level) {
        const levels = { debug: 0, info: 1, warn: 2, error: 3 };
        return levels[level] >= levels[this.logLevel];
    }

    formatMessage(level, message, context = {}) {
        const timestamp = new Date().toISOString();
        const contextStr = Object.keys(context).length > 0 ? JSON.stringify(context) : '';
        return `[${timestamp}] ${level.toUpperCase()}: ${message} ${contextStr}`;
    }

    debug(message, context = {}) {
        if (this.shouldLog('debug')) {
            logger.debug(this.formatMessage('debug', message, context));
        }
    }

    info(message, context = {}) {
        if (this.shouldLog('info')) {
            console.info(this.formatMessage('info', message, context));
        }
    }

    warn(message, context = {}) {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', message, context));
        }
    }

    error(message, context = {}) {
        if (this.shouldLog('error')) {
            console.error(this.formatMessage('error', message, context));
        }
    }

    // API-specific logging
    api(method, url, status, duration) {
        this.info('API Call', {
            method,
            url,
            status,
            duration: `${duration}ms`
        });
    }

    // User action logging
    userAction(action, screen, data = {}) {
        this.info('User Action', {
            action,
            screen,
            ...data
        });
    }

    // Speech analysis logging
    speechAnalysis(result) {
        this.debug('Speech Analysis Result', {
            wordsSpoken: result.totalWords,
            fluencyBand: result.fluencyBand,
            duration: result.duration
        });
    }
}

// Export singleton instance
export const logger = new Logger();
export default logger;