import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { PaperProvider, Card, Title, Paragraph, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useStatistics } from '../hooks/useStatistics';

export default function StatisticsScreen() {
    const navigation = useNavigation();
    const {
        statistics,
        loading,
        isOffline,
        lastUpdated,
        refreshStatistics
    } = useStatistics();

    const formatTime = (seconds) => {
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (minutes < 60) {
            return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };

    const getTrendEmoji = (trend) => {
        switch (trend) {
            case 'improving': return '📈';
            case 'declining': return '📉';
            default: return '📊';
        }
    };

    const formatLastUpdated = () => {
        if (!lastUpdated) return '';
        const now = new Date();
        const diffInMinutes = Math.floor((now - lastUpdated) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5e7055" />
                <Text style={styles.loadingText}>Loading statistics...</Text>
            </View>
        );
    }

    return (
        <PaperProvider>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.header}>📊 Your Statistics</Text>

                    {/* Offline/Online Status */}
                    {isOffline && (
                        <Card style={styles.offlineCard}>
                            <Card.Content>
                                <Text style={styles.offlineText}>
                                    📱 Offline Mode - Showing cached data
                                </Text>
                                {lastUpdated && (
                                    <Text style={styles.lastUpdatedText}>
                                        Last updated: {formatLastUpdated()}
                                    </Text>
                                )}
                            </Card.Content>
                        </Card>
                    )}

                    {/* Time Statistics */}
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.cardTitle}>⏱️ Time Tracking</Title>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Today's Practice:</Text>
                                <Text style={styles.statValue}>{formatTime(statistics.sessionTimeToday)}</Text>
                            </View>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Last 7 Days:</Text>
                                <Text style={styles.statValue}>{formatTime(statistics.sessionTime7Days)}</Text>
                            </View>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Average Session:</Text>
                                <Text style={styles.statValue}>{formatTime(statistics.averageSessionTime)}</Text>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* General Statistics */}
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.cardTitle}>🎯 Practice Overview</Title>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Total Sessions:</Text>
                                <Text style={styles.statValue}>{statistics.totalSessions}</Text>
                            </View>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Current Streak:</Text>
                                <Text style={styles.statValue}>{statistics.streakDays} days 🔥</Text>
                            </View>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Favorite Topic:</Text>
                                <Text style={styles.statValue}>{statistics.mostPracticedTopic}</Text>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* Performance Statistics */}
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.cardTitle}>📈 Performance</Title>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Average IELTS Band:</Text>
                                <Text style={styles.statValue}>{statistics.averageIELTSBand}</Text>
                            </View>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Total Words Spoken:</Text>
                                <Text style={styles.statValue}>{statistics.totalWordsSpoken.toLocaleString()}</Text>
                            </View>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>Progress Trend:</Text>
                                <Text style={styles.statValue}>
                                    {getTrendEmoji(statistics.improvementTrend)} {statistics.improvementTrend}
                                </Text>
                            </View>
                        </Card.Content>
                    </Card>
                </ScrollView>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    offlineCard: {
        backgroundColor: '#fff3cd',
        marginBottom: 16,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#856404',
    },
    offlineText: {
        fontSize: 16,
        color: '#856404',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    lastUpdatedText: {
        fontSize: 14,
        color: '#856404',
        textAlign: 'center',
        marginTop: 4,
    },
    scrollContainer: {
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 20,
        color: '#5e7055',
    },
    card: {
        marginBottom: 16,
        elevation: 4,
        backgroundColor: '#fff',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#5e7055',
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    statLabel: {
        fontSize: 16,
        color: '#666',
        flex: 1,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
    },
    motivationCard: {
        backgroundColor: '#e8f5e8',
        elevation: 4,
        marginTop: 10,
    },
    motivationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e7d2e',
        textAlign: 'center',
    },
    motivationText: {
        fontSize: 16,
        color: '#2e7d2e',
        textAlign: 'center',
        lineHeight: 24,
    },
});