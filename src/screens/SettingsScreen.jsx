import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../api/firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { IconButton, Switch } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

// Constants for reusability
const COLORS = {
    primary: '#007bff',
    danger: '#ff4d4d',
    background: '#fff',
    cardBackground: '#f9f9f9',
    text: '#333',
    white: '#fff',
    darkBackground: '#1c2526',
    darkCardBackground: '#2c3e50',
    darkText: '#ecf0f1',
};

// Theme context (simplified for this example)
const useTheme = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    return {
        isDarkMode,
        toggleDarkMode: () => setIsDarkMode((prev) => !prev),
        colors: isDarkMode
            ? { background: COLORS.darkBackground, card: COLORS.darkCardBackground, text: COLORS.darkText }
            : { background: COLORS.background, card: COLORS.cardBackground, text: COLORS.text },
    };
};

const SettingsScreen = React.memo(({ navigation }) => {
    const { isDarkMode, toggleDarkMode, colors } = useTheme();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const scale = useSharedValue(1); // For animation

    const handleSignOut = useCallback(async () => {
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
                            Alert.alert('Success', 'You have been signed out.');
                            navigation.replace('SignInScreen');
                        } catch (error) {
                            Alert.alert('Error', error.message);
                        } finally {
                            setIsSigningOut(false);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    }, [navigation]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withSpring(scale.value) }],
    }));

    const onPressIn = () => {
        scale.value = 0.95;
    };

    const onPressOut = () => {
        scale.value = 1;
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Go Back Button */}
            <IconButton
                icon="arrow-left"
                size={24}
                color={colors.text}
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                accessibilityLabel="Go back"
                accessibilityHint="Returns to the previous screen"
            />

            <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

            <View style={styles.modulesContainer}>
                {/* Profile Section */}
                <Animated.View style={[styles.module, animatedStyle, { backgroundColor: colors.card }]}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ProfileScreen')}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        style={styles.moduleContent}
                        accessibilityLabel="View profile information"
                        accessibilityHint="Navigates to the profile settings screen"
                    >
                        <Icon name="account-circle" size={30} color={COLORS.primary} />
                        <Text style={[styles.moduleText, { color: colors.text }]}>Profile Info</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Dark Mode Toggle */}
                <Animated.View style={[styles.module, animatedStyle, { backgroundColor: colors.card }]}>
                    <View style={styles.moduleContent}>
                        <Icon name="theme-light-dark" size={30} color={COLORS.primary} />
                        <Text style={[styles.moduleText, { color: colors.text }]}>Dark Mode</Text>
                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleDarkMode}
                            style={styles.switch}
                            accessibilityLabel="Toggle dark mode"
                            accessibilityHint="Switches between light and dark theme"
                        />
                    </View>
                </Animated.View>

                {/* Terms of Service Section */}
                <Animated.View style={[styles.module, animatedStyle, { backgroundColor: colors.card }]}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('TermsOfServiceScreen')}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        style={styles.moduleContent}
                        accessibilityLabel="View terms of service"
                        accessibilityHint="Navigates to the terms of service screen"
                    >
                        <Icon name="file-document" size={30} color={COLORS.primary} />
                        <Text style={[styles.moduleText, { color: colors.text }]}>Terms of Service</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Privacy Policy Section */}
                <Animated.View style={[styles.module, animatedStyle, { backgroundColor: colors.card }]}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('PrivacyPolicyScreen')}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        style={styles.moduleContent}
                        accessibilityLabel="View privacy policy"
                        accessibilityHint="Navigates to the privacy policy screen"
                    >
                        <Icon name="shield-lock" size={30} color={COLORS.primary} />
                        <Text style={[styles.moduleText, { color: colors.text }]}>Privacy Policy</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Contact Support Section */}
                <Animated.View style={[styles.module, animatedStyle, { backgroundColor: colors.card }]}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ContactSupportScreen')}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        style={styles.moduleContent}
                        accessibilityLabel="Contact support"
                        accessibilityHint="Navigates to the contact support screen"
                    >
                        <Icon name="help-circle" size={30} color={COLORS.primary} />
                        <Text style={[styles.moduleText, { color: colors.text }]}>Contact Support</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {/* Sign Out Button */}
            <Animated.View style={[styles.signOutButton, animatedStyle, { opacity: isSigningOut ? 0.7 : 1 }]}>
                <TouchableOpacity
                    onPress={handleSignOut}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    style={styles.signOutContent}
                    disabled={isSigningOut}
                    accessibilityLabel="Sign out"
                    accessibilityHint="Signs you out of the application"
                >
                    {isSigningOut ? (
                        <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                        <Icon name="logout" size={30} color={COLORS.white} />
                    )}
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 60,
    },
    modulesContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    module: {
        borderRadius: 12,
        marginBottom: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    moduleContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    moduleText: {
        fontSize: 18,
        marginLeft: 10,
        flex: 1,
    },
    switch: {
        marginLeft: 'auto',
    },
    signOutButton: {
        borderRadius: 12,
        backgroundColor: COLORS.danger,
        marginTop: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    signOutContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
    },
    signOutText: {
        fontSize: 18,
        color: COLORS.white,
        marginLeft: 10,
    },
});

export default SettingsScreen;