import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../api/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';

// Convert fluency band string to numeric value for averaging
const fluencyBandToNumber = (bandString) => {
    if (!bandString || typeof bandString !== 'string') return 0;

    const band = bandString.toLowerCase();
    if (band.includes('band 6')) return 6.0;
    if (band.includes('band 5.5')) return 5.5;
    if (band.includes('band 5') && !band.includes('5.5')) return 5.0;
    if (band.includes('below')) return 4.5;

    // Try to extract numeric value if format is different
    const numericMatch = band.match(/(\d+\.?\d*)/);
    if (numericMatch) {
        const value = parseFloat(numericMatch[1]);
        return value >= 4 && value <= 9 ? value : 0;
    }

    return 0; // Default for unrecognized formats
};

export const useStatistics = () => {
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [statistics, setStatistics] = useState({
        totalSessions: 0,
        sessionTimeToday: 0,
        sessionTime7Days: 0,
        averageSessionTime: 0,
        streakDays: 0,
        mostPracticedTopic: '',
        averageIELTSBand: 0,
        totalWordsSpoken: 0,
        improvementTrend: 'stable'
    });

    const calculateStatistics = (conversations) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Initialize statistics
        const totalSessions = conversations.length;
        let sessionTimeToday = 0;
        let sessionTime7Days = 0;
        let totalSessionTime = 0;
        const topicCounts = new Map();
        let totalIELTSScore = 0;
        let totalWordsSpoken = 0;
        let validScores = 0;

        // Process each conversation
        conversations.forEach(conversation => {
            const sessionDate = conversation.timestamp.toDate();

            // Calculate estimated session time based on messages and analysis
            const estimatedSessionTime = estimateSessionTime(conversation);
            totalSessionTime += estimatedSessionTime;

            // Today's session time
            if (sessionDate >= today) {
                sessionTimeToday += estimatedSessionTime;
            }

            // 7-day session time
            if (sessionDate >= sevenDaysAgo) {
                sessionTime7Days += estimatedSessionTime;
            }

            // Topic tracking
            const topic = conversation.topic || 'Unknown';
            if (typeof topic === 'string' && topic.length > 0) {
                const currentCount = topicCounts.get(topic) || 0;
                topicCounts.set(topic, currentCount + 1);
            }

            // IELTS band tracking (from speech analysis fluency band)
            if (conversation.analysisResult?.fluencyBand) {
                const bandValue = fluencyBandToNumber(conversation.analysisResult.fluencyBand);
                if (bandValue > 0) {
                    totalIELTSScore += bandValue;
                    validScores++;
                }
            }

            // Words spoken tracking
            if (conversation.analysisResult?.totalWords) {
                totalWordsSpoken += conversation.analysisResult.totalWords;
            }
        });

        // Calculate derived statistics
        const averageSessionTime = totalSessions > 0 ? totalSessionTime / totalSessions : 0;
        const mostPracticedTopic = Array.from(topicCounts.keys()).reduce((a, b) => {
            const countA = topicCounts.get(a) || 0;
            const countB = topicCounts.get(b) || 0;
            return countA > countB ? a : b;
        }, 'None');
        const averageIELTSBand = validScores > 0 ? totalIELTSScore / validScores : 0;
        const streakDays = calculateStreakDays(conversations);
        const improvementTrend = calculateImprovementTrend(conversations); return {
            totalSessions,
            sessionTimeToday: Math.round(sessionTimeToday),
            sessionTime7Days: Math.round(sessionTime7Days),
            averageSessionTime: Math.round(averageSessionTime),
            streakDays,
            mostPracticedTopic,
            averageIELTSBand: Math.round(averageIELTSBand * 10) / 10,
            totalWordsSpoken,
            improvementTrend
        };
    };

    const estimateSessionTime = (conversation) => {
        if (conversation.sessionDuration) {
            return conversation.sessionDuration;
        }

        const messageCount = conversation.messages?.length || 0;
        const baseTimePerMessage = 45;

        let estimatedTime = messageCount * baseTimePerMessage;

        if (conversation.analysisResult?.totalWords) {
            const wordsPerSecond = 2.5; // Average speaking rate
            const speechTime = conversation.analysisResult.totalWords / wordsPerSecond;
            estimatedTime = Math.max(estimatedTime, speechTime * 2); // Account for AI responses
        }

        return estimatedTime; // Return in seconds
    };

    const calculateStreakDays = (conversations) => {
        if (conversations.length === 0) return 0;

        const dates = conversations.map(c => {
            const date = c.timestamp.toDate();
            return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
        });

        const uniqueDates = [...new Set(dates)].sort((a, b) => b - a);

        let streak = 0;
        const today = new Date();
        const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

        for (let i = 0; i < uniqueDates.length; i++) {
            const expectedDate = todayTime - (i * 24 * 60 * 60 * 1000);
            const currentDate = uniqueDates[i];

            if (currentDate === expectedDate) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }; const calculateImprovementTrend = (conversations) => {
        if (conversations.length < 2) return 'stable';

        const recentConversations = conversations.slice(0, 5);
        const olderConversations = conversations.slice(-5);

        const recentAvgBand = recentConversations.reduce((sum, c) => {
            const bandValue = fluencyBandToNumber(c.analysisResult?.fluencyBand);
            return sum + (bandValue || 5);
        }, 0) / recentConversations.length;

        const olderAvgBand = olderConversations.reduce((sum, c) => {
            const bandValue = fluencyBandToNumber(c.analysisResult?.fluencyBand);
            return sum + (bandValue || 5);
        }, 0) / olderConversations.length;

        if (recentAvgBand > olderAvgBand + 0.2) return 'improving';
        if (recentAvgBand < olderAvgBand - 0.2) return 'declining';
        return 'stable';
    };

    const cacheStatistics = async (stats, conversations) => {
        try {
            const cacheData = {
                statistics: stats,
                lastUpdated: new Date().toISOString(),
                conversationsCount: conversations.length,
                cachedAt: new Date().toISOString()
            };
            await AsyncStorage.setItem('statistics_cache', JSON.stringify(cacheData));
        } catch (error) {
            logger.error('Error caching statistics:', error);
        }
    };

    const loadCachedStatistics = async () => {
        try {
            const cachedData = await AsyncStorage.getItem('statistics_cache');
            if (cachedData) {
                const parsed = JSON.parse(cachedData);
                setStatistics(parsed.statistics);
                setLastUpdated(new Date(parsed.lastUpdated));
                logger.info('Loaded cached statistics');
            } else {
                // No cached data available
                setStatistics({
                    totalSessions: 0,
                    sessionTimeToday: 0,
                    sessionTime7Days: 0,
                    averageSessionTime: 0,
                    streakDays: 0,
                    mostPracticedTopic: 'No data available',
                    averageIELTSBand: 0,
                    totalWordsSpoken: 0,
                    improvementTrend: 'stable'
                });
            }
        } catch (error) {
            logger.error('Error loading cached statistics:', error);
        }
    };

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            setIsOffline(false);
            const userId = auth.currentUser?.uid;

            if (!userId) {
                // If no user, try to load cached data
                await loadCachedStatistics();
                return;
            }

            // Try to fetch from Firebase
            try {
                // Get all conversations for the user (simplified query to avoid index requirement)
                const conversationsRef = collection(db, 'conversations');
                const q = query(
                    conversationsRef,
                    where('userId', '==', userId)
                );

                const querySnapshot = await getDocs(q);
                const conversations = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Sort by timestamp in JavaScript instead of Firestore
                conversations.sort((a, b) => {
                    const aTime = a.timestamp?.toDate?.() || new Date(0);
                    const bTime = b.timestamp?.toDate?.() || new Date(0);
                    return bTime - aTime; // Descending order (newest first)
                });

                const stats = calculateStatistics(conversations);
                setStatistics(stats);
                setLastUpdated(new Date());

                // Cache the statistics for offline use
                await cacheStatistics(stats, conversations);

            } catch (firebaseError) {
                logger.error('Firebase unavailable, loading cached data', {
                    error: firebaseError.message
                });
                setIsOffline(true);
                await loadCachedStatistics();
            }
        } catch (error) {
            logger.error('Error in fetchStatistics', {
                error: error.message
            });
            setIsOffline(true);
            await loadCachedStatistics();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    return {
        statistics,
        loading,
        isOffline,
        lastUpdated,
        fetchStatistics,
        refreshStatistics: fetchStatistics
    };
};