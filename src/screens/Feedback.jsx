import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Feedback expects an 'analysis' prop from analyzeSpeech()
const Feedback = ({ route }) => {
    const navigation = useNavigation();
    const analysis = route?.params?.analysis;

    if (!analysis) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>No feedback available.</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.buttonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎤 Speech Feedback</Text>
            <View style={styles.metricsBox}>
                <Text style={styles.metric}><Text style={styles.metricLabel}>Words Per Minute:</Text> <Text style={styles.metricValue}>{analysis.wpm}</Text></Text>
                <Text style={styles.metric}><Text style={styles.metricLabel}>Pause Frequency (per 30s):</Text> <Text style={styles.metricValue}>{analysis.pauseFrequency}</Text></Text>
                <Text style={styles.metric}><Text style={styles.metricLabel}>Total Pauses:</Text> <Text style={styles.metricValue}>{analysis.pauseCount}</Text></Text>
                <Text style={styles.metric}><Text style={styles.metricLabel}>Total Pause Duration:</Text> <Text style={styles.metricValue}>{analysis.pauseDuration}s</Text></Text>
                <Text style={styles.metric}><Text style={styles.metricLabel}>Fluency Band:</Text> <Text style={styles.band}>{analysis.fluencyBand}</Text></Text>
                <Text style={styles.metric}><Text style={styles.metricLabel}>Pronunciation Clarity:</Text> <Text style={styles.clarity}>{analysis.clarityScore}</Text></Text>
            </View>
            <Text style={styles.subtitle}>📝 Feedback:</Text>
            <View style={styles.feedbackBox}>
                {analysis.feedback && analysis.feedback.length > 0 ? (
                    analysis.feedback.map((item, idx) => (
                        <Text key={idx} style={styles.feedbackItem}>• {item}</Text>
                    ))
                ) : (
                    <Text style={styles.feedbackItem}>No specific feedback.</Text>
                )}
            </View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#f7f9fc',
        borderRadius: 12,
        margin: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2a2a2a',
        marginBottom: 16,
        textAlign: 'center',
    },
    metricsBox: {
        backgroundColor: '#e3eaf2',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        width: '100%',
    },
    metric: {
        fontSize: 16,
        marginBottom: 4,
        color: '#333',
    },
    metricLabel: {
        fontWeight: 'bold',
        color: '#3a5ca8',
    },
    metricValue: {
        color: '#1a7f37',
        fontWeight: 'bold',
    },
    band: {
        color: '#e67e22',
        fontWeight: 'bold',
    },
    clarity: {
        color: '#16a085',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 8,
        color: '#2a2a2a',
        alignSelf: 'flex-start',
    },
    feedbackBox: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        width: '100%',
        marginBottom: 20,
    },
    feedbackItem: {
        fontSize: 15,
        marginBottom: 6,
        color: '#444',
    },
    button: {
        backgroundColor: '#3a5ca8',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 24,
        alignItems: 'center',
        marginTop: 12,
        width: '80%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});

export default Feedback;
