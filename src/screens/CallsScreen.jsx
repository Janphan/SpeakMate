import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';

export default function CallsScreen({ navigation }) {
    // Placeholder data for call history
    const callHistory = [
        { id: '1', title: 'Dialogue with AI - 1', timestamp: '2025-04-25 10:00 AM' },
        { id: '2', title: 'Dialogue with AI - 2', timestamp: '2025-04-26 02:30 PM' },
        { id: '3', title: 'Dialogue with AI - 3', timestamp: '2025-04-27 09:15 AM' },
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('DialogueScreen', { dialogueId: item.id })}
        >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Back to Home Icon */}
            <IconButton
                icon="arrow-left"
                size={24}
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            />
            <Text style={styles.header}>Call History</Text>
            <FlatList
                data={callHistory}
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