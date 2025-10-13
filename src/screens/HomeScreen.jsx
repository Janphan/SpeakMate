import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { PaperProvider, Button, Card, Icon, Menu } from 'react-native-paper';
import { getAuth } from 'firebase/auth';
import { colors, spacing } from '../theme';
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
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.welcomeContainer}>
                        {user && (
                            <>
                                {user.photoURL && (
                                    <Image source={{ uri: user.photoURL }} style={styles.avatar} />
                                )}
                                <View style={styles.welcomeTextContainer}>
                                    <Text style={styles.greetingText}>Welcome back! 👋</Text>
                                    <Text style={styles.userName}>{user.displayName || "Learner"}</Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                {/* Main Content */}
                <View style={styles.mainContent}>

                    {/* Quick Stats Dashboard */}
                    <View style={styles.dashboardGrid}>
                        <Card style={styles.statCard}>
                            <Card.Content style={styles.statCardContent}>
                                <View style={styles.statIconContainer}>
                                    <Icon source="fire" size={28} color="#ff5722" />
                                </View>
                                <Text style={styles.statNumber}>
                                    {isLoadingStats ? '...' : statistics.streakDays}
                                </Text>
                                <Text style={styles.statLabel}>Day Streak</Text>
                            </Card.Content>
                        </Card>

                        <Card style={styles.statCard}>
                            <Card.Content style={styles.statCardContent}>
                                <View style={styles.statIconContainer}>
                                    <Icon source="book-open-variant" size={28} color="#4caf50" />
                                </View>
                                <Text style={styles.statNumber}>
                                    {isLoadingStats ? '...' : statistics.totalSessions}
                                </Text>
                                <Text style={styles.statLabel}>Sessions</Text>
                            </Card.Content>
                        </Card>
                    </View>

                    {/* Progress Overview */}
                    <Card style={styles.progressCard}>
                        <Card.Content style={styles.progressCardContent}>
                            <View style={styles.progressHeader}>
                                <Text style={styles.progressTitle}>📈 Your Journey</Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Progress')}
                                    style={styles.viewMoreButton}
                                >
                                    <Text style={styles.viewMoreText}>View Details</Text>
                                    <Icon source="chevron-right" size={20} color="#5e7055" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.progressSubtitle}>
                                {isLoadingStats
                                    ? "Loading your progress... ⏳"
                                    : statistics.streakDays > 0
                                        ? `Amazing! You're on a ${statistics.streakDays} day streak! Keep going! 🚀`
                                        : "Ready to start your speaking journey? Let's begin! 🌟"
                                }
                            </Text>
                        </Card.Content>
                    </Card>

                    {/* Level Selection */}
                    <Card style={styles.levelCard}>
                        <Card.Content style={styles.levelCardContent}>
                            <Text style={styles.levelCardTitle}>🎯 Choose Your Challenge</Text>
                            <View style={styles.menuContainer}>
                                <Menu
                                    visible={visible}
                                    onDismiss={() => setVisible(false)}
                                    anchor={
                                        <TouchableOpacity onPress={() => setVisible(true)} style={styles.levelButton}>
                                            <Text style={styles.levelButtonText}>Select IELTS Level</Text>
                                            <Icon source="chevron-down" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    }
                                    anchorPosition='top'
                                    contentStyle={styles.menuContent}
                                >
                                    <Menu.Item
                                        onPress={() => {
                                            setSelectedLevel('Band 5-6');
                                            setVisible(false);
                                            navigation.navigate("TopicList", { level: 'band 5-6' });
                                        }}
                                        title="Band 5-6"
                                        titleStyle={styles.menuItemTitle}
                                        style={styles.menuItem}
                                        leadingIcon={() => <Icon source="numeric-5-circle" size={20} color="#5e7055" />}
                                    />
                                    <Menu.Item
                                        onPress={() => {
                                            setSelectedLevel('Band 6-7');
                                            setVisible(false);
                                            navigation.navigate("TopicList", { level: 'band 6-7' });
                                        }}
                                        title="Band 6-7"
                                        titleStyle={styles.menuItemTitle}
                                        style={styles.menuItem}
                                        leadingIcon={() => <Icon source="numeric-6-circle" size={20} color="#5e7055" />}
                                    />
                                    <Menu.Item
                                        onPress={() => {
                                            setSelectedLevel('Band 7-8');
                                            setVisible(false);
                                            navigation.navigate("TopicList", { level: 'band 7-8' });
                                        }}
                                        title="Band 7-8"
                                        titleStyle={styles.menuItemTitle}
                                        style={styles.menuItem}
                                        leadingIcon={() => <Icon source="numeric-7-circle" size={20} color="#5e7055" />}
                                    />
                                </Menu>
                                <View style={styles.levelDisplay}>
                                    <Text style={styles.levelText}>Current: {selectedLevel} ✅</Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                </View>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerSection: {
        backgroundColor: '#5e7055',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    welcomeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    welcomeTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    greetingText: {
        fontSize: 16,
        color: '#c8e6c9',
        fontWeight: '500',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 2,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#fff',
    },
    mainContent: {
        flex: 1,
        padding: 20,
    },
    dashboardGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 16,
        elevation: 4,
        backgroundColor: '#fff',
    },
    statCardContent: {
        alignItems: 'center',
        padding: 20,
    },
    statIconContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 50,
        padding: 12,
        marginBottom: 10,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    progressCard: {
        borderRadius: 16,
        marginBottom: 20,
        elevation: 4,
        backgroundColor: '#fff',
    },
    progressCardContent: {
        padding: 20,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    progressTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5e7055',
    },
    viewMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f4f0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    viewMoreText: {
        fontSize: 14,
        color: '#5e7055',
        fontWeight: '500',
        marginRight: 4,
    },
    progressSubtitle: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    levelCard: {
        borderRadius: 16,
        marginBottom: 20,
        elevation: 4,
        backgroundColor: '#fff',
    },
    levelCardContent: {
        padding: 20,
    },
    levelCardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5e7055',
        marginBottom: 15,
        textAlign: 'center',
    },
    levelButton: {
        backgroundColor: '#5e7055',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        elevation: 2,
    },
    levelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    menuContainer: {
        width: '100%',
        zIndex: 999,
        position: 'relative',
    },
    levelDisplay: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#e8f5e8',
        borderRadius: 10,
        alignItems: 'center',
    },
    levelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2e7d2e',
    },
    motivationCard: {
        borderRadius: 16,
        elevation: 4,
        backgroundColor: '#fff5e6',
        borderLeftWidth: 4,
        borderLeftColor: '#ffc107',
    },
    motivationCardContent: {
        padding: 20,
    },
    motivationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    motivationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f57c00',
        marginLeft: 8,
    },
    motivationText: {
        fontSize: 16,
        color: '#f57c00',
        lineHeight: 24,
        fontStyle: 'italic',
    },
    // Menu Styles
    menuContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        minWidth: 220,
        maxWidth: 280,
        zIndex: 1000,
        position: 'relative',
    },
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 2,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});