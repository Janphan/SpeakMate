import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../api/firebaseConfig";

const SignOutScreen = ({ navigation }) => {
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            Alert.alert("Success", "You have been signed out.");
            navigation.replace("SignInScreen"); // Navigate back to SignInScreen
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Are you sure you want to sign out?</Text>
            <TouchableOpacity onPress={handleSignOut} style={styles.button}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
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
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#ff4d4d",
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
    cancelButton: {
        backgroundColor: "#ccc",
        padding: 15,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#000",
        fontWeight: "bold",
    },
});

export default SignOutScreen;