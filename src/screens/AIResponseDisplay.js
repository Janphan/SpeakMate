import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AIResponseDisplay = ({ transcription, aiResponse }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.userText}>📝 User: {transcription}</Text>
            <Text style={styles.aiText}>🤖 AI: {aiResponse}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 20, alignItems: 'center' },
    userText: { fontSize: 18, fontWeight: '500', color: 'blue' },
    aiText: { fontSize: 18, fontWeight: '500', color: 'green' },
});

export default AIResponseDisplay;
