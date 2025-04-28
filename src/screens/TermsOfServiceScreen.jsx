import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

export default function TermsOfServiceScreen({ navigation }) {
    return (
        <View style={styles.container}>
            {/* Go Back Button */}
            <IconButton
                icon="arrow-left"
                size={24}
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            />
            <Text style={styles.text}>Terms of Service Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
});