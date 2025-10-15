import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import HeaderSection from '../components/HeaderSection';
import { colors } from '../theme';

// Feedback expects an 'analysis' prop from analyzeSpeech()
const Feedback = ({ route, navigation }) => {
    const analysis = route?.params?.analysis;

    if (!analysis) {
        return (
            <View style={styles.container}>
                <HeaderSection
                    icon="chart-line"
                    title="📊 Speech Analysis"
                    subtitle="No feedback available"
                />
                <View style={styles.mainContent}>
                    <Card style={styles.errorCard}>
                        <Card.Content style={styles.errorCardContent}>
                            <Icon source="alert-circle" size={48} color="#ff9800" />
                            <Text style={styles.errorTitle}>No Data Available</Text>
                            <Text style={styles.errorText}>
                                We couldn't generate feedback for this session. Please try again.
                            </Text>
                        </Card.Content>
                    </Card>
                    <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('HomeScreen')}>
                        <Icon source="home" size={20} color="#fff" />
                        <Text style={styles.primaryButtonText}>Back to Home</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <HeaderSection
                icon="chart-line"
                title="🎯 Performance Report"
                subtitle="Your speaking analysis & feedback"
            />

            {/* Main Content */}
            <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
                {/* Performance Metrics */}
                <Card style={styles.metricsCard}>
                    <Card.Content style={styles.metricsCardContent}>
                        <Text style={styles.sectionTitle}>📈 Speaking Metrics</Text>

                        <View style={styles.metricsGrid}>
                            <View style={styles.metricItem}>
                                <View style={[styles.metricIconContainer, { backgroundColor: colors.status.info + '20' }]}>
                                    <Icon source="speedometer" size={24} color={colors.status.info} />
                                </View>
                                <Text style={styles.metricLabel}>Words/Min</Text>
                                <Text style={styles.metricValue}>{analysis.wpm}</Text>
                            </View>

                            <View style={styles.metricItem}>
                                <View style={[styles.metricIconContainer, { backgroundColor: colors.status.warning + '20' }]}>
                                    <Icon source="pause" size={24} color={colors.status.warning} />
                                </View>
                                <Text style={styles.metricLabel}>Pauses</Text>
                                <Text style={styles.metricValue}>{analysis.pauseCount}</Text>
                            </View>

                            <View style={styles.metricItem}>
                                <View style={[styles.metricIconContainer, { backgroundColor: colors.status.success + '20' }]}>
                                    <Icon source="microphone" size={24} color={colors.status.success} />
                                </View>
                                <Text style={styles.metricLabel}>Clarity</Text>
                                <Text style={styles.metricValue}>{analysis.clarityScore}</Text>
                            </View>

                            <View style={styles.metricItem}>
                                <View style={[styles.metricIconContainer, { backgroundColor: colors.status.error + '20' }]}>
                                    <Icon source="trophy" size={24} color={colors.status.error} />
                                </View>
                                <Text style={styles.metricLabel}>Band</Text>
                                <Text style={styles.metricValue}>{analysis.fluencyBand}</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                {/* Feedback Section */}
                <Card style={styles.feedbackCard}>
                    <Card.Content style={styles.feedbackCardContent}>
                        <Text style={styles.sectionTitle}>� Personalized Feedback</Text>
                        <View style={styles.feedbackList}>
                            {analysis.feedback && analysis.feedback.length > 0 ? (
                                analysis.feedback.map((item) => {
                                    const itemHash = item.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
                                    return (
                                        <View key={`analysis-feedback-${itemHash}-${item.length}`} style={styles.feedbackItemContainer}>
                                            <View style={styles.feedbackBullet}>
                                                <Icon source="check-circle" size={16} color="#4caf50" />
                                            </View>
                                            <Text style={styles.feedbackText}>{item}</Text>
                                        </View>
                                    );
                                })
                            ) : (
                                <View style={styles.noFeedbackContainer}>
                                    <Icon source="information" size={24} color="#2196f3" />
                                    <Text style={styles.noFeedbackText}>Great job! Keep practicing to improve further.</Text>
                                </View>
                            )}
                        </View>
                    </Card.Content>
                </Card>

                {/* Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('HomeScreen')}>
                        <Icon source="home" size={20} color="#fff" />
                        <Text style={styles.primaryButtonText}>Back to Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('StatisticsScreen')}
                    >
                        <Icon source="chart-line" size={20} color="#5e7055" />
                        <Text style={styles.secondaryButtonText}>View Progress</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 20,
        textAlign: 'center',
    },
    metricsCard: {
        borderRadius: 16,
        elevation: 4,
        backgroundColor: colors.background.secondary,
        marginBottom: 20,
    },
    metricsCardContent: {
        padding: 20,
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    metricItem: {
        width: '48%',
        alignItems: 'center',
        marginBottom: 15,
        padding: 15,
        backgroundColor: colors.background.primary,
        borderRadius: 12,
    },
    metricIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    metricLabel: {
        fontSize: 14,
        color: colors.text.secondary,
        fontWeight: '500',
        marginBottom: 4,
        textAlign: 'center',
    },
    metricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text.primary,
        textAlign: 'center',
    },
    feedbackCard: {
        borderRadius: 16,
        elevation: 4,
        backgroundColor: colors.background.secondary,
        marginBottom: 20,
    },
    feedbackCardContent: {
        padding: 20,
    },
    feedbackList: {
        marginBottom: 10,
    },
    feedbackItemContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        padding: 12,
        backgroundColor: colors.status.success + '20', // Light green background
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: colors.status.success,
    },
    feedbackBullet: {
        marginRight: 10,
        marginTop: 2,
    },
    feedbackText: {
        fontSize: 15,
        color: colors.text.primary,
        flex: 1,
        lineHeight: 22,
    },
    noFeedbackContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: colors.status.info + '20', // Light blue background
        borderRadius: 8,
    },
    noFeedbackText: {
        fontSize: 15,
        color: colors.status.info,
        marginLeft: 10,
        flex: 1,
        fontStyle: 'italic',
    },
    actionButtonsContainer: {
        marginBottom: 20,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        elevation: 4,
        shadowColor: colors.shadow.color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginBottom: 12,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.light,
        marginLeft: 8,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background.secondary,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.primary,
        elevation: 2,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
        marginLeft: 8,
    },
    errorCard: {
        borderRadius: 16,
        elevation: 4,
        backgroundColor: colors.background.secondary,
        marginBottom: 20,
    },
    errorCardContent: {
        padding: 30,
        alignItems: 'center',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginTop: 15,
        marginBottom: 10,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default Feedback;
