import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import { colors } from '../theme';
import HeaderSection from '../components/HeaderSection';

const topics = [
    { id: '1', title: 'Work or Study', icon: 'briefcase', color: '#4caf50' },
    { id: '2', title: 'Daily Routine & Free Time', icon: 'clock-outline', color: '#2196f3' },
    { id: '3', title: 'Technology & Mobile Phones', icon: 'cellphone', color: '#9c27b0' },
    { id: '4', title: 'Health & Fitness', icon: 'heart-pulse', color: '#f44336' },
    { id: '5', title: 'Travel & Holidays', icon: 'airplane', color: '#ff9800' },
    { id: '6', title: 'Environment & Nature', icon: 'leaf', color: '#4caf50' },
    { id: '7', title: 'Food & Cooking', icon: 'chef-hat', color: '#e91e63' },
    { id: '8', title: 'Family & Relationships', icon: 'account-group', color: '#3f51b5' },
    { id: '9', title: 'Education & Learning', icon: 'school', color: '#ff5722' },
    { id: '10', title: 'Media & Entertainment', icon: 'movie-outline', color: '#795548' },
    { id: '11', title: 'Transportation & Cities', icon: 'city', color: '#607d8b' },
];

export default function TopicList({ navigation, route }) {
    const { level } = route.params || {};

    const handleTopicPress = (topic) => {
        navigation.navigate("DialogueScreen", { topic, level });
        // alert(`Selected topic: ${topic.title}`);
    };

    return (
        <View style={styles.container}>
            <HeaderSection
                title="🎯 Choose Your Topic"
                subtitle={level ? `Level: ${level.toUpperCase()}` : 'Select a conversation topic'}
            />

            {/* Topics List */}
            <View style={styles.contentSection}>
                <FlatList
                    data={topics}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <Card style={styles.topicCard}>
                            <TouchableOpacity
                                style={styles.topicItem}
                                onPress={() => handleTopicPress(item)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                                    <Icon source={item.icon} size={32} color={item.color} />
                                </View>
                                <View style={styles.topicContent}>
                                    <Text style={styles.topicText}>{item.title}</Text>
                                    <Text style={styles.topicSubtext}>Tap to start conversation</Text>
                                </View>
                                <Icon source="chevron-right" size={24} color="#5e7055" />
                            </TouchableOpacity>
                        </Card>
                    )}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    contentSection: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    list: {
        paddingBottom: 20,
    },
    topicCard: {
        marginBottom: 15,
        borderRadius: 16,
        elevation: 4,
        backgroundColor: colors.background.secondary,
        shadowColor: colors.shadow.color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    topicItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    topicContent: {
        flex: 1,
    },
    topicText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 4,
    },
    topicSubtext: {
        fontSize: 14,
        color: colors.text.secondary,
        fontStyle: 'italic',
    },
});