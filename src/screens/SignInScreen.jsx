// src/screens/SignInScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../api/firebaseConfig"
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { EXPO_CLIENT_ID, WEB_CLIENT_ID, IOS_CLIENT_ID, ANDROID_CLIENT_ID } from '@env';

WebBrowser.maybeCompleteAuthSession();

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    //sign in with google

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: EXPO_CLIENT_ID,         // For Expo Go testing
        iosClientId: IOS_CLIENT_ID,           // For iOS standalone or dev client
        androidClientId: ANDROID_CLIENT_ID,   // For Android standalone or dev client
        webClientId: WEB_CLIENT_ID,           // Optional (if using web too)
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.authentication;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then(() => {
                    Alert.alert("Signed in successfully!");
                    navigation.replace("HomeScreen");
                })
                .catch((error) => {
                    console.error(error);
                    Alert.alert("Firebase error", error.message);
                });
        }
    }, [response]);

    //show logged in user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('User is signed in:', user.email);
            } else {
                console.log('User is signed out');
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter email and password");
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert("Success", "Logged in successfully!");
            navigation.replace("HomeScreen"); // Navigate to Home after login
        } catch (error) {
            Alert.alert("Error", error.message);
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <TouchableOpacity onPress={handleSignIn} style={styles.button} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Signing In..." : "Sign In"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
                <Text style={styles.link}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => promptAsync()} disabled={!request}>
                <Text >Sign in with Google</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    link: {
        marginTop: 15,
        color: "#007bff",
    },
});

export default SignInScreen;
