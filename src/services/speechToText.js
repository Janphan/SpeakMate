import axios from 'axios';

import { GOOGLE_API_KEY } from '@env';

export const convertAudioToText = async (audioBase64) => {
    try {
        const requestBody = {
            config: {
                encoding: "LINEAR16",
                sampleRateHertz: 44100,
                languageCode: "en-US",
            },
            audio: {
                content: audioBase64,
            },
        };

        const response = await axios.post(
            `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
            requestBody
        );

        const transcript = response.data.results?.[0]?.alternatives?.[0]?.transcript || "Could not transcribe.";
        return transcript;
    } catch (error) {
        console.error("Google STT Error:", error.message);
        // console.error("Error message", error.error.message)
        return null;
    }
};
