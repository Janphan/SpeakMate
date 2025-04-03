import { OPENAI_API_KEY } from '@env';
import * as FileSystem from 'expo-file-system';

const OPENAI_WHISPER_URL = "https://api.openai.com/v1/audio/transcriptions";

export const convertAudioToText = async (audioUri) => {
    try {
        console.log("Converting audio file to text...");

        // const audioFile = {
        //     audioUri,
        //     name: 'audio.m4a',
        //     type: 'audio/m4a',
        // };

        // Prepare form data
        // const formData = new FormData();
        // const audioFile = await FileSystem.readAsStringAsync(audioUri, { encoding: FileSystem?.EncodingType?.Base64 });
        // const audioFile = await FileSystem.getInfoAsync(audioUri);
        // if (!audioFile.exists) {
        //     console.error("File does not exist at", uri);
        //     return null;
        // }
        // formData.append("file", audioFile);
        // formData.append("file", audioUri);
        // formData.append("model", "whisper-1");
        // formData.append("language", "en");

        // Send request to OpenAI Whisper
        const response = await FileSystem.uploadAsync(OPENAI_WHISPER_URL, audioUri, {
            fieldName: 'file',
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": 'multipart/form-data',
            },
            parameters: {
                "model": "whisper-1",
            },
        })

        console.log(response)

        // const response = await fetch(OPENAI_WHISPER_URL, {
        //     method: "POST",
        //     headers: {
        //         "Authorization": `Bearer ${OPENAI_API_KEY}`,
        //         "Content-Type": 'multipart/form-data',
        //     },
        //     body: formData,
        // });

        // const data = await response.json();
        // if (data.error) {
        //     console.error("Whisper API Error:", data.error);
        //     return null;
        // }

        // console.log("Transcription:", data.text);
        // return data.text;
    } catch (error) {
        console.error("Error in Whisper STT:", error);
        return null;
    }
};
