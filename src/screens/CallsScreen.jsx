import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../api/firebaseConfig'; // Firebase Firestore instance
import { collection, getDocs, orderBy, query, doc, deleteDoc } from 'firebase/firestore';
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
            <Text style={styles.title}>{item.header}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp.toDate()).toLocaleString()}</Text>
        <IconButton
                icon="delete"
                size={24}
                onPress={() => handleDelete(item.id)}
                style={styles.deleteIcon}
            />
        </TouchableOpacity>
    );
    const handleDelete = async (id) => {
        Alert.alert(
            "Delete Conversation",
            "Are you sure you want to delete this conversation?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'conversations', id));
                            setConversations((prev) => prev.filter((item) => item.id !== id));
                            Alert.alert("Deleted", "Conversation deleted successfully.");
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete conversation.");
                        }
                    }
                }
            ]
        )
    };

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
    deleteIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#ffeaea',
        borderRadius: 20,
    },
});