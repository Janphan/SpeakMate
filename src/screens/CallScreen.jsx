import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

export default function CallScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.callingText}>Calling AI Voice Chat...</Text>

            {/* Call Timer (Fake) */}
            <Text style={styles.timer}>00:15</Text>

            {/* Hang Up Button */}
            <IconButton
                icon="phone-hangup"
                size={50}
                color="white"
                style={styles.hangUpButton}
                onPress={() => navigation.goBack()}  // Go back to Home
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', // Black background for call UI
    },
    callingText: {
        color: 'black',
        fontSize: 22,
        marginBottom: 10,
    },
    timer: {
        color: 'black',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    hangUpButton: {
        backgroundColor: 'red',
        borderRadius: 30,
        padding: 10,
    },
});
