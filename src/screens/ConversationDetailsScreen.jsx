import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../api/firebaseConfig';
import { Card, Icon } from 'react-native-paper';
import { logger } from '../utils/logger';
import { colors } from '../theme';
import HeaderSection from '../components/HeaderSection';

export default function ConversationDetailsScreen({ route, navigation }) {
    const [conversation, setConversation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUnauthorized, setIsUnauthorized] = useState(false);

    const { conversationId } = route.params || {};

    useEffect(() => {
        const fetchConversation = async () => {
            if (conversationId) {
                try {
                    const auth = getAuth();
                    const currentUser = auth.currentUser;

                    if (!currentUser) {
                        logger.warn('No authenticated user found');
                        setIsUnauthorized(true);
                        setIsLoading(false);
                        return;
                    }

                    const docRef = doc(db, 'conversations', conversationId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const conversationData = docSnap.data();

                        // Verify the conversation belongs to the current user
                        if (conversationData.userId !== currentUser.uid) {
                            logger.warn('Unauthorized access attempt', {
                                conversationId,
                                userId: currentUser.uid,
                                conversationUserId: conversationData.userId
                            });
                            setIsUnauthorized(true);
                        } else {
                            setConversation(conversationData);
                        }
                    } else {
                        logger.error('Document not found', { conversationId });
                        setConversation(null);
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

    if (isUnauthorized) {
        return (
            <View style={styles.container}>
                <HeaderSection
                    title="Conversation Details"
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                />
                <View style={styles.errorContainer}>
                    <Card style={styles.errorCard}>
                        <Card.Content style={styles.errorContent}>
                            <Icon source="shield-alert" size={60} color="#ff4757" />
                            <Text style={styles.errorTitle}>Access Denied</Text>
                            <Text style={styles.errorText}>You don't have permission to view this conversation.</Text>
                        </Card.Content>
                    </Card>
                </View>
            </View>
        );
    }

    if (!conversation) {
        return (
            <View style={styles.container}>
                <HeaderSection
                    title="Conversation Details"
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                />
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
            <HeaderSection
                title="Conversation Details"
                subtitle={conversation.header || 'View your conversation'}
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

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
                                    {messages.map((msg, index) => {
                                        return (
                                            <View key={`msg-${index}-${msg.role}`} style={styles.messageRow}>
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
                                        );
                                    })}
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
                                        conversation.feedback.map((item, index) => {
                                            return (
                                                <View key={`feedback-${index}`} style={styles.feedbackItem}>
                                                    <Icon source="check-circle" size={16} color="#2e7d2e" />
                                                    <Text style={styles.feedbackText}>{item}</Text>
                                                </View>
                                            );
                                        })
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
        backgroundColor: colors.background.primary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background.primary,
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
        color: colors.text.secondary,
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
        backgroundColor: colors.background.secondary,
    },
    errorContent: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text.primary,
        marginTop: 16,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 16,
        color: colors.text.secondary,
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
        backgroundColor: colors.background.secondary,
    },
    feedbackCard: {
        marginBottom: 16,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: colors.background.secondary,
    },
    emptyCard: {
        marginBottom: 16,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: colors.background.secondary,
    },
    emptyContent: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.primary,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: colors.text.secondary,
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
        borderBottomColor: colors.border.medium,
    },
    cardIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.background.tertiary,
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
        color: colors.text.primary,
        marginBottom: 4,
    },
    timestampContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timestamp: {
        fontSize: 12,
        color: colors.text.secondary,
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
        backgroundColor: colors.status.success + '30', // Light green background
    },
    userIconContainer: {
        backgroundColor: colors.status.info + '30', // Light blue background
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
        color: colors.status.success,
    },
    userRole: {
        color: colors.status.info,
    },
    messageText: {
        fontSize: 14,
        color: colors.text.primary,
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
        color: colors.text.primary,
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
        color: colors.text.secondary,
        marginLeft: 8,
        fontStyle: 'italic',
    },
    deleteCard: {
        borderRadius: 16,
        elevation: 2,
        backgroundColor: colors.status.error,
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
        color: colors.text.light,
    },
});