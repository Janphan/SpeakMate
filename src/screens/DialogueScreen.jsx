import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { convertAudioToText } from '../api/speechToText';
import { getOpenAIResponse } from "../api/AIService";
import { speakText } from '../api/textToSpeech';
import AIResponseDisplay from './AIResponseDisplay';
import RecordingControls from './RecordingControls';
import { IconButton } from 'react-native-paper';

export default function DialogueScreen({ navigation }) {
    const [recording, setRecording] = useState(null);
    const [transcription, setTranscription] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Start Recording
    const startRecording = async () => {
        try {
            const permissionResponse = await Audio.requestPermissionsAsync();

            if (permissionResponse.status === 'granted') {
                console.log('Permission granted');
            } else {
                Alert.alert('Permission not granted');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    // Stop Recording & Process Audio
    const stopRecording = async () => {
        setIsLoading(true);
        if (!recording) return;

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();

        console.log("uri: ", uri);
        setRecording(null);
        console.log("Recording stopped. Sending audio for transcription...");

        if (!uri) {
            console.error('Failed to get URI for recording');
            return;
        }

        try {
            const transcript = await convertAudioToText(uri);
            setTranscription(transcript);
            console.log("transcript", transcript);

            if (transcript) {
                processOpenAIResponse(transcript);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Transcription error:", error);
            setIsLoading(false);
            setTranscription("Transcription failed.");
        }
    };

    // Send Text to OpenAI and Speak Response
    const processOpenAIResponse = async (text) => {
        console.log("Sending text to OpenAI:", text);
        const aiReply = await getOpenAIResponse(text);
        setAiResponse(aiReply);
        console.log("OpenAI Response:", aiReply);

        speakText(aiReply); // Speak AI response
        setIsLoading(false);
    };

    // End the Conversation
    const endConversation = () => {
        Alert.alert(
            "End Conversation",
            "Are you sure you want to end the conversation?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "End",
                    style: "destructive",
                    onPress: () => navigation.navigate("HomeScreen"),
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Back to Home Icon */}
            <IconButton
                icon="arrow-left"
                size={24}
                onPress={() => navigation.navigate("HomeScreen")}
                style={styles.backButton}
            />
            <Text style={styles.title}>AI Voice Assistant</Text>
            <RecordingControls
                startRecording={startRecording}
                stopRecording={stopRecording}
                recording={recording}
            />
            {isLoading && <ActivityIndicator size="large" color="blue" />}
            <AIResponseDisplay transcription={transcription} aiResponse={aiResponse} />
            {/* End Conversation Icon */}
            <IconButton
                icon="stop-circle"
                size={40}
                onPress={endConversation}
                style={styles.endButton}
                color="red"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    backButton: {
        position: 'absolute',
        top: 40, // Adjust for status bar height
        left: 20,
        zIndex: 10,
    },
    endButton: {
        position: 'absolute',
        bottom: 40, // Adjust for spacing at the bottom
        right: 20,
        zIndex: 10,
    },
});

