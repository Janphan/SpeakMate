import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../api/firebaseConfig';
import { IconButton } from 'react-native-paper';

export default function ConversationDetailsScreen({ route, navigation }) {
    const [conversation, setConversation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { conversationId } = route.params || {}; // Get conversationId from navigation params

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

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Go Back Button */}
            <IconButton
                icon="arrow-left"
                size={24}
                onPress={() => navigation.goBack()} // Go back to the previous screen
                style={styles.backButton}
            />
            <View style={styles.container}>
                <Text style={styles.header}>Conversation Details</Text>
                <View style={styles.card}>
                    <Text style={styles.label}>User Input:</Text>
                    <Text style={styles.content}>{conversation.userInput}</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.label}>AI Response:</Text>
                    <Text style={styles.content}>{conversation.aiResponse}</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.label}>Timestamp:</Text>
                    <Text style={styles.content}>
                        {new Date(conversation.timestamp.toDate()).toLocaleString()}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingVertical: 20,
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
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#007bff',
        textAlign: 'center',
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
    backButton: {
        position: 'absolute',
        top: 40, // Adjust for status bar height
        left: 20,
        zIndex: 10,
    },
});