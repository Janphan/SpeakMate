import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { PaperProvider, Menu, Button, IconButton } from 'react-native-paper';
import * as Speech from 'expo-speech';
import { getAuth } from 'firebase/auth';

export default function HomeScreen({ navigation }) {
    const [visible, setVisible] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState('Band 5-6');
    const [user, setUser] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        setUser(auth.currentUser);
    }, []);

    return (
        <PaperProvider>
            <View style={styles.container}>
                {/* Cog Icon with Menu - absolute position */}
                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <IconButton
                            icon="cog"
                            size={30}
                            onPress={() => navigation.navigate("SettingsScreen")}
                            style={styles.settingsIcon}
                        />
                    }
                >
                    <Menu.Item
                        onPress={() => {
                            setMenuVisible(false);
                            navigation.navigate("SettingsScreen");
                        }}
                        title="Settings"
                    />
                    <Menu.Item
                        onPress={() => {
                            setMenuVisible(false);
                            navigation.navigate("SignOutScreen");
                        }}
                        title="Log Out"
                    />
                </Menu>

                {/* Main Content */}
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}>

                    {/* User Info */}
                    {user && (
                        <View style={styles.userInfo}>
                            {user.photoURL && (
                                <Image source={{ uri: user.photoURL }} style={styles.avatar} />
                            )}
                            <Text style={styles.userName}>Welcome {user.displayName || "No Name"}</Text>
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
                        </Menu>
                    </View>
                </View>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    menuContainer: {
        padding: 16,
        alignItems: "center",
    },
    menuTitle: {
        fontSize: 18,
        marginBottom: 8,
    },
    settingsIcon: {
        position: "absolute",
        top: 40,
        right: 20,
        opacity: 0.7,
        borderRadius: 50,
        elevation: 2,
        shadowColor: "#000",
        backgroundColor: "#fff",
        zIndex: 10,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 80,
    },
});
