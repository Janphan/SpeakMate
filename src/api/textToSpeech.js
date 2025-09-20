import * as Speech from 'expo-speech';

export const speakText = (text) => {
    Speech.speak(text, {
        language: "en-US",
        pitch: 1.0,
        rate: 1.0,
        onDone: () => {
            // Speech finished
            console.log('Speech is done!');
            return true;
        },
    });
};
