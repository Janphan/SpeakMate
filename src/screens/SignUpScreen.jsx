import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { signUpUser } from '../api/auth';
import { mystyle, signup_signin_style } from '../utils/mystyle';

export default function SignUpScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSignUp = async () => {
        try {
            await signUpUser(email, password, name);
            alert('Sign up successful!!');
            navigation.navigate("HomeScreen");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <ImageBackground
            source={{ uri: mystyle.signin_background }}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Sign Up</Text>
                <TextInput
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    autoCapitalize="words"
                />
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    secureTextEntry
                    onChangeText={setPassword}
                    style={styles.input}
                />
                <TouchableOpacity onPress={handleSignUp} style={styles.button}>
                    <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("SignInScreen")}>
                    <Text style={styles.link}>Already have an account? Sign In</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create(signup_signin_style);
