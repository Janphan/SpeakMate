import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { PaperProvider, Button, Card, Icon, Menu } from 'react-native-paper';
import { getAuth } from 'firebase/auth';
import { signup_signin_style, mystyle } from '../utils/mystyle';
import { useStatistics } from '../hooks/useStatistics';

export default function HomeScreen({ navigation }) {
    const [visible, setVisible] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState('Band 5-6');
    const [user, setUser] = useState(null);

    // Use the statistics hook
    const { statistics, loading: isLoadingStats } = useStatistics();

    useEffect(() => {
        const auth = getAuth();
        setUser(auth.currentUser);
    }, []);

    return (
        <PaperProvider>
            <View style={styles.container}>
                {/* Main Content */}
                <View style={styles.mainContent}>
                    {/* User Info */}
                    {user && (
                        <View style={styles.userInfo}>
                            {user.photoURL && (
                                <Image source={{ uri: user.photoURL }} style={styles.avatar} />
                            )}
                            <Text style={styles.userName}>Welcome {user.displayName || "No Name"} 💖</Text>
                        </View>
                    )}

                    {/* Stats Preview */}
                    <Card
                        style={styles.statsCard}
                        onPress={() => navigation.navigate('StatisticsScreen')}
                        accessibilityLabel="View full statistics"
                    >
                        <Card.Content style={styles.statsCardContent}>
                            <Text style={styles.statsTitle}>Your Progress 📊</Text>
                            <View style={styles.statsRow}>
                                <View style={styles.statsLabelContainer}>
                                    <Icon source="fire" size={20} color="#ff5722" />
                                    <Text style={styles.statsLabel}>Streak:</Text>
                                </View>
                                <Text style={styles.statsValue}>
                                    {isLoadingStats ? '...' : `${statistics.streakDays} days`}
                                </Text>
                            </View>
                            <View style={styles.statsRow}>
                                <View style={styles.statsLabelContainer}>
                                    <Icon source="book" size={20} color="#007bff" />
                                    <Text style={styles.statsLabel}>Total Sessions:</Text>
                                </View>
                                <Text style={styles.statsValue}>
                                    {isLoadingStats ? '...' : statistics.totalSessions}
                                </Text>
                            </View>
                            <Text style={styles.statsLink} onPress={() => navigation.navigate("StatisticsScreen")}>Tap to view more</Text>
                        </Card.Content>
                    </Card>

                    {/* Level Selection */}
                    <View style={styles.menuContainer}>
                        <Menu
                            visible={visible}
                            onDismiss={() => setVisible(false)}
                            anchor={
                                <TouchableOpacity onPress={() => setVisible(true)} style={signup_signin_style.button}>
                                    <Text style={signup_signin_style.buttonText}>Choose your level</Text>
                                </TouchableOpacity>
                            }
                            anchorPosition='bottom'
                            contentStyle={mystyle.menuItemStyle}
                        >
                            <Menu.Item
                                onPress={() => {
                                    setSelectedLevel('Band 5-6');
                                    setVisible(false);
                                    navigation.navigate("TopicList", { level: 'band 5-6' });
                                }}
                                title="Band 5-6"
                            />
                            <Menu.Item
                                onPress={() => {
                                    setSelectedLevel('Band 6-7');
                                    setVisible(false);
                                    navigation.navigate("TopicList", { level: 'band 6-7' });
                                }}
                                title="Band 6-7"
                            />
                            <Menu.Item
                                onPress={() => {
                                    setSelectedLevel('Band 7-8');
                                    setVisible(false);
                                    navigation.navigate("TopicList", { level: 'band 7-8' });
                                }}
                                title="Band 7-8"
                            />
                        </Menu>
                        <View style={styles.levelDisplay}>
                            <Text style={styles.levelText}>Current Level: {selectedLevel} ✅</Text>
                        </View>
                    </View>

                    {/* Motivational Message */}
                    <View style={styles.motivation}>
                        <Text style={styles.motivationText}>
                            {isLoadingStats
                                ? "Loading your progress... ⏳"
                                : statistics.streakDays > 0
                                    ? `Keep it up! You're on a ${statistics.streakDays} day streak! 🔥`
                                    : "Start your practice streak today! 🚀"
                            }
                        </Text>
                    </View>
                </View>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        backgroundColor: '#5e7055',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 16,
    },
    userInfo: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginBottom: 8,
    },
    userName: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#5e7055',
    },
    statsCard: {
        margin: 16,
        elevation: 4,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    statsCardContent: {
        padding: 16,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5e7055',
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    statsLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statsLabel: {
        fontSize: 16,
        color: '#666',
    },
    statsValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statsLink: {
        fontSize: 14,
        color: '#5e7055',
        textAlign: 'center',
        marginTop: 8,
    },
    menuContainer: {
        padding: 16,
        width: '100%',
    },
    levelDisplay: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#e8f5e8',
        borderRadius: 8,
    },
    levelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2e7d2e',
        textAlign: 'center',
    },
    startButton: {
        marginTop: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: '#007bff',
    },
    motivation: {
        margin: 16,
        padding: 12,
        backgroundColor: '#e8f5e8',
        borderRadius: 8,
    },
    motivationText: {
        fontSize: 16,
        color: '#2e7d2e',
        textAlign: 'center',
    },
});