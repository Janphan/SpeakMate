import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../api/firebaseConfig'; // Firebase Firestore instance
import { collection, getDocs, query, doc, deleteDoc, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Card, Icon } from 'react-native-paper';
import { logger } from '../utils/logger';
import { colors } from '../theme';
import HeaderSection from '../components/HeaderSection';

export default function CallsScreen({ navigation }) {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const auth = getAuth();
                const currentUser = auth.currentUser;

                if (!currentUser) {
                    logger.warn('No authenticated user found');
                    setConversations([]);
                    return;
                }

                const q = query(
                    collection(db, 'conversations'),
                    where('userId', '==', currentUser.uid)
                );
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Sort by timestamp in descending order (newest first) in memory
                const sortedData = data.sort((a, b) => {
                    if (a.timestamp && b.timestamp) {
                        return b.timestamp.toDate() - a.timestamp.toDate();
                    }
                    return 0;
                });

                setConversations(sortedData);
            } catch (error) {
                logger.error('Error fetching conversations', { error: error.message, stack: error.stack });
            }
        };

        fetchConversations();
    }, []);

    const renderItem = ({ item }) => (
        <Card style={styles.conversationCard}>
            <TouchableOpacity
                style={styles.conversationItem}
                onPress={() => navigation.navigate('ConversationDetailsScreen', { conversationId: item.id })}
            >
                <View style={styles.conversationContent}>
                    <View style={styles.iconContainer}>
                        <Icon source="message-text" size={24} color="#5e7055" />
                    </View>
                    <View style={styles.conversationInfo}>
                        <Text style={styles.conversationTitle} numberOfLines={2}>
                            {item.header || 'Conversation'}
                        </Text>
                        <View style={styles.timestampContainer}>
                            <Icon source="clock-outline" size={14} color="#666" />
                            <Text style={styles.timestamp}>
                                {new Date(item.timestamp.toDate()).toLocaleString()}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(item.id)}
                    >
                        <Icon source="delete-outline" size={20} color="#ff4757" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Card>
    );
    const handleDelete = async (id) => {
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
                            await deleteDoc(doc(db, 'conversations', id));
                            setConversations((prev) => prev.filter((item) => item.id !== id));
                            Alert.alert("Deleted", "Conversation deleted successfully.");
                        } catch {
                            Alert.alert("Error", "Failed to delete conversation.");
                        }
                    }
                }
            ]
        )
    };

    return (
        <View style={styles.container}>
            <HeaderSection
                title="Conversation History"
                subtitle="Review your past speaking sessions"
                iconName="history"
                iconColor="#5e7055"
            />

            {/* Content */}
            <View style={styles.contentContainer}>
                {conversations.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Card style={styles.emptyCard}>
                            <Card.Content style={styles.emptyContent}>
                                <Icon source="message-outline" size={60} color="#ccc" />
                                <Text style={styles.emptyTitle}>No Conversations Yet</Text>
                                <Text style={styles.emptyText}>
                                    Start practicing to see your conversation history here
                                </Text>
                            </Card.Content>
                        </Card>
                    </View>
                ) : (
                    <FlatList
                        data={conversations}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    list: {
        paddingBottom: 100,
    },
    conversationCard: {
        marginBottom: 12,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: colors.background.secondary,
    },
    conversationItem: {
        padding: 16,
    },
    conversationContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.background.tertiary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    conversationInfo: {
        flex: 1,
    },
    conversationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 4,
    },
    timestampContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timestamp: {
        fontSize: 14,
        color: colors.text.secondary,
        marginLeft: 4,
    },
    deleteButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.status.error + '10', // Light red background  
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.status.error + '30', // Slightly darker red border
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyCard: {
        width: '100%',
        borderRadius: 16,
        elevation: 2,
        backgroundColor: colors.background.secondary,
    },
    emptyContent: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text.primary,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
    },
});