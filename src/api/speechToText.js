import axios from "axios";
import { OPENAI_API_KEY } from "@env";
import { logger } from '../utils/logger';

export const convertAudioToText = async (audioUri) => {
    try {
        const formData = new FormData();
        formData.append("file", {
            uri: audioUri,
            type: "audio/m4a",
            name: "speech.m4a",
        });
        formData.append("model", "whisper-1");
        formData.append("response_format", "verbose_json");
        formData.append("timestamp_granularities[]", "word");
        formData.append("timestamp_granularities[]", "segment");

        const response = await axios.post(
            "https://api.openai.com/v1/audio/transcriptions",
            formData,
            {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        logger.info('Transcription response data', response.data);
        logger.info('Transcription text', response.data.text);
        return response.data;
    } catch (error) {
        logger.error('Axios upload error', error);
        return null;
    }
};
