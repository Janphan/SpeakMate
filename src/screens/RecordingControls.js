import React from 'react';
import { View, Button } from 'react-native';

const RecordingControls = ({ startRecording, stopRecording, recording }) => {
    return (
        <View>
            <Button title="Start Recording" onPress={startRecording} disabled={recording !== null} />
            <Button title="Stop Recording" onPress={stopRecording} disabled={recording === null} />
        </View>
    );
};

export default RecordingControls;
