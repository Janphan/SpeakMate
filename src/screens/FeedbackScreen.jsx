import React from 'react';
import { View, Text, Button } from 'react-native';

export default function FeedbackScreen({ route, navigation }) {
    const { feedbackData, topic, level } = route.params || {};

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text>Feedback for {topic?.title} (Level {level})</Text>
            {(!feedbackData || feedbackData.length === 0) && (
                <Text>Feedback processing failed. Try again later.</Text>
            )}
            {feedbackData?.map((session, index) => (
                <View key={index} style={{ marginVertical: 5 }}>
                    <Text>Response {index + 1}: {session.header}</Text>
                    <Text>Transcript: {session.transcript || 'N/A'}</Text>
                    <Text>Speech Rate: {session.speech_rate?.toFixed(2)} wpm</Text>
                    <Text>Pauses: {session.pause_count}</Text>
                    <Text>Clarity: {(session.confidence_score * 100)?.toFixed(2)}%</Text>
                    {session.feedback?.map((tip, i) => (
                        <Text key={i}>- {tip}</Text>
                    ))}
                </View>
            ))}
            <Button title="Back to Home" onPress={() => navigation.navigate("HomeScreen")} />
        </View>
    );
}