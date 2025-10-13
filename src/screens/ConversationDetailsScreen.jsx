import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../api/firebaseConfig';
import { Card, Icon } from 'react-native-paper';
import { logger } from '../utils/logger';

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
                        logger.error('Document not found', { conversationId });
                    }
                } catch (error) {
                    logger.error('Error fetching conversation', { error: error.message, conversationId, stack: error.stack });
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
            <View style={styles.loadingContainer}>
                <View style={styles.loadingContent}>
                    <Icon source="message-processing" size={60} color="#5e7055" />
                    <ActivityIndicator size="large" color="#5e7055" style={styles.loader} />
                    <Text style={styles.loadingText}>Loading conversation...</Text>
                </View>
            </View>
        );
    }

    if (!conversation) {
        return (
            <View style={styles.container}>
                <View style={styles.headerSection}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon source="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Conversation Details</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Card style={styles.errorCard}>
                        <Card.Content style={styles.errorContent}>
                            <Icon source="alert-circle" size={60} color="#ff4757" />
                            <Text style={styles.errorTitle}>Conversation Not Found</Text>
                            <Text style={styles.errorText}>This conversation may have been deleted or doesn't exist.</Text>
                        </Card.Content>
                    </Card>
                </View>
            </View>
        );
    }

    const { messages } = conversation; // Destructure messages from conversation

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerSection}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon source="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>Conversation Details</Text>
                    <Text style={styles.subtitle}>{conversation.header || 'View your conversation'}</Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.contentContainer}>
                    {/* Conversation Messages */}
                    {messages && messages.length > 0 ? (
                        <Card style={styles.conversationCard}>
                            <Card.Content style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.cardIconContainer}>
                                        <Icon source="message-text" size={24} color="#5e7055" />
                                    </View>
                                    <View style={styles.cardTitleContainer}>
                                        <Text style={styles.cardTitle}>Conversation</Text>
                                        <View style={styles.timestampContainer}>
                                            <Icon source="clock-outline" size={14} color="#666" />
                                            <Text style={styles.timestamp}>
                                                {new Date(conversation.timestamp.toDate()).toLocaleDateString()} at {' '}
                                                {new Date(conversation.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.messagesContainer}>
                                    {messages.map((msg, idx) => (
                                        <View key={idx} style={styles.messageRow}>
                                            <View style={[styles.messageIconContainer, msg.role === 'ai' ? styles.aiIconContainer : styles.userIconContainer]}>
                                                <Icon
                                                    source={msg.role === 'ai' ? 'robot' : 'account'}
                                                    size={16}
                                                    color={msg.role === 'ai' ? '#2e7d2e' : '#3a5ca8'}
                                                />
                                            </View>
                                            <View style={styles.messageContent}>
                                                <Text style={[styles.messageRole, msg.role === 'ai' ? styles.aiRole : styles.userRole]}>
                                                    {msg.role === 'ai' ? 'AI Assistant' : 'You'}
                                                </Text>
                                                <Text style={styles.messageText}>{msg.content}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </Card.Content>
                        </Card>
                    ) : (
                        <Card style={styles.emptyCard}>
                            <Card.Content style={styles.emptyContent}>
                                <Icon source="message-outline" size={60} color="#ccc" />
                                <Text style={styles.emptyTitle}>No Messages</Text>
                                <Text style={styles.emptyText}>This conversation doesn't have any messages yet.</Text>
                            </Card.Content>
                        </Card>
                    )}

                    {/* Feedback Section */}
                    <Card style={styles.feedbackCard}>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardIconContainer}>
                                    <Icon source="comment-text" size={24} color="#5e7055" />
                                </View>
                                <Text style={styles.cardTitle}>Feedback & Analysis</Text>
                            </View>

                            <View style={styles.feedbackContent}>
                                {Array.isArray(conversation.feedback) ? (
                                    conversation.feedback.length > 0 ? (
                                        conversation.feedback.map((item, idx) => (
                                            <View key={idx} style={styles.feedbackItem}>
                                                <Icon source="check-circle" size={16} color="#2e7d2e" />
                                                <Text style={styles.feedbackText}>{item}</Text>
                                            </View>
                                        ))
                                    ) : (
                                        <View style={styles.noFeedbackContainer}>
                                            <Icon source="information-outline" size={20} color="#666" />
                                            <Text style={styles.noFeedbackText}>No feedback available for this conversation.</Text>
                                        </View>
                                    )
                                ) : (
                                    <View style={styles.feedbackItem}>
                                        <Icon source="check-circle" size={16} color="#2e7d2e" />
                                        <Text style={styles.feedbackText}>{conversation.feedback || 'No feedback available.'}</Text>
                                    </View>
                                )}
                            </View>
                        </Card.Content>
                    </Card>

                    {/* Delete Button */}
                    <Card style={styles.deleteCard}>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={handleDelete}
                        >
                            <View style={styles.deleteIconContainer}>
                                <Icon source="delete-outline" size={24} color="#fff" />
                            </View>
                            <Text style={styles.deleteText}>Delete Conversation</Text>
                        </TouchableOpacity>
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
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    errorCard: {
        width: '100%',
        borderRadius: 16,
        elevation: 2,
        backgroundColor: '#fff',
    },
    errorContent: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    conversationCard: {
        marginBottom: 16,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: '#fff',
    },
    feedbackCard: {
        marginBottom: 16,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: '#fff',
    },
    emptyCard: {
        marginBottom: 16,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: '#fff',
    },
    emptyContent: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    cardContent: {
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    cardIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f4f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardTitleContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    timestampContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timestamp: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    messagesContainer: {
        gap: 12,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    messageIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    aiIconContainer: {
        backgroundColor: '#e8f5e8',
    },
    userIconContainer: {
        backgroundColor: '#e3f2fd',
    },
    messageContent: {
        flex: 1,
    },
    messageRole: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    aiRole: {
        color: '#2e7d2e',
    },
    userRole: {
        color: '#3a5ca8',
    },
    messageText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    feedbackContent: {
        gap: 12,
    },
    feedbackItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    feedbackText: {
        fontSize: 14,
        color: '#333',
        flex: 1,
        marginLeft: 8,
        lineHeight: 20,
    },
    noFeedbackContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    noFeedbackText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
        fontStyle: 'italic',
    },
    deleteCard: {
        borderRadius: 16,
        elevation: 2,
        backgroundColor: '#ff4757',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    deleteIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    deleteText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});