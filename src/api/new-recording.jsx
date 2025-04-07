import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, NOTE_COLLECTION } from './firebaseConfig';
import { toast } from 'sonner-native';
import { convertAudioToText } from './speechToText';

const Page = () => {
    const { uri } = useLocalSearchParams();
    const [transcription, setTranscription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (uri) {
            handleTranscribe();
        }
    }, [uri]);

    const handleTranscribe = async () => {
        setIsLoading(true);
        toast.loading('Transcribing...');
        try {
            const text = await convertAudioToText(uri);
            setTranscription(text || 'No transcription available');
        } catch (error) {
            console.error('Transcription error:', error);
        } finally {
            setIsLoading(false);
            toast.dismiss();
        }
    };

    const handleSave = async () => {
        await addDoc(collection(db, NOTE_COLLECTION), {
            preview: transcription.length > 40 ? transcription.slice(0, 40) + '...' : transcription,
            text: transcription,
            createdAt: serverTimestamp(),
        });
        router.dismissAll();
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.transcriptionInput}
                multiline
                value={transcription}
                onChangeText={setTranscription}
                placeholder="Transcription will appear here..."
                editable={!isLoading}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isLoading}>
                <Text style={styles.saveButtonText}>Save Transcription</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    transcriptionInput: {
        backgroundColor: 'white',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        minHeight: 150,
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#FF9800',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
