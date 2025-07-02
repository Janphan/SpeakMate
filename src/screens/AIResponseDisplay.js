import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AIResponseDisplay = ({ messages }) => {
    if (!messages || messages.length === 0) {
        return <Text style={styles.empty}>No conversation yet.</Text>;
    }

    return (
        <View style={styles.container}>
            {messages.map((msg, idx) => (
                <Text
                    key={idx}
                    style={msg.role === 'user' ? styles.userText : styles.aiText}
                >
                    {msg.role === 'user' ? '📝 User: ' : '🤖 AI: '}
                    {msg.content}
                </Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 20, alignItems: 'center' },
    userText: { fontSize: 18, fontWeight: '500', color: 'blue', marginBottom: 8 },
    aiText: { fontSize: 18, fontWeight: '500', color: 'green', marginBottom: 8 },
    empty: { fontSize: 16, color: '#888', marginTop: 20 },
});

export default AIResponseDisplay;
