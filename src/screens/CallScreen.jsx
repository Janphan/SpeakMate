import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { convertAudioToText } from '../services/speechToText'; // Whishper
import { getOpenAIResponse } from "../services/AIService" // OpenAI API
import { speakText } from '../services/textToSpeech'; // Expo TTS
import AIResponseDisplay from './AIResponseDisplay'; // Display responses
import RecordingControls from './RecordingControls'; // Start/Stop recording
import { requestPermissions } from './PermissionsHandler'; // Handle permissions

const CallScreen = ({ navigation }) => {
    const [recording, setRecording] = useState(null);
    const [transcription, setTranscription] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 🔴 Start Recording
    const startRecording = async () => {
        try {
            console.log("Requesting microphone permissions...");
            const { granted } = await Audio.requestPermissionsAsync();
            if (!granted) {
                alert("Permission to access microphone is required!");
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync({
                isMeteringEnabled: true,
                android: { extension: '.m4a', outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4 },
                ios: { extension: '.m4a', audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH, sampleRate: 44100, numberOfChannels: 1, bitRate: 128000, outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC },
            });

            await recording.startAsync();
            setRecording(recording);
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
        setRecording(null);
        console.log("Recording stopped. Sending audio for transcription...");
        // console.log("data: ", AudioEncoder.encode(uri))

        try {
            const transcript = await convertAudioToText(uri);
            setTranscription(transcript);

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
