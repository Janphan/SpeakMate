import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    useAudioRecorder,
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioRecorderState,
} from 'expo-audio';
import { convertAudioToText } from '../../api/speechToText';
import { fetchSessionPlan, getNextPart1Question, getNextPart2CueCard, getNextPart3Question, resetQuestionTracking } from '../../api/AIService';
import AIResponseDisplay from './AIResponseDisplay';
import { Card, Icon } from 'react-native-paper';
import { db } from '../../api/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { auth } from '../../api/firebaseConfig';
import uuid from 'react-native-uuid';
import { analyzeSpeech } from '../../utils/speechAnalysis';
import * as Speech from 'expo-speech';
import { logger } from '../../utils/logger';
import { colors } from '../../theme';
import HeaderSection from '../../components/layout/HeaderSection';

const { width: screenWidth } = Dimensions.get('window');
const PART1_QUESTIONS = 5;
const TIMER_SECONDS = 60;

export default function DialogueScreen({ navigation, route }) {
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const recorderState = useAudioRecorderState(audioRecorder);

    const [currentPart, setCurrentPart] = useState(1);
    const [currentCueCard, setCurrentCueCard] = useState(null);
    const [aiResponse, setAiResponse] = useState(true);
    const [msg_list, setMsgList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSessionReady, setIsSessionReady] = useState(false);
    const [isSessionComplete, setIsSessionComplete] = useState(false);
    const { topic, level } = route.params || {};
    const [responseDataList, setResponseDataList] = useState([]);
    const [sessionStartTime] = useState(() => new Date());
    const [recordingAnimation] = useState(new Animated.Value(1));
    const [timerCount, setTimerCount] = useState(TIMER_SECONDS);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Initialize session
    useEffect(() => {
        resetQuestionTracking();
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
            const plan = await fetchSessionPlan(topic.title, level);
            if (plan) {
                setIsSessionReady(true);
                await startPart1();
            } else {
                // Fallback: start with a general question
                setMsgList(prev => [...prev, { role: 'ai', content: `Let's begin. Tell me about ${topic?.title?.toLowerCase() || 'yourself'}.` }]);
                setIsSessionReady(true);
                setAiResponse(true);
            }
        })();
    }, []);

    // Timer for Part 2 preparation
    useEffect(() => {
        let interval;
        if (isTimerRunning && timerCount > 0) {
            interval = setInterval(() => {
                setTimerCount(prev => prev - 1);
            }, 1000);
        } else if (timerCount === 0 && isTimerRunning) {
            setIsTimerRunning(false);
            setAiResponse(true);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timerCount]);

    // Recording animation
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

    const speakText = (text, onDone) => {
        Speech.speak(text, {
            language: "en-US",
            pitch: 1.0,
            rate: 1.0,
            onDone: () => {
                setAiResponse(true);
                if (onDone) onDone();
            },
        });
    };

    // ===== PART 1: Questions & Answers =====
    const startPart1 = async () => {
        setCurrentPart(1);
        const question = getNextPart1Question();
        const aiMsg = question || `Let's begin. Tell me about ${topic?.title?.toLowerCase() || 'yourself'}.`;
        setMsgList(prev => [...prev, { role: 'ai', content: `📌 Part 1 — Let's start with some questions about you.` }]);
        setTimeout(() => {
            setMsgList(prev => [...prev, { role: 'ai', content: aiMsg }]);
            speakText(aiMsg);
        }, 500);
    };

    const handlePart1Answer = async () => {
        const question = getNextPart1Question();
        if (question && usedQuestionCount(1) < PART1_QUESTIONS) {
            const aiMsg = question;
            setMsgList(prev => [...prev, { role: 'ai', content: aiMsg }]);
            speakText(aiMsg);
        } else {
            // Move to Part 2
            startPart2();
        }
    };

    // ===== PART 2: Cue Card =====
    const startPart2 = () => {
        setCurrentPart(2);
        const card = getNextPart2CueCard();
        if (card) {
            setCurrentCueCard(card);
            const intro = `📌 Part 2 — Now I'm going to give you a topic. You'll have one minute to prepare, then speak for up to two minutes.`;
            setMsgList(prev => [...prev, { role: 'ai', content: intro }]);
            setTimeout(() => {
                speakText(intro, () => {
                    const cardMsg = `${card.cueCard}\n\nYou should say:\n${card.prompts.map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
                    setMsgList(prev => [...prev, { role: 'ai', content: cardMsg }]);
                    // Start preparation timer
                    setTimerCount(TIMER_SECONDS);
                    setIsTimerRunning(true);
                    setAiResponse(false);
                });
            }, 500);
        } else {
            startPart3();
        }
    };

    const handlePart2Recording = async () => {
        // After recording Part 2 answer, move to Part 3
        startPart3();
    };

    // ===== PART 3: Discussion =====
    const startPart3 = () => {
        setCurrentPart(3);
        const intro = `📌 Part 3 — Let's discuss some more abstract questions related to this topic.`;
        setMsgList(prev => [...prev, { role: 'ai', content: intro }]);
        setTimeout(() => {
            speakText(intro, () => {
                const question = getNextPart3Question();
                if (question) {
                    setMsgList(prev => [...prev, { role: 'ai', content: question }]);
                    speakText(question);
                } else {
                    handleSessionComplete();
                }
            });
        }, 500);
    };

    const handlePart3Answer = async () => {
        const question = getNextPart3Question();
        if (question) {
            setMsgList(prev => [...prev, { role: 'ai', content: question }]);
            speakText(question);
        } else {
            handleSessionComplete();
        }
    };

    const usedQuestionCount = (part) => {
        if (part === 1) return msg_list.filter(m => m.role === 'ai' && !m.content.startsWith('📌')).length;
        return 0;
    };

    const handleSessionComplete = () => {
        setIsSessionComplete(true);
        const wrapUp = `Great work! You've completed all three parts of this IELTS speaking practice. Let's review your performance.`;
        setMsgList(prev => [...prev, { role: 'ai', content: wrapUp }]);
        speakText(wrapUp);
    };

    // ===== RECORDING =====
    const startRecording = async () => {
        try {
            await audioRecorder.prepareToRecordAsync();
            audioRecorder.record();
            setAiResponse(false);
        } catch (err) {
            logger.error('Failed to start recording', { error: err.message });
            Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
        }
    };

    const stopRecording = async () => {
        setIsLoading(true);
        try {
            await audioRecorder.stop();
            const uri = audioRecorder.uri;
            if (!uri) {
                setIsLoading(false);
                return;
            }
            const responseData = await convertAudioToText(uri);
            const transcript = responseData.text;
            setResponseDataList(prev => [...prev, responseData]);
            setMsgList(prev => [...prev, { role: 'user', content: transcript }]);

            if (transcript) {
                if (currentPart === 1) {
                    await handlePart1Answer();
                } else if (currentPart === 2) {
                    await handlePart2Recording();
                } else if (currentPart === 3) {
                    await handlePart3Answer();
                }
            }
            setIsLoading(false);
        } catch (error) {
            logger.error('Transcription error', { error: error.message });
            setIsLoading(false);
            Alert.alert('Transcription Error', 'Failed to transcribe audio. Please try again.');
        }
    };

    // ===== SAVE & END =====
    const saveConversation = async (analysedSpeech) => {
        try {
            const sessionEndTime = new Date();
            const sessionDuration = sessionStartTime
                ? Math.round((sessionEndTime - sessionStartTime) / 1000)
                : 0;
            await addDoc(collection(db, 'conversations'), {
                sessionId: uuid.v4(),
                userId: auth.currentUser ? auth.currentUser.uid : null,
                timestamp: new Date(),
                sessionStartTime: sessionStartTime,
                sessionEndTime: sessionEndTime,
                sessionDuration: sessionDuration,
                messages: msg_list,
                topic: topic.title,
                level: level,
                header: `${topic.title} - level ${level}`,
                feedback: analysedSpeech.feedback,
                analysisResult: analysedSpeech,
            });
        } catch (error) {
            logger.error('Error saving conversation', { error: error.message });
        }
    };

    const endConversation = () => {
        const analysedSpeech = analyzeSpeech(responseDataList);
        Alert.alert(
            "End Session",
            "Are you sure you want to end this practice session?",
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

    const getPartLabel = () => {
        if (currentPart === 1) return 'Part 1: Introduction';
        if (currentPart === 2) return 'Part 2: Cue Card';
        return 'Part 3: Discussion';
    };

    if (!isSessionReady) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingCentered}>
                    <Icon source="message-processing" size={60} color={colors.primary} />
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
                    <Text style={styles.loadingCenteredText}>Preparing your IELTS practice session...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderSection
                title="🎤 IELTS Speaking Practice"
                subtitle={`${topic?.title} • ${level} • ${getPartLabel()}`}
                showBackButton
                onBackPress={() => navigation.navigate("HomeScreen")}
            />

            {isTimerRunning && currentPart === 2 && (
                <View style={styles.timerBanner}>
                    <Icon source="timer" size={20} color="#fff" />
                    <Text style={styles.timerText}>Prepare your answer: {Math.floor(timerCount / 60)}:{(timerCount % 60).toString().padStart(2, '0')}</Text>
                </View>
            )}

            {isTimerRunning && currentPart === 2 && timerCount > 0 && (
                <View style={styles.preparationContainer}>
                    <Card style={styles.cueCard}>
                        <Card.Content>
                            <Text style={styles.cueCardLabel}>Cue Card</Text>
                            <Text style={styles.cueCardText}>{currentCueCard?.cueCard}</Text>
                            <View style={styles.promptsContainer}>
                                {currentCueCard?.prompts?.map((p, i) => (
                                    <View key={i} style={styles.promptRow}>
                                        <Text style={styles.promptBullet}>•</Text>
                                        <Text style={styles.promptText}>{p}</Text>
                                    </View>
                                ))}
                            </View>
                            <Text style={styles.preparationHint}>Prepare your answer. When the timer ends, tap the microphone to speak.</Text>
                        </Card.Content>
                    </Card>
                </View>
            )}

            {(!isTimerRunning || currentPart !== 2) && (
                <>
                    <View style={styles.mainContent}>
                        <Card style={styles.statusCard}>
                            <Card.Content style={styles.statusCardContent}>
                                <View style={styles.statusHeader}>
                                    <Icon
                                        source={currentPart === 1 ? "numeric-1-circle" : currentPart === 2 ? "numeric-2-circle" : "numeric-3-circle"}
                                        size={28}
                                        color={currentPart === 1 ? "#4caf50" : currentPart === 2 ? "#ff9800" : "#2196f3"}
                                    />
                                    <Text style={styles.statusText}>
                                        {isLoading
                                            ? "Processing your speech..."
                                            : isSessionComplete
                                                ? "Session complete! Review your feedback."
                                                : currentPart === 1
                                                    ? "Answer each question naturally."
                                                    : currentPart === 2
                                                        ? "Speak for 1-2 minutes on this topic."
                                                        : "Discuss these questions in depth."
                                        }
                                    </Text>
                                </View>
                                {isLoading && (
                                    <View style={styles.loadingRow}>
                                        <ActivityIndicator size="small" color={colors.primary} />
                                        <Text style={styles.loadingRowText}>Analyzing your speech...</Text>
                                    </View>
                                )}
                            </Card.Content>
                        </Card>

                        <View style={styles.controlsContainer}>
                            {aiResponse && !isSessionComplete && (
                                <Animated.View style={[styles.recordButtonContainer, { transform: [{ scale: recordingAnimation }] }]}>
                                    <TouchableOpacity
                                        style={[styles.recordButton, recorderState.isRecording ? styles.recordingButton : styles.readyButton]}
                                        onPress={recorderState.isRecording ? stopRecording : startRecording}
                                        disabled={!aiResponse && !recorderState.isRecording}
                                        activeOpacity={0.8}
                                    >
                                        <Icon
                                            source={recorderState.isRecording ? "stop" : "microphone"}
                                            size={28}
                                            color="#fff"
                                        />
                                    </TouchableOpacity>
                                </Animated.View>
                            )}
                            {!aiResponse && currentPart === 2 && !isTimerRunning && (
                                <TouchableOpacity
                                    style={styles.recordButton}
                                    onPress={startRecording}
                                    activeOpacity={0.8}
                                >
                                    <Icon source="microphone" size={28} color="#fff" />
                                </TouchableOpacity>
                            )}
                            <Text style={styles.recordButtonLabel}>
                                {isSessionComplete
                                    ? "Session Completed"
                                    : recorderState.isRecording
                                        ? "Tap to stop"
                                        : aiResponse && currentPart !== 2
                                            ? "Tap to speak"
                                            : currentPart === 2 && !isTimerRunning
                                                ? "Tap to speak your answer"
                                                : currentPart === 2 && isTimerRunning
                                                    ? "Preparing..."
                                                    : ""
                                }
                            </Text>
                        </View>

                        <View style={styles.messagesContainer}>
                            <AIResponseDisplay messages={msg_list} />
                        </View>
                    </View>

                    {isSessionComplete && (
                        <TouchableOpacity
                            style={styles.endConversationButton}
                            onPress={endConversation}
                            activeOpacity={0.8}
                        >
                            <Icon source="check-circle" size={24} color="#fff" />
                            <Text style={styles.endConversationText}>View Feedback</Text>
                        </TouchableOpacity>
                    )}

                    {!isSessionComplete && !isTimerRunning && (
                        <TouchableOpacity
                            style={styles.endConversationButton}
                            onPress={endConversation}
                            activeOpacity={0.8}
                        >
                            <Icon source="close-circle" size={24} color="#fff" />
                            <Text style={styles.endConversationText}>End Session Early</Text>
                        </TouchableOpacity>
                    )}
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    loadingCentered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingCenteredText: {
        marginTop: 16,
        fontSize: 16,
        color: colors.text.secondary,
    },
    timerBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.status.warning,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    timerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 8,
    },
    preparationContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        flex: 1,
    },
    cueCard: {
        borderRadius: 16,
        elevation: 4,
        backgroundColor: colors.background.secondary,
    },
    cueCardLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.status.warning,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
    },
    cueCardText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text.primary,
        lineHeight: 28,
        marginBottom: 16,
    },
    promptsContainer: {
        marginBottom: 16,
    },
    promptRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    promptBullet: {
        fontSize: 16,
        color: colors.primary,
        marginRight: 8,
        fontWeight: 'bold',
    },
    promptText: {
        fontSize: 15,
        color: colors.text.secondary,
        flex: 1,
        lineHeight: 22,
    },
    preparationHint: {
        fontSize: 13,
        color: colors.text.secondary,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 8,
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: Math.max(16, screenWidth * 0.04),
        paddingVertical: 16,
        paddingBottom: 20,
    },
    statusCard: {
        borderRadius: 16,
        elevation: 4,
        backgroundColor: colors.background.secondary,
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
        color: colors.text.primary,
        marginLeft: 12,
        flex: 1,
        lineHeight: 22,
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    loadingRowText: {
        fontSize: 14,
        color: colors.text.secondary,
        marginLeft: 10,
        fontStyle: 'italic',
    },
    controlsContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    recordButtonContainer: {
        marginBottom: 10,
    },
    recordButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: colors.shadow.color,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        backgroundColor: colors.status.success,
    },
    recordingButton: {
        backgroundColor: colors.status.error,
    },
    readyButton: {
        backgroundColor: colors.status.success,
    },
    recordButtonLabel: {
        fontSize: 14,
        color: colors.text.secondary,
        textAlign: 'center',
        fontWeight: '500',
    },
    messagesContainer: {
        flex: 1,
        borderRadius: 16,
        backgroundColor: colors.background.secondary,
        elevation: 2,
    },
    endConversationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        marginHorizontal: 20,
        marginBottom: 20,
        paddingVertical: 15,
        borderRadius: 12,
        elevation: 4,
        shadowColor: colors.shadow.color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    endConversationText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.light,
        marginLeft: 8,
    },
});
