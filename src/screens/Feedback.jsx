import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Icon } from 'react-native-paper';

// Feedback expects an 'analysis' prop from analyzeSpeech()
const Feedback = ({ route, navigation }) => {
    const analysis = route?.params?.analysis;

    if (!analysis) {
        return (
            <View style={styles.container}>
                <View style={styles.headerSection}>
                    <Text style={styles.headerTitle}>📊 Speech Analysis</Text>
                    <Text style={styles.headerSubtitle}>No feedback available</Text>
                </View>
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
            {/* Header Section */}
            <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>� Performance Report</Text>
                <Text style={styles.headerSubtitle}>Your speaking analysis & feedback</Text>
            </View>

            {/* Main Content */}
            <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
                {/* Performance Metrics */}
                <Card style={styles.metricsCard}>
                    <Card.Content style={styles.metricsCardContent}>
                        <Text style={styles.sectionTitle}>📈 Speaking Metrics</Text>

                        <View style={styles.metricsGrid}>
                            <View style={styles.metricItem}>
                                <View style={[styles.metricIconContainer, { backgroundColor: '#e3f2fd' }]}>
                                    <Icon source="speedometer" size={24} color="#2196f3" />
                                </View>
                                <Text style={styles.metricLabel}>Words/Min</Text>
                                <Text style={styles.metricValue}>{analysis.wpm}</Text>
                            </View>

                            <View style={styles.metricItem}>
                                <View style={[styles.metricIconContainer, { backgroundColor: '#fff3e0' }]}>
                                    <Icon source="pause" size={24} color="#ff9800" />
                                </View>
                                <Text style={styles.metricLabel}>Pauses</Text>
                                <Text style={styles.metricValue}>{analysis.pauseCount}</Text>
                            </View>

                            <View style={styles.metricItem}>
                                <View style={[styles.metricIconContainer, { backgroundColor: '#e8f5e8' }]}>
                                    <Icon source="microphone" size={24} color="#4caf50" />
                                </View>
                                <Text style={styles.metricLabel}>Clarity</Text>
                                <Text style={styles.metricValue}>{analysis.clarityScore}</Text>
                            </View>

                            <View style={styles.metricItem}>
                                <View style={[styles.metricIconContainer, { backgroundColor: '#fce4ec' }]}>
                                    <Icon source="trophy" size={24} color="#e91e63" />
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
                                analysis.feedback.map((item, idx) => (
                                    <View key={idx} style={styles.feedbackItemContainer}>
                                        <View style={styles.feedbackBullet}>
                                            <Icon source="check-circle" size={16} color="#4caf50" />
                                        </View>
                                        <Text style={styles.feedbackText}>{item}</Text>
                                    </View>
                                ))
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
        backgroundColor: '#f8f9fa',
    },
    headerSection: {
        backgroundColor: '#5e7055',
        paddingTop: 50,
        paddingBottom: 25,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#c8e6c9',
        textAlign: 'center',
        fontWeight: '500',
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5e7055',
        marginBottom: 20,
        textAlign: 'center',
    },
    metricsCard: {
        borderRadius: 16,
        elevation: 4,
        backgroundColor: '#fff',
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
        backgroundColor: '#f8f9fa',
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
        color: '#666',
        fontWeight: '500',
        marginBottom: 4,
        textAlign: 'center',
    },
    metricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    detailMetrics: {
        backgroundColor: '#f0f4f0',
        borderRadius: 12,
        padding: 15,
    },
    detailMetricRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#5e7055',
    },
    feedbackCard: {
        borderRadius: 16,
        elevation: 4,
        backgroundColor: '#fff',
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
        backgroundColor: '#f0f8f0',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#4caf50',
    },
    feedbackBullet: {
        marginRight: 10,
        marginTop: 2,
    },
    feedbackText: {
        fontSize: 15,
        color: '#333',
        flex: 1,
        lineHeight: 22,
    },
    noFeedbackContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#e3f2fd',
        borderRadius: 8,
    },
    noFeedbackText: {
        fontSize: 15,
        color: '#1976d2',
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
        backgroundColor: '#5e7055',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginBottom: 12,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 8,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#5e7055',
        elevation: 2,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#5e7055',
        marginLeft: 8,
    },
    errorCard: {
        borderRadius: 16,
        elevation: 4,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    errorCardContent: {
        padding: 30,
        alignItems: 'center',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 15,
        marginBottom: 10,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default Feedback;
