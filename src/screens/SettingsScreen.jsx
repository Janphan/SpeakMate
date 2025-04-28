import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../api/firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { IconButton } from 'react-native-paper';

export default function SettingsScreen({ navigation }) {
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            Alert.alert("Success", "You have been signed out.");
            navigation.replace("SignInScreen");
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            {/* Go Back Button */}
            <IconButton
                icon="arrow-left"
                size={24}
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            />

            <Text style={styles.title}>Settings</Text>

            <View style={styles.modulesContainer}>
                {/* Profile Section */}
                <TouchableOpacity style={styles.module} onPress={() => navigation.navigate('ProfileScreen')}>
                    <Icon name="account-circle" size={30} color="#007bff" />
                    <Text style={styles.moduleText}>Profile Info</Text>
                </TouchableOpacity>

                {/* Terms of Service Section */}
                <TouchableOpacity style={styles.module} onPress={() => navigation.navigate('TermsOfServiceScreen')}>
                    <Icon name="file-document" size={30} color="#007bff" />
                    <Text style={styles.moduleText}>Terms of Service</Text>
                </TouchableOpacity>

                {/* Privacy Policy Section */}
                <TouchableOpacity style={styles.module} onPress={() => navigation.navigate('PrivacyPolicyScreen')}>
                    <Icon name="shield-lock" size={30} color="#007bff" />
                    <Text style={styles.moduleText}>Privacy Policy</Text>
                </TouchableOpacity>
            </View>

            {/* Sign Out Button */}
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Icon name="logout" size={30} color="white" />
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        marginTop: 60,
    },
    modulesContainer: {
        flex: 1,
        justifyContent: "center",
    },
    module: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        marginBottom: 15,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        elevation: 2,
    },
    moduleText: {
        fontSize: 18,
        marginLeft: 10,
        color: "#333",
    },
    signOutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ff4d4d",
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
    },
    signOutText: {
        fontSize: 18,
        color: "white",
        marginLeft: 10,
    },
});