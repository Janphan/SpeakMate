import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../api/firebaseConfig';

export default function ResetPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');

    const handlePasswordReset = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email address.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert("Success", "Password reset email sent!");
            navigation.navigate("SignInScreen"); // Navigate back to SignInScreen
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <ImageBackground
            source={{ uri: "https://ai.myspeakingscore.com/wp-content/uploads/2024/05/AI-assisted-English-Language-Learning-1024x585.webp" }}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Reset Password</Text>
                <TextInput
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TouchableOpacity onPress={handlePasswordReset} style={styles.button}>
                    <Text style={styles.buttonText}>Send Reset Email</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.link}>Back to Sign In</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    link: {
        marginTop: 15,
        color: "#007bff",
        fontWeight: "bold",
    },
});