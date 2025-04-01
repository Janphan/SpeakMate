import { Audio } from 'expo-av';

export const requestPermissions = async () => {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
        alert("Microphone permission is required!");
        return false;
    }
    return true;
};
