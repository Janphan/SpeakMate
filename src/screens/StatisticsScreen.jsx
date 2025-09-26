import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Icon } from 'react-native-paper';
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
                <View style={styles.loadingContent}>
                    <Icon source="chart-line" size={60} color="#5e7055" />
                    <ActivityIndicator size="large" color="#5e7055" style={styles.loader} />
                    <Text style={styles.loadingText}>Loading your statistics...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerSection}>
                <View style={styles.headerContent}>
                    <Icon source="chart-line" size={40} color="#5e7055" />
                    <Text style={styles.title}>Your Progress</Text>
                    <Text style={styles.subtitle}>Track your speaking improvement journey</Text>
                </View>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Offline Status */}
                {isOffline && (
                    <Card style={styles.offlineCard}>
                        <Card.Content style={styles.offlineContent}>
                            <Icon source="wifi-off" size={24} color="#d4ac0d" />
                            <View style={styles.offlineTextContainer}>
                                <Text style={styles.offlineText}>Offline Mode</Text>
                                <Text style={styles.offlineSubtext}>Showing cached data</Text>
                                {lastUpdated && (
                                    <Text style={styles.lastUpdatedText}>
                                        Last updated: {formatLastUpdated()}
                                    </Text>
                                )}
                            </View>
                        </Card.Content>
                    </Card>
                )}

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {/* Time Tracking Card */}
                    <Card style={styles.statCard}>
                        <Card.Content style={styles.statContent}>
                            <View style={styles.statHeader}>
                                <View style={styles.statIconContainer}>
                                    <Icon source="clock" size={24} color="#5e7055" />
                                </View>
                                <Text style={styles.statCardTitle}>Time Tracking</Text>
                            </View>
                            <View style={styles.statItems}>
                                <View style={styles.statRow}>
                                    <Text style={styles.statLabel}>Today's Practice</Text>
                                    <Text style={styles.statValue}>{formatTime(statistics.sessionTimeToday)}</Text>
                                </View>
                                <View style={styles.statRow}>
                                    <Text style={styles.statLabel}>Last 7 Days</Text>
                                    <Text style={styles.statValue}>{formatTime(statistics.sessionTime7Days)}</Text>
                                </View>
                                <View style={styles.statRow}>
                                    <Text style={styles.statLabel}>Average Session</Text>
                                    <Text style={styles.statValue}>{formatTime(statistics.averageSessionTime)}</Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* Practice Overview Card */}
                    <Card style={styles.statCard}>
                        <Card.Content style={styles.statContent}>
                            <View style={styles.statHeader}>
                                <View style={styles.statIconContainer}>
                                    <Icon source="target" size={24} color="#5e7055" />
                                </View>
                                <Text style={styles.statCardTitle}>Practice Overview</Text>
                            </View>
                            <View style={styles.statItems}>
                                <View style={styles.statRow}>
                                    <Text style={styles.statLabel}>Total Sessions</Text>
                                    <Text style={styles.statValue}>{statistics.totalSessions}</Text>
                                </View>
                                <View style={styles.statRow}>
                                    <Text style={styles.statLabel}>Current Streak</Text>
                                    <View style={styles.streakContainer}>
                                        <Text style={styles.statValue}>{statistics.streakDays} days</Text>
                                        <Icon source="fire" size={16} color="#ff6b6b" />
                                    </View>
                                </View>
                                <View style={styles.statRow}>
                                    <Text style={styles.statLabel}>Favorite Topic</Text>
                                    <Text style={styles.statValue} numberOfLines={1}>
                                        {statistics.mostPracticedTopic}
                                    </Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* Performance Card */}
                    <Card style={styles.statCard}>
                        <Card.Content style={styles.statContent}>
                            <View style={styles.statHeader}>
                                <View style={styles.statIconContainer}>
                                    <Icon source="trending-up" size={24} color="#5e7055" />
                                </View>
                                <Text style={styles.statCardTitle}>Performance</Text>
                            </View>
                            <View style={styles.statItems}>
                                <View style={styles.statRow}>
                                    <Text style={styles.statLabel}>Average IELTS Band</Text>
                                    <Text style={styles.statValue}>{statistics.averageIELTSBand}</Text>
                                </View>
                                <View style={styles.statRow}>
                                    <Text style={styles.statLabel}>Total Words Spoken</Text>
                                    <Text style={styles.statValue}>
                                        {statistics.totalWordsSpoken.toLocaleString()}
                                    </Text>
                                </View>
                                <View style={styles.statRow}>
                                    <Text style={styles.statLabel}>Progress Trend</Text>
                                    <View style={styles.trendContainer}>
                                        <Text style={styles.statValue}>{statistics.improvementTrend}</Text>
                                        <Text style={styles.trendEmoji}>
                                            {getTrendEmoji(statistics.improvementTrend)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headerSection: {
        backgroundColor: '#5e7055',
        paddingTop: 20,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    headerContent: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingContent: {
        alignItems: 'center',
    },
    loader: {
        marginTop: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    offlineCard: {
        backgroundColor: '#fff9c4',
        marginBottom: 20,
        borderRadius: 16,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#d4ac0d',
    },
    offlineContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    offlineTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    offlineText: {
        fontSize: 16,
        color: '#d4ac0d',
        fontWeight: '600',
    },
    offlineSubtext: {
        fontSize: 14,
        color: '#d4ac0d',
        opacity: 0.8,
    },
    lastUpdatedText: {
        fontSize: 12,
        color: '#d4ac0d',
        marginTop: 2,
    },
    statsGrid: {
        paddingBottom: 100,
    },
    statCard: {
        marginBottom: 16,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: '#fff',
    },
    statContent: {
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f4f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statCardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    statItems: {
        gap: 12,
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
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    statValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5e7055',
        textAlign: 'right',
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    trendEmoji: {
        fontSize: 16,
    },
});