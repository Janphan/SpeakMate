import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PaperProvider, IconButton } from 'react-native-paper';


export default function ProgressScreen() {
    return (
        <PaperProvider>
            <View style={styles.container}>
                <IconButton
                    icon="cog"
                    size={30}
                    onPress={() => navigation.navigate("SettingsScreen")}
                    style={styles.settingsIcon} />
                <Text style={styles.text}>Progress Screen</Text>
            </View>
        </PaperProvider >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    settingsIcon: {
        position: "absolute",
        top: 40,
        right: 20,
        opacity: 0.7,
        // backgroundColor: "#fff",
        borderRadius: 50,
        elevation: 2,
        shadowColor: "#000",
    },
});