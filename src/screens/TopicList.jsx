import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const topics = [
    { id: '1', title: 'Work or Study' },
    { id: '2', title: 'Daily Routine & Free Time' },
    { id: '3', title: 'Technology & Mobile Phones' },
    { id: '4', title: 'Health & Fitness' },
    { id: '5', title: 'Travel & Holidays' },
    { id: '6', title: 'Environment & Nature' },
];

export default function TopicList({ navigation, route }) {
    const { level } = route.params || {};

    const handleTopicPress = (topic) => {
        navigation.navigate('LetTalk', { topic, level });
        alert(`Selected topic: ${topic.title}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Topics{level ? ` (${level})` : ''}</Text>
            <FlatList
                data={topics}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.topicItem}
                        onPress={() => handleTopicPress(item)}
                    >
                        <Text style={styles.topicText}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 80,
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    list: {
        width: '100%',
        alignItems: 'center',
    },
    topicItem: {
        backgroundColor: '#f0f0f0',
        padding: 18,
        borderRadius: 10,
        marginBottom: 16,
        width: '90%',
        alignItems: 'center',
        elevation: 2,
    },
    topicText: {
        fontSize: 18,
        color: '#333',
    },
});