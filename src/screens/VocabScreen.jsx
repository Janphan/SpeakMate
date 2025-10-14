import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PaperProvider, IconButton } from 'react-native-paper';
import { colors } from '../theme';


export default function VocabScreen({ navigation }) {
    return (
        <PaperProvider>
            <IconButton
                icon="cog"
                size={30}
                onPress={() => navigation.navigate("SettingsScreen")}
                style={styles.settingsIcon} />
            <View style={styles.container}>
                <Text style={styles.text}>Vocab Screen</Text>
            </View>
        </PaperProvider>
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
        shadowColor: colors.shadow.color,
    },
});