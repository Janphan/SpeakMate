import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View>
            <Text>Welcome to AI Voice Chat App</Text>
            <Button title="Sign In" onPress={() => navigation.navigate('SignInScreen')} />
            <Button title="Sign Up" onPress={() => navigation.navigate('SignUpScreen')} />
        </View>
    );
}
