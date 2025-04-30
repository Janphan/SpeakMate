import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../api/firebaseConfig'; // Firebase Firestore instance
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { PaperProvider, IconButton } from 'react-native-paper';

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
        <PaperProvider>
            <View style={styles.container}>
                <IconButton
                    icon="cog"
                    size={30}
                    onPress={() => navigation.navigate("SettingsScreen")}
                    style={styles.settingsIcon}
                />
                <Text style={styles.header}>Conversation History</Text>
                <FlatList
                    data={conversations}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                />
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 90,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 10,
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
    settingsIcon: {
        position: "absolute",
        top: 40,
        right: 20,
        opacity: 0.7,
        backgroundColor: "#fff",
        borderRadius: 50,
        elevation: 2,
        shadowColor: "#000",
    },
});