import axios from "axios";
import { OPENAI_API_KEY } from "@env";

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
        console.log("Transcription response data:", response.data);
        console.log("Transcription:", response.data.text);
        return response.data;
    } catch (error) {
        console.error("Axios upload error:", error);
        return null;
    }
};
