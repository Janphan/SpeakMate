import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert, TouchableOpacity, Animated } from 'react-native';
import {
    useAudioRecorder,
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioRecorderState,
} from 'expo-audio';
import { convertAudioToText } from '../api/speechToText';
import { getOpenAIResponse, resetQuestionTracking } from "../api/AIService";
import AIResponseDisplay from './AIResponseDisplay';
import { IconButton, Card, Icon } from 'react-native-paper';
import { db } from '../api/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { auth } from '../api/firebaseConfig';
import uuid from 'react-native-uuid';
import { analyzeSpeech } from '../utils/speechAnalysis';
import * as Speech from 'expo-speech';
import { logger } from '../utils/logger';


export default function DialogueScreen({ navigation, route }) {
    // Use expo-audio hooks
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const recorderState = useAudioRecorderState(audioRecorder);
    const [aiResponse, setAiResponse] = useState(true);
    const [msg_list, setMsgList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { topic, level } = route.params || {};
    const [responseDataList, setResponseDataList] = useState([]);
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [recordingAnimation] = useState(new Animated.Value(1));

    // Initialize session start time and setup audio permissions
    useEffect(() => {
        setSessionStartTime(new Date());

        // Reset question tracking for new conversation
        resetQuestionTracking();

        // Setup audio permissions and mode
        (async () => {
            const status = await AudioModule.requestRecordingPermissionsAsync();
            if (!status.granted) {
                Alert.alert('Permission Required', 'Permission to access microphone was denied');
                return;
            }
            await setAudioModeAsync({
                playsInSilentMode: true,
                allowsRecording: true,
            });
        })();
    }, []);

    // Animation for recording button
    useEffect(() => {
        if (recorderState.isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(recordingAnimation, {
                        toValue: 1.2,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(recordingAnimation, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            recordingAnimation.setValue(1);
        }
    }, [recorderState.isRecording]);

    // Text-to-Speech
    const speakText = (text) => {
        Speech.speak(text, {
            language: "en-US",
            pitch: 1.0,
            rate: 1.0,
            onDone: () => {
                setAiResponse(true);
            },
        });
    };

    // Start Recording
    const startRecording = async () => {
        try {
            await audioRecorder.prepareToRecordAsync();
            audioRecorder.record();
            setAiResponse(false);
        } catch (err) {
            console.error('Failed to start recording', err);
            Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
        }
    };    // Stop Recording & Process Audio
    const stopRecording = async () => {
        setIsLoading(true);

        try {
            await audioRecorder.stop();
            const uri = audioRecorder.uri;

            logger.info("uri: ", uri);
            logger.info("Recording stopped. Sending audio for transcription...");

            if (!uri) {
                logger.error('Failed to get URI for recording');
                setIsLoading(false);
                return;
            }

            const responseData = await convertAudioToText(uri);
            const transcript = responseData.text;
            setResponseDataList(prev => [...prev, responseData]);
            setMsgList(previous => [...previous, { role: 'user', content: transcript }]);
            logger.info("transcript", transcript);

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
        const aiReply = await getOpenAIResponse(topic.title, level);
        setMsgList(previous => [...previous, { role: 'ai', content: aiReply }]);
        speakText(aiReply);
        setIsLoading(false);
    };

    // Save Conversation to Firestore
    const saveConversation = async (analysedSpeech) => {
        try {
            const sessionEndTime = new Date();
            const sessionDuration = sessionStartTime
                ? Math.round((sessionEndTime - sessionStartTime) / 1000)
                : 0;

            // When starting a new conversation
            await addDoc(collection(db, 'conversations'), {
                sessionId: uuid.v4(),
                userId: auth.currentUser ? auth.currentUser.uid : null,
                timestamp: new Date(),
                sessionStartTime: sessionStartTime,
                sessionEndTime: sessionEndTime,
                sessionDuration: sessionDuration, // in seconds
                messages: msg_list,
                topic: topic.title,
                level: level,
                header: `${topic.title} - level ${level}`,
                feedback: analysedSpeech.feedback,
                analysisResult: analysedSpeech,
            });
            logger.info('Conversation saved to Firestore');
        } catch (error) {
            logger.error('Error saving conversation', {
                error: error.message
            });
        }
    };

    // End the Conversation
    const endConversation = () => {
        const analysedSpeech = analyzeSpeech(responseDataList);
        logger.info("Analysis Result:", analysedSpeech);
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

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerSection}>
                <IconButton
                    icon="arrow-left"
                    size={24}
                    iconColor="#fff"
                    onPress={() => navigation.navigate("HomeScreen")}
                    style={styles.backButton}
                />
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>🎤 AI Voice Practice</Text>
                    <Text style={styles.headerSubtitle}>
                        {topic?.title} • {level}
                    </Text>
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
                {/* Status Card */}
                <Card style={styles.statusCard}>
                    <Card.Content style={styles.statusCardContent}>
                        <View style={styles.statusHeader}>
                            <Icon
                                source={aiResponse ? "robot-happy" : "account-voice"}
                                size={28}
                                color={aiResponse ? "#4caf50" : "#2196f3"}
                            />
                            <Text style={styles.statusText}>
                                {isLoading
                                    ? "Processing your speech..."
                                    : aiResponse
                                        ? "Ready to listen! Tap the microphone to speak"
                                        : "Recording... Speak clearly"
                                }
                            </Text>
                        </View>
                        {isLoading && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#5e7055" />
                                <Text style={styles.loadingText}>Analyzing your speech...</Text>
                            </View>
                        )}
                    </Card.Content>
                </Card>

                {/* Recording Controls */}
                <View style={styles.controlsContainer}>
                    <Animated.View style={[
                        styles.recordButtonContainer,
                        { transform: [{ scale: recordingAnimation }] }
                    ]}>
                        <TouchableOpacity
                            style={[
                                styles.recordButton,
                                recorderState.isRecording ? styles.recordingButton : styles.readyButton,
                                !aiResponse && !recorderState.isRecording ? styles.disabledButton : null
                            ]}
                            onPress={recorderState.isRecording ? stopRecording : startRecording}
                            disabled={!aiResponse && !recorderState.isRecording}
                            activeOpacity={0.8}
                        >
                            <Icon
                                source={recorderState.isRecording ? "stop" : "microphone"}
                                size={40}
                                color="#fff"
                            />
                        </TouchableOpacity>
                    </Animated.View>
                    <Text style={styles.recordButtonLabel}>
                        {recorderState.isRecording ? "Tap to stop recording" : "Tap to start speaking"}
                    </Text>
                </View>

                {/* Messages Display */}
                <View style={styles.messagesContainer}>
                    <AIResponseDisplay messages={msg_list} />
                </View>
            </View>

            {/* End Conversation Button */}
            <TouchableOpacity
                style={styles.endConversationButton}
                onPress={endConversation}
                activeOpacity={0.8}
            >
                <Icon source="check-circle" size={24} color="#fff" />
                <Text style={styles.endConversationText}>Finish Session</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerSection: {
        backgroundColor: '#5e7055',
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        marginRight: 10,
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
        marginTop: 30,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#c8e6c9',
        fontWeight: '500',
    },
    mainContent: {
        flex: 1,
        padding: 20,
    },
    statusCard: {
        borderRadius: 16,
        elevation: 4,
        backgroundColor: '#fff',
        marginBottom: 30,
    },
    statusCardContent: {
        padding: 20,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    statusText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
        flex: 1,
        lineHeight: 22,
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 15,
    },
    loadingText: {
        fontSize: 14,
        color: '#666',
        marginTop: 10,
        fontStyle: 'italic',
    },
    controlsContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    recordButtonContainer: {
        marginBottom: 15,
    },
    recordButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    readyButton: {
        backgroundColor: '#4caf50',
    },
    recordingButton: {
        backgroundColor: '#f44336',
    },
    disabledButton: {
        backgroundColor: '#bdbdbd',
        elevation: 2,
    },
    recordButtonLabel: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        fontWeight: '500',
    },
    messagesContainer: {
        flex: 1,
        borderRadius: 16,
        backgroundColor: '#fff',
        elevation: 2,
        // Removed overflow: 'hidden' to allow scrolling
    },
    endConversationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5e7055',
        marginHorizontal: 20,
        marginBottom: 20,
        paddingVertical: 15,
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    endConversationText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 8,
    },
});

