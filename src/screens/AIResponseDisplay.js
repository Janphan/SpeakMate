import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import { responsive } from '../utils/responsive';

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
            {messages.map((msg, index) => {
                // Use index + role + first few chars of content for unique key
                const contentPreview = msg.content ? msg.content.substring(0, 20).replace(/\s/g, '') : '';
                return (
                    <View key={`message-${index}-${msg.role}-${contentPreview}`} style={styles.messageWrapper}>
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
                );
            })}
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
        paddingVertical: responsive.padding.medium,
        paddingHorizontal: responsive.padding.medium,
        paddingBottom: responsive.safeBottom, // Extra space for bottom navigation
    },
    messageWrapper: {
        marginBottom: 15,
    },
    messageBubble: {
        padding: 15,
        borderRadius: 12,
        maxWidth: '90%',
        elevation: 2,
        shadowColor: colors.shadow.color,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    userBubble: {
        backgroundColor: colors.status.info + '20', // Light blue background
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        backgroundColor: colors.status.success + '20', // Light green background
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    roleLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.text.secondary,
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    userText: {
        color: colors.status.info,
    },
    aiText: {
        color: colors.status.success,
    },
    empty: {
        fontSize: 16,
        color: colors.text.muted,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default AIResponseDisplay;
