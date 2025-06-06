import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { signUpUser } from '../api/auth'; 

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
            source={{ uri: "https://ai.myspeakingscore.com/wp-content/uploads/2024/05/AI-assisted-English-Language-Learning-1024x585.webp" }}
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
