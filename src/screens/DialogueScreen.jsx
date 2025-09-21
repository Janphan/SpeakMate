import { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert, Button } from 'react-native';
import { Audio } from 'expo-av';
import { convertAudioToText } from '../api/speechToText';
import { getOpenAIResponse } from "../api/AIService";
import AIResponseDisplay from './AIResponseDisplay';
import { IconButton } from 'react-native-paper';
import { db } from '../api/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { auth } from '../api/firebaseConfig';
import uuid from 'react-native-uuid';
import { analyzeSpeech } from '../utils/speechAnalysis';
import * as Speech from 'expo-speech';


export default function DialogueScreen({ navigation, route }) {
    const [recording, setRecording] = useState(null);
    // const [transcription, setTranscription] = useState([]);
    const [aiResponse, setAiResponse] = useState(true);
    const [msg_list, setMsgList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const [analysisResult, setAnalysisResult] = useState(null);
    const { topic, level } = route.params || {};
    const [responseDataList, setResponseDataList] = useState([]);

    console.log("DialogueScreen - Topic:", topic, "Level:", level);

    // Text-to-Speech
    const speakText = (text) => {
        Speech.speak(text, {
            language: "en-US",
            pitch: 1.0,
            rate: 1.0,
            onDone: () => {
                // Speech finished
                console.log('Speech is done!');
                setAiResponse(true);
            },
        });
    };

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
            setAiResponse(false);
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
            const responseData = await convertAudioToText(uri);
            const transcript = responseData.text;
            setResponseDataList(prev => [...prev, responseData]);
            setMsgList(previous => [...previous, { role: 'user', content: transcript }]);
            // setTranscription(previous => [...previous, transcript]);
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
        setIsLoading(true);
        // Pass topic and level here!
        const aiReply = await getOpenAIResponse(topic.title, level);
        setMsgList(previous => [...previous, { role: 'ai', content: aiReply }]);
        // setAiResponse(previous => [...previous, aiReply]);
        speakText(aiReply);
        setIsLoading(false);
    };

    // Save Conversation to Firestore
    const saveConversation = async (analysedSpeech) => {
        try {
            // When starting a new conversation
            await addDoc(collection(db, 'conversations'), {
                sessionId: uuid.v4(),
                userId: auth.currentUser ? auth.currentUser.uid : null,
                timestamp: new Date(),
                // messages: [
                //     { role: 'ai', content: aiResponse },
                //     { role: 'user', content: transcription }
                // ],
                messages: msg_list,
                topic: topic.title,
                level: level,
                header: `${topic.title} - level ${level}`,
                feedback: analysedSpeech.feedback,
                analysisResult: analysedSpeech,
            });
            console.log('Conversation saved to Firestore');
        } catch (error) {
            console.error('Error saving conversation:', error);
        }
    };

    // End the Conversation
    const endConversation = () => {
        const analysedSpeech = analyzeSpeech(responseDataList);
        console.log("Analysis Result:", analysedSpeech);
        Alert.alert(
            "End Conversation",
            "Are you sure you want to end the conversation?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "End",
                    style: "destructive",
                    onPress: async () => {
                        await saveConversation(analysedSpeech);
                        navigation.navigate("Feedback", { analysis: analysedSpeech });
                    },
                },
            ]
        );
    };

    // Build the messages array for display
    // const messages = [];
    // if (aiResponse) messages.push({ role: 'ai', content: aiResponse });
    // if (transcription) messages.push({ role: 'user', content: transcription });

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
            {/* <RecordingControls
                startRecording={startRecording}
                stopRecording={stopRecording}
                recording={recording}
            /> */}
            <View>
                <Button title="Start Recording" onPress={startRecording} disabled={!aiResponse} />
                <Button title="Stop Recording" onPress={stopRecording} disabled={recording === null} />
            </View>
            {isLoading && <ActivityIndicator size="large" color="blue" />}
            <AIResponseDisplay messages={msg_list} />
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
        top: 40,
        left: 20,
        zIndex: 10,
    },
    endButton: {
        position: 'absolute',
        bottom: 40,
        right: 20,
        zIndex: 10,
    },
});

