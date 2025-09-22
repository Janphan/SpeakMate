import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../api/firebaseConfig";
import { mystyle, signup_signin_style } from '../utils/mystyle';
import Icon from 'react-native-vector-icons/Feather';
import { onAuthStateChanged } from 'firebase/auth';

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Monitor auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('User is signed in:', user.email);
                navigation.replace("HomeScreen"); // Auto-navigate if already signed in
            } else {
                console.log('User is signed out');
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
            Alert.alert("Success", "Logged in successfully!");
            navigation.replace("HomeScreen");
        } catch (error) {
            console.error("Email Sign-In Error:", error);
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={{ uri: mystyle.signin_background }}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.title}>SpeakMate</Text>
                <Text style={styles.subtitle}>Welcome Back! Please Sign In.</Text>
                <TextInput
                    placeholder="✉️ Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    textContentType="emailAddress"
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="🔑 Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        style={styles.input}
                        textContentType="password"
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                    >
                        <Icon name={showPassword ? "eye-off" : "eye"} size={18} color="#666" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={handleSignIn}
                    style={styles.button}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? "Signing In..." : "Sign In"}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
                    <Text style={styles.link}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("ResetPasswordScreen")}>
                    <Text style={styles.link}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    ...signup_signin_style,
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
    },
});

export default SignInScreen;