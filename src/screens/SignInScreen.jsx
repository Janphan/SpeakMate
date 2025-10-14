import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, StatusBar } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../api/firebaseConfig";
import { Icon, Card } from 'react-native-paper';
import { onAuthStateChanged } from 'firebase/auth';
import { logger } from '../utils/logger';
import PropTypes from 'prop-types';
import { colors } from '../theme';

// Import the background image
const backgroundImage = require('../../assets/sigin_background.jpg');

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Monitor auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                logger.info('User is signed in:', user.email);
                navigation.replace("HomeScreen"); // Auto-navigate if already signed in
            } else {
                logger.info('User is signed out');
            }
        });

        return () => unsubscribe();
    }, [navigation]);

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.replace("HomeScreen");
        } catch (error) {

            // Handle specific Firebase auth errors
            if (error.code === 'auth/invalid-credential') {
                Alert.alert(
                    "Account Not Found",
                    "This email is not registered yet. Would you like to create a new account?",
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Sign Up",
                            onPress: () => navigation.navigate("SignUpScreen")
                        }
                    ]
                );
            } else if (error.code === 'auth/user-not-found') {
                Alert.alert(
                    "Account Not Found",
                    "No account found with this email address. Would you like to create one?",
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Sign Up",
                            onPress: () => navigation.navigate("SignUpScreen")
                        }
                    ]
                );
            } else if (error.code === 'auth/wrong-password') {
                Alert.alert(
                    "Incorrect Password",
                    "The password you entered is incorrect. Please try again or reset your password.",
                    [
                        { text: "Try Again", style: "cancel" },
                        {
                            text: "Reset Password",
                            onPress: () => navigation.navigate("ResetPasswordScreen")
                        }
                    ]
                );
            } else if (error.code === 'auth/invalid-email') {
                Alert.alert("Invalid Email", "Please enter a valid email address.");
            } else if (error.code === 'auth/user-disabled') {
                Alert.alert("Account Disabled", "This account has been disabled. Please contact support.");
            } else if (error.code === 'auth/too-many-requests') {
                Alert.alert(
                    "Too Many Attempts",
                    "Too many failed sign-in attempts. Please try again later or reset your password.",
                    [
                        { text: "OK", style: "cancel" },
                        {
                            text: "Reset Password",
                            onPress: () => navigation.navigate("ResetPasswordScreen")
                        }
                    ]
                );
            } else {
                // Fallback for other errors
                Alert.alert("Sign In Error", "Unable to sign in. Please check your credentials and try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={backgroundImage}
            style={styles.background}
        >
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={styles.overlay} />

            <View style={styles.container}>
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.logoContainer}>
                        <Icon source="account-voice" size={60} color="#fff" />
                    </View>
                    <Text style={styles.title}>SpeakMate</Text>
                    <Text style={styles.subtitle}>Welcome Back! Please Sign In.</Text>
                </View>

                {/* Form Card */}
                <Card style={styles.formCard}>
                    <Card.Content style={styles.formContent}>
                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Icon source="email" size={20} color="#5e7055" style={styles.inputIcon} />
                            <TextInput
                                placeholder="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={styles.input}
                                textContentType="emailAddress"
                                placeholderTextColor="#888"
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Icon source="lock" size={20} color="#5e7055" style={styles.inputIcon} />
                            <TextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                style={styles.input}
                                textContentType="password"
                                placeholderTextColor="#888"
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Icon source={showPassword ? "eye-off" : "eye"} size={20} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {/* Sign In Button */}
                        <TouchableOpacity
                            onPress={handleSignIn}
                            style={[styles.signInButton, loading && styles.disabledButton]}
                            disabled={loading}
                        >
                            <Text style={styles.signInButtonText}>
                                {loading ? "Signing In..." : "Sign In"}
                            </Text>
                        </TouchableOpacity>

                        {/* Navigation Links */}
                        <View style={styles.linksContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
                                <Text style={styles.link}>Don&apos;t have an account? Sign Up</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate("ResetPasswordScreen")}>
                                <Text style={styles.forgotLink}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        </ImageBackground>
    );
};

SignInScreen.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
    }).isRequired,
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Keep rgba for overlay effect
        zIndex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 2,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.text.light + '20', // White with 20% opacity
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: colors.text.light + '30', // White with 30% opacity
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.text.light,
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)', // Keep rgba for shadow effect
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 16,
        color: colors.text.light,
        textAlign: 'center',
        opacity: 0.9,
        textShadowColor: 'rgba(0, 0, 0, 0.3)', // Keep rgba for shadow effect
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    formCard: {
        width: '100%',
        maxWidth: 350,
        borderRadius: 16,
        elevation: 8,
        backgroundColor: colors.background.secondary,
    },
    formContent: {
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.primary,
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 12,
        color: colors.text.primary,
    },
    eyeIcon: {
        padding: 8,
    },
    signInButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
        elevation: 2,
    },
    disabledButton: {
        backgroundColor: colors.text.secondary,
        elevation: 0,
    },
    signInButtonText: {
        color: colors.text.light,
        fontSize: 16,
        fontWeight: '600',
    },
    linksContainer: {
        alignItems: 'center',
        gap: 12,
    },
    link: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    forgotLink: {
        color: colors.text.secondary,
        fontSize: 14,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});

export default SignInScreen;