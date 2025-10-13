import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, StatusBar } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../api/firebaseConfig';
import { Icon, Card } from 'react-native-paper';
import PropTypes from 'prop-types';

// Import the background image
const backgroundImage = require('../../assets/sigin_background.jpg');

export default function ResetPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordReset = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email address.");
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert(
                "Success",
                "Password reset email sent! Please check your inbox and follow the instructions to reset your password.",
                [{ text: "OK", onPress: () => navigation.navigate("SignInScreen") }]
            );
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
                        <Icon source="lock-reset" size={60} color="#fff" />
                    </View>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>Enter your email to receive reset instructions</Text>
                </View>

                {/* Form Card */}
                <Card style={styles.formCard}>
                    <Card.Content style={styles.formContent}>
                        {/* Instructions */}
                        <View style={styles.instructionsContainer}>
                            <Icon source="information" size={20} color="#5e7055" />
                            <Text style={styles.instructionsText}>
                                We&apos;ll send you a link to reset your password
                            </Text>
                        </View>

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

                        {/* Reset Button */}
                        <TouchableOpacity
                            onPress={handlePasswordReset}
                            style={[styles.resetButton, loading && styles.disabledButton]}
                            disabled={loading}
                        >
                            <Text style={styles.resetButtonText}>
                                {loading ? "Sending..." : "Send Reset Email"}
                            </Text>
                        </TouchableOpacity>

                        {/* Navigation Link */}
                        <View style={styles.linksContainer}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={styles.link}>Back to Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        </ImageBackground>
    );
}

ResetPasswordScreen.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
        goBack: PropTypes.func.isRequired,
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
        color: '#fff',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
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
        backgroundColor: '#fff',
    },
    formContent: {
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    instructionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f4f0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    instructionsText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#5e7055',
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 12,
        color: '#333',
    },
    resetButton: {
        backgroundColor: '#5e7055',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 24,
        elevation: 2,
    },
    disabledButton: {
        backgroundColor: '#a5b5a0',
        elevation: 0,
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    linksContainer: {
        alignItems: 'center',
    },
    link: {
        color: '#5e7055',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
});
