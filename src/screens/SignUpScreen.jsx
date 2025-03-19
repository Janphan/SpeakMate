import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { auth } from '../services/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignUpScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert('Sign up successful!');
            navigation.navigate('Home');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <View>
            <Text>Sign Up</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} />
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button title="Already have an account? Sign In" onPress={() => navigation.navigate('SignIn')} />
        </View>
    );
}
