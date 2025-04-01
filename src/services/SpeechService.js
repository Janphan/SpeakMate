import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export async function speakText(text) {
    Speech.speak(text, {
        language: 'en-US',
        rate: 1.0,
        pitch: 1.0,
    });
}

export async function recordVoice(setTranscription) {
    try {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
            alert("Microphone permission is required!");
            return;
        }

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();

        setTimeout(async () => {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();

            // Send file to Google STT API (Assume you have an endpoint)
            const text = await sendAudioToGoogle(uri);
            setTranscription(text);
        }, 5000); // Record for 5 sec
    } catch (error) {
        console.log("Error recording:", error);
    }
}

async function sendAudioToGoogle(uri) {
    const audioBase64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

    const response = await fetch("YOUR_GOOGLE_CLOUD_STT_API_ENDPOINT", {
        method: "POST",
        headers: {
            "Authorization": `Bearer YOUR_GOOGLE_CLOUD_API_KEY`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            audio: { content: audioBase64 },
            config: { languageCode: "en-US" }
        })
    });

    const data = await response.json();
    return data.results?.[0]?.alternatives?.[0]?.transcript || "Could not transcribe";
}
