// src/screens/SignInScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../api/firebaseConfig";
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

    // Google Sign-In
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: EXPO_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        androidClientId: ANDROID_CLIENT_ID,
        webClientId: WEB_CLIENT_ID,
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

    //show logged in users
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
        <ImageBackground
            source={{ uri: "https://i.pinimg.com/736x/a4/a1/9b/a4a19b940987cb322cf4d75079a8ddc8.jpg" }}
            style={styles.background}
        >
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

                <TouchableOpacity onPress={() => navigation.navigate("ResetPasswordScreen")}>
                    <Text style={styles.link}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    onPress={() => promptAsync()}
                    disabled={!request}
                    style={styles.googleButton}
                >
                    <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </TouchableOpacity> */}
            </View>
        </ImageBackground >
    );
};

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
        // backgroundColor: "rgba(255, 255, 255, 1.0)", // Semi-transparent background
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        fontFamily: "sans-serif", // Add custom font if needed
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
        backgroundColor: "#5e7055",
        padding: 15,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        marginBottom: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    link: {
        marginTop: 15,
        color: "#black",
        fontWeight: "bold",
    },
    googleButton: {
        backgroundColor: "#db4437",
        padding: 15,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        marginTop: 20,
    },
    googleButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default SignInScreen;
