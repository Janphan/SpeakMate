import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../api/firebaseConfig'; // Firebase Firestore instance
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export default function CallsScreen({ navigation }) {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const q = query(collection(db, 'conversations'), orderBy('timestamp', 'desc'));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setConversations(data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        fetchConversations();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('ConversationDetailsScreen', { conversationId: item.id })}
        >
            <Text style={styles.title}>{item.userInput}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp.toDate()).toLocaleString()}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Conversation History</Text>
            <FlatList
                data={conversations}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    list: {
        paddingBottom: 20,
    },
    item: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    timestamp: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
});