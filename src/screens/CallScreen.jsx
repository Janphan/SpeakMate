import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { convertAudioToText } from '../services/speechToText'; // Google STT
import { getOpenAIResponse } from "../services/AIService" // OpenAI API
import { speakText } from '../services/textToSpeech'; // Expo TTS
import AIResponseDisplay from './AIResponseDisplay'; // Display responses
import RecordingControls from './RecordingControls'; // Start/Stop recording
import { requestPermissions } from './PermissionsHandler'; // Handle permissions
import base64 from 'react-native-base64'

const CallScreen = ({ navigation }) => {
    const [recording, setRecording] = useState(null);
    const [transcription, setTranscription] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 🔴 Start Recording
    const startRecording = async () => {
        try {
            console.log("Requesting microphone permissions...");
            const hasPermission = await requestPermissions();
            if (!hasPermission) return;

            await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.LOW_QUALITY);
            setRecording(recording)
            console.log("Recording started...");
        } catch (error) {
            console.error("Failed to start recording:", error);
        }
    };

    // 🛑 Stop Recording & Process Audio
    const stopRecording = async () => {
        setIsLoading(true);
        if (!recording) return;

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();

        console.log("uri: ", uri)
        console.log("data: ", base64.encode(recording.base64))
        setRecording(null);
        console.log("Recording stopped. Sending audio for transcription...");

        const transcript = await convertAudioToText(base64.encode(recording));
        setTranscription(transcript);

        if (transcript) {
            processOpenAIResponse(transcript);
        } else {
            setIsLoading(false);
        }
    };

    // 🤖 Send Text to OpenAI and Speak Response
    const processOpenAIResponse = async (text) => {
        console.log("Sending text to OpenAI:", text);
        const aiReply = await getOpenAIResponse(text);
        setAiResponse(aiReply);
        console.log("OpenAI Response:", aiReply);

        speakText(aiReply); // 🔊 Speak AI response
        setIsLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>AI Voice Assistant</Text>

            {/* Recording Buttons */}
            <RecordingControls startRecording={startRecording} stopRecording={stopRecording} recording={recording} />

            {/* Loading Indicator */}
            {isLoading && <ActivityIndicator size="large" color="blue" />}

            {/* AI & User Text Display */}
            <AIResponseDisplay transcription={transcription} aiResponse={aiResponse} />
        </View>
    );
};

// 🔵 Styles
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

export default CallScreen;
