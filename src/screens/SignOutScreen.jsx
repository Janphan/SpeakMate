import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../api/firebaseConfig";
import { colors } from '../theme';

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
        backgroundColor: colors.background.secondary,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    button: {
        backgroundColor: colors.status.error,
        padding: 15,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        marginBottom: 10,
    },
    buttonText: {
        color: colors.text.light,
        fontWeight: "bold",
    },
    cancelButton: {
        backgroundColor: colors.text.secondary,
        padding: 15,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
    },
    cancelButtonText: {
        color: colors.text.light,
        fontWeight: "bold",
    },
});

export default SignOutScreen;