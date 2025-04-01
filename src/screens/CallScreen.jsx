import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { recordVoice, speakText } from "../services/SpeechService"
import { getAIResponse } from '../services/AIService';

export default function CallScreen({ navigation }) {
    const [transcription, setTranscription] = useState("");
    const [aiResponse, setAIResponse] = useState("");

    const handleCall = async () => {
        setTranscription("Listening...");

        // Step 1: Record voice and convert to text
        await recordVoice(setTranscription);

        // Step 2: Wait for transcription and send to OpenAI
        if (transcription) {
            const response = await getAIResponse(transcription);
            setAIResponse(response);

            // Step 3: Speak out AI response
            speakText(response);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.callingText}>Calling AI Voice Chat...</Text>

            {/* Transcribed Text */}
            <Text style={styles.transcription}>{transcription}</Text>

            {/* AI Response */}
            <Text style={styles.response}>{aiResponse}</Text>

            {/* Call Button */}
            <IconButton
                icon="phone"
                size={50}
                iconColor="white"
                containerColor="green"
                style={styles.callButton}
                onPress={handleCall}
            />

            {/* Hang Up Button */}
            <IconButton
                icon="phone-hangup"
                size={50}
                iconColor="white"
                containerColor="red"
                style={styles.hangUpButton}
                onPress={() => navigation.goBack()}
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
    transcription: {
        color: 'yellow',
        fontSize: 18,
        marginBottom: 20,
    },
    response: {
        color: 'lightgreen',
        fontSize: 18,
        marginBottom: 40,
    },
    callButton: {
        marginBottom: 20,
    },
});
