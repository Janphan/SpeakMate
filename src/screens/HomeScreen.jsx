import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { PaperProvider, Menu, Button } from 'react-native-paper';
import * as Speech from 'expo-speech';
import { getAuth } from 'firebase/auth';

export default function HomeScreen({ navigation }) {
    const [visible, setVisible] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState('Band 5-6');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        setUser(auth.currentUser);
    }, []);

    return (
        <PaperProvider>
            <View style={styles.container}>
                {/* User Info */}
                {user && (
                    <View style={styles.userInfo}>
                        {user.photoURL && (
                            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
                        )}
                        <Text style={styles.userName}>Welcome {user.displayName || "No Name"}</Text>
                        {/* <Text style={styles.userEmail}>{user.email}</Text> */}
                    </View>
                )}

                {/* Level Selection Menu */}
                <View style={styles.menuContainer}>
                    <Text style={styles.menuTitle}>Choose Your Level</Text>
                    <Menu
                        visible={visible}
                        onDismiss={() => setVisible(false)}
                        anchor={
                            <Button mode="outlined" onPress={() => setVisible(true)}>
                                {selectedLevel}
                            </Button>
                        }
                    >
                        <Menu.Item
                            onPress={() => {
                                setSelectedLevel('band 5-6');
                                setVisible(false);
                            }}
                            title="band 5-6"
                        />
                        {/* Add more Menu.Item for other bands if needed */}
                    </Menu>
                </View>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    userInfo: {
        alignItems: "center",
        marginBottom: 24,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginBottom: 8,
    },
    userName: {
        fontSize: 20,
        fontWeight: "bold",
    },
    userEmail: {
        fontSize: 16,
        color: "#666",
    },
    menuContainer: {
        padding: 16,
        alignItems: "center",
    },
    menuTitle: {
        fontSize: 18,
        marginBottom: 8,
    },
});
