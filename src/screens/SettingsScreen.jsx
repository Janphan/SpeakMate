import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../api/firebaseConfig';
import { Card, Icon } from 'react-native-paper';

const SettingsScreen = ({ navigation }) => {
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = async () => {
        Alert.alert(
            'Confirm Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsSigningOut(true);
                            await signOut(auth);
                            navigation.replace('SignInScreen');
                        } catch (error) {
                            Alert.alert('Error', error.message);
                        } finally {
                            setIsSigningOut(false);
                        }
                    },
                },
            ]
        );
    };

    const settingsItems = [
        {
            title: 'Profile Information',
            icon: 'account-circle',
            onPress: () => navigation.navigate('ProfileScreen'),
        },
        {
            title: 'Terms of Service',
            icon: 'file-document-outline',
            onPress: () => navigation.navigate('TermsOfServiceScreen'),
        },
        {
            title: 'Privacy Policy',
            icon: 'shield-lock-outline',
            onPress: () => navigation.navigate('PrivacyPolicyScreen'),
        },
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerSection}>
                <View style={styles.headerContent}>
                    <Icon source="cog" size={40} color="#5e7055" />
                    <Text style={styles.title}>Settings</Text>
                    <Text style={styles.subtitle}>Manage your account and preferences</Text>
                </View>
            </View>

            {/* Settings Items */}
            <View style={styles.settingsContainer}>
                {settingsItems.map((item, index) => (
                    <Card key={index} style={styles.settingsCard}>
                        <TouchableOpacity
                            style={styles.settingsItem}
                            onPress={item.onPress}
                        >
                            <View style={styles.settingsIconContainer}>
                                <Icon source={item.icon} size={24} color="#5e7055" />
                            </View>
                            <Text style={styles.settingsText}>{item.title}</Text>
                            <Icon source="chevron-right" size={20} color="#666" />
                        </TouchableOpacity>
                    </Card>
                ))}
            </View>

            {/* Sign Out Section */}
            <View style={styles.signOutContainer}>
                <Card style={styles.signOutCard}>
                    <TouchableOpacity
                        style={styles.signOutButton}
                        onPress={handleSignOut}
                        disabled={isSigningOut}
                    >
                        <View style={styles.signOutIconContainer}>
                            <Icon source="logout" size={24} color="#fff" />
                        </View>
                        <Text style={styles.signOutText}>
                            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                        </Text>
                    </TouchableOpacity>
                </Card>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headerSection: {
        backgroundColor: '#5e7055',
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerContent: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
        textAlign: 'center',
    },
    settingsContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    settingsCard: {
        marginBottom: 12,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: '#fff',
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    settingsIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f4f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    settingsText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    signOutContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    signOutCard: {
        borderRadius: 16,
        elevation: 2,
        backgroundColor: '#ff4757',
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    signOutIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    signOutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default SettingsScreen;