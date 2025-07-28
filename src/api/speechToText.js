import { OPENAI_API_KEY } from '@env';
import * as FileSystem from 'expo-file-system';

const OPENAI_WHISPER_URL = "https://api.openai.com/v1/audio/transcriptions";


export const convertAudioToText = async (audioUri) => {
    try {
        console.log("Converting audio file to text...");

        const response = await FileSystem.uploadAsync(OPENAI_WHISPER_URL, audioUri, {
            fieldName: 'file',
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            headers: {
                "Authorization": "Bearer " + OPENAI_API_KEY,
                "Content-Type": 'multipart/form-data',
            },
            parameters: {
                model: "whisper-1",
            },
        });

        if (response.status !== 200) {
            console.error("Whisper API Error:", response.body);
            return null;
        }

        const responseData = JSON.parse(response.body);
        console.log("Transcription:", responseData.text);
        return responseData.text;
    } catch (error) {
        console.error("Error in Whisper STT:", error);
        return null;
    }
};
