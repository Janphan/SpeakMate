import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Alert } from 'react-native';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../api/firebaseConfig';
import { IconButton } from 'react-native-paper';
import AIResponseDisplay from './AIResponseDisplay';

export default function ConversationDetailsScreen({ route, navigation }) {
    const [conversation, setConversation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { conversationId } = route.params || {};

    useEffect(() => {
        const fetchConversation = async () => {
            if (conversationId) {
                try {
                    const docRef = doc(db, 'conversations', conversationId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setConversation(docSnap.data());
                    } else {
                        console.error('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching conversation:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        fetchConversation();
    }, [conversationId]);

    const handleDelete = async () => {
        Alert.alert(
            "Delete Conversation",
            "Are you sure you want to delete this conversation?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'conversations', conversationId));
                            Alert.alert("Deleted", "Conversation deleted successfully.");
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete conversation.");
                        }
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    if (!conversation) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No conversation found.</Text>
            </View>
        );
    }

    const { messages } = conversation; // Destructure messages from conversation

    return (
        <View style={styles.outerContainer}>
            {/* Fixed Header and Back Button */}
            <View style={styles.headerRow}>
                <IconButton
                    icon="arrow-left"
                    size={24}
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                />
                <Text style={styles.header}>Conversation Details</Text>
            </View>
            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.message}>{conversation.header}</Text>
                {messages && messages.length > 0 ? (
                    <View style={styles.conversationCard}>
                        <Text style={styles.conversationTitle}>💬 Conversation</Text>
                        {messages.map((msg, idx) => (
                            <View key={idx} style={styles.conversationItemRow}>
                                <Text style={[styles.conversationRole, msg.role === 'ai' ? styles.aiRole : styles.userRole]}>
                                    {msg.role === 'ai' ? 'AI:' : 'You:'}
                                </Text>
                                <Text style={styles.conversationText}>{msg.content}</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text style={styles.content}>No messages found.</Text>
                )}
                <View style={styles.feedbackCard}>
                    <Text style={styles.feedbackTitle}>📝 Feedback</Text>
                    {Array.isArray(conversation.feedback) ? (
                        conversation.feedback.length > 0 ? (
                            conversation.feedback.map((item, idx) => (
                                <View key={idx} style={styles.feedbackItemRow}>
                                    <Text style={styles.feedbackBullet}>•</Text>
                                    <Text style={styles.feedbackText}>{item}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.feedbackText}>No feedback available.</Text>
                        )
                    ) : (
                        <Text style={styles.feedbackText}>{conversation.feedback || 'No feedback available.'}</Text>
                    )}
                </View>
                <View style={styles.card}>
                    <Text style={styles.label}>Timestamp:</Text>
                    <Text style={styles.content}>
                        {new Date(conversation.timestamp.toDate()).toLocaleString()}
                    </Text>
                </View>
                <IconButton
                    icon="delete"
                    size={24}
                    onPress={handleDelete}
                    style={styles.deleteIcon}
                >
                    Delete Conversation
                </IconButton>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        zIndex: 10,
        elevation: 2,
    },
    backButton: {
        marginRight: 10,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007bff',
        flex: 1,
    },
    scrollContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 0,
    },
    container: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    content: {
        fontSize: 16,
        color: '#555',
        lineHeight: 22,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
    deleteIcon: {
        backgroundColor: '#ffeaea',
        borderRadius: 20,
        marginTop: 20,
        alignSelf: 'center',
    },
    message: {
        fontSize: 16,
        color: '#222',
        marginBottom: 10,
        textAlign: 'center',
    },
    conversationCard: {
        backgroundColor: '#f7faff',
        borderRadius: 10,
        padding: 18,
        marginBottom: 18,
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 3,
        elevation: 2,
        width: '95%',
        alignSelf: 'center',
    },
    conversationTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 10,
        textAlign: 'left',
    },
    conversationItemRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    conversationRole: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    aiRole: {
        color: '#1a7f37',
    },
    userRole: {
        color: '#3a5ca8',
    },
    conversationText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
        lineHeight: 22,
    },
    feedbackCard: {
        backgroundColor: '#eaf3fa',
        borderRadius: 10,
        padding: 18,
        marginBottom: 18,
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
        width: '95%',
        alignSelf: 'center',
    },
    feedbackTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 10,
        textAlign: 'left',
    },
    feedbackItemRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    feedbackBullet: {
        fontSize: 18,
        color: '#007bff',
        marginRight: 6,
        marginTop: 1,
    },
    feedbackText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
        lineHeight: 22,
    },
});