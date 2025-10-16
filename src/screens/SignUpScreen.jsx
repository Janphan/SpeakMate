import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, StatusBar, Alert } from 'react-native';
import { signUpUser } from '../api/auth';
import { Icon, Card } from 'react-native-paper';
import { colors } from '../theme';

// Import the background image
const backgroundImage = require('../../assets/sigin_background.jpg');

export default function SignUpScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSignUp = async () => {
        if (!email || !password || !name) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await signUpUser(email, password, name);
            Alert.alert("Success", "Account created successfully!");
            navigation.navigate("HomeScreen");
        } catch (error) {
            Alert.alert("Error", error.message);
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
                        <Icon source="account-plus" size={60} color={colors.text.light} />
                    </View>
                    <Text style={styles.title}>Join SpeakMate</Text>
                    <Text style={styles.subtitle}>Create your account to get started</Text>
                </View>

                {/* Form Card */}
                <Card style={styles.formCard}>
                    <Card.Content style={styles.formContent}>
                        {/* Name Input */}
                        <View style={styles.inputContainer}>
                            <Icon source="account" size={20} color={colors.primary} style={styles.inputIcon} />
                            <TextInput
                                placeholder="Full Name"
                                value={name}
                                onChangeText={setName}
                                style={styles.input}
                                autoCapitalize="words"
                                placeholderTextColor={colors.text.secondary}
                            />
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Icon source="email" size={20} color={colors.primary} style={styles.inputIcon} />
                            <TextInput
                                placeholder="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={styles.input}
                                textContentType="emailAddress"
                                placeholderTextColor={colors.text.secondary}
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Icon source="lock" size={20} color={colors.primary} style={styles.inputIcon} />
                            <TextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                style={styles.input}
                                textContentType="password"
                                placeholderTextColor={colors.text.secondary}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Icon source={showPassword ? "eye-off" : "eye"} size={20} color={colors.text.secondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            onPress={handleSignUp}
                            style={[styles.signUpButton, loading && styles.disabledButton]}
                            disabled={loading}
                        >
                            <Text style={styles.signUpButtonText}>
                                {loading ? "Creating Account..." : "Sign Up"}
                            </Text>
                        </TouchableOpacity>

                        {/* Navigation Link */}
                        <View style={styles.linksContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate("SignInScreen")}>
                                <Text style={styles.link}>Already have an account? Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        </ImageBackground>
    );
}

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
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.text.light,
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 16,
        color: colors.text.light,
        textAlign: 'center',
        opacity: 0.9,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
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
    signUpButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
        elevation: 2,
    },
    disabledButton: {
        backgroundColor: colors.primaryLight,
        elevation: 0,
    },
    signUpButtonText: {
        color: colors.text.light,
        fontSize: 16,
        fontWeight: '600',
    },
    linksContainer: {
        alignItems: 'center',
    },
    link: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
});
