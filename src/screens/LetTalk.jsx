import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PaperProvider, IconButton } from 'react-native-paper';
import * as Speech from 'expo-speech';

export default function LetTalk({ navigation, route }) {
    const { level } = route.params || {};
    const [visible, setVisible] = useState(false);

    const speak = () => {
        Speech.speak('Hello, how can I assist you today?', {
            language: "en-US",
            pitch: 1.0,
            rate: 1.0,
            onDone: () => {
                // Uncomment the next line if you want to navigate after speaking
                // navigation.navigate("DialogueScreen");
            },
            onError: (error) => console.log("Speech error:", error),
        });
    };

    return (
        <PaperProvider>
            <View style={styles.container}>
                {/* Settings Icon in the top-right corner */}
                <IconButton
                    icon="cog"
                    size={30}
                    onPress={() => navigation.navigate("SettingsScreen")}
                    style={styles.settingsIcon}
                />

                {/* Main Content */}
                <Text style={styles.title}>Let's talk</Text>
                <Text>Selected Level: {level}</Text>
                <IconButton
                    icon="volume-high"
                    size={50}
                    onPress={() => { speak(); navigation.navigate("DialogueScreen"); }}
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
    settingsIcon: {
        position: "absolute",
        top: 40,
        right: 20,
        opacity: 0.7,
        backgroundColor: "#fff",
        borderRadius: 50,
        elevation: 2,
        shadowColor: "#000",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    speakerIcon: {
        marginTop: 20,
    },
});
