import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../api/firebaseConfig';
import { mystyle, signup_signin_style } from '../utils/mystyle';

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
            source={{ uri: mystyle.signin_background }}
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

const styles = StyleSheet.create(signup_signin_style);
