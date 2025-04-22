import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PaperProvider, IconButton } from 'react-native-paper';
import * as Speech from 'expo-speech';

export default function HomeScreen({ navigation }) {
    const speak = () => {
        Speech.speak('Hello, how can I assist you today?'), {
            language: "en-US",
            pitch: 1.0,
            rate: 1.0,
            onDone: () => console.log("Speech finished"),
            onError: (error) => console.log("Speech error:", error),
        };
    };

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.title}>Let's talk</Text>
                <IconButton
                    icon="volume-high"
                    size={50}
                    onPress={() => { speak; navigation.navigate("CallScreen") }}
                    style={styles.speakerIcon}
                />
            </View>
        </PaperProvider>
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
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    link: {
        marginTop: 15,
        color: "#007bff",
    },
    speakerIcon: {
        marginTop: 20,
    }
});
