import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../api/firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function SettingsScreen({ navigation }) {
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
            <Text style={styles.title}>Settings</Text>

            {/* Profile Section */}
            <View style={styles.profileContainer}>
                <Text style={styles.profileText}>User Profile</Text>
                {/* Add user profile details here */}
            </View>

            {/* Sign Out Button */}
            <TouchableOpacity onPress={handleSignOut}>
                <Icon name="logout" size={30} color="red" />
            </TouchableOpacity>
        </View>
    );
}

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
    profileContainer: {
        marginBottom: 30,
        alignItems: "center",
    },
    profileText: {
        fontSize: 18,
        color: "#333",
    },
    button: {
        backgroundColor: "#ff4d4d",
        padding: 15,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});