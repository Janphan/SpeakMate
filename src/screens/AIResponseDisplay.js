import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AIResponseDisplay = ({ messages }) => {
    const scrollViewRef = useRef(null);

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
        if (scrollViewRef.current && messages && messages.length > 0) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    if (!messages || messages.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.empty}>No conversation yet. Tap the microphone to start!</Text>
            </View>
        );
    }

    return (
        <ScrollView
            ref={scrollViewRef}
            style={styles.scrollContainer}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={false}
        >
            {messages.map((msg, idx) => (
                <View key={idx} style={styles.messageWrapper}>
                    <View style={[
                        styles.messageBubble,
                        msg.role === 'user' ? styles.userBubble : styles.aiBubble
                    ]}>
                        <Text style={styles.roleLabel}>
                            {msg.role === 'user' ? '🤩 You' : '🤖 AI Assistant'}
                        </Text>
                        <Text style={[
                            styles.messageText,
                            msg.role === 'user' ? styles.userText : styles.aiText
                        ]}>
                            {msg.content}
                        </Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        paddingBottom: 100, // Extra space to prevent content being hidden behind fixed elements
    },
    messageWrapper: {
        marginBottom: 15,
    },
    messageBubble: {
        padding: 15,
        borderRadius: 12,
        maxWidth: '90%',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    userBubble: {
        backgroundColor: '#e3f2fd',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        backgroundColor: '#f1f8e9',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    roleLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    userText: {
        color: '#1565c0',
    },
    aiText: {
        color: '#2e7d32',
    },
    empty: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default AIResponseDisplay;
