import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

export default function PrivacyPolicyScreen({ navigation }) {
    return (
        <View style={styles.container}>
            {/* Go Back Button */}
            <IconButton
                icon="arrow-left"
                size={24}
                onPress={() => navigation.goBack()} // Go back to the previous screen
                style={styles.backButton}
            />
            <Text style={styles.text}>Privacy Policy Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        top: 40, // Adjust for status bar height
        left: 20,
        zIndex: 10,
    },
});