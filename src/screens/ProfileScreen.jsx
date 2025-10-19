import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { colors } from '../theme';
import HeaderSection from '../components/HeaderSection';

export default function ProfileScreen({ navigation }) {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const auth = getAuth();
    const storage = getStorage();
    const user = auth.currentUser;

    useEffect(() => {
        if (user?.photoURL) {
            setImage(user.photoURL);
        }
    }, [user]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            uploadImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri) => {
        try {
            setUploading(true);
            const response = await fetch(uri);
            const blob = await response.blob();
            const storageRef = ref(storage, `profilePhotos/${auth.currentUser.uid}.jpg`);
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            await updateProfile(auth.currentUser, { photoURL: downloadURL });
            Alert.alert("Success", "Profile photo updated!");
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setUploading(false);
        }
    };

    const formatJoinDate = (user) => {
        if (user?.metadata?.creationTime) {
            return new Date(user.metadata.creationTime).toLocaleDateString();
        }
        return 'Recently joined';
    };

    return (
        <View style={styles.container}>
            <HeaderSection
                title="Profile"
                subtitle="Manage your account information"
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            {/* Content */}
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.contentContainer}>
                    {/* Profile Photo Card */}
                    <Card style={styles.profileCard}>
                        <Card.Content style={styles.profileCardContent}>
                            <View style={styles.profilePhotoSection}>
                                <View style={styles.profilePhotoContainer}>
                                    {image ? (
                                        <Image source={{ uri: image }} style={styles.profilePhoto} />
                                    ) : (
                                        <View style={styles.defaultAvatar}>
                                            <Icon source="account" size={60} color="#5e7055" />
                                        </View>
                                    )}
                                    <TouchableOpacity
                                        style={styles.cameraButton}
                                        onPress={pickImage}
                                        disabled={uploading}
                                    >
                                        <Icon
                                            source={uploading ? "loading" : "camera"}
                                            size={16}
                                            color="#fff"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.photoInstruction}>
                                    {uploading ? 'Uploading...' : 'Tap camera icon to change photo'}
                                </Text>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* User Info Card */}
                    <Card style={styles.infoCard}>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardIconContainer}>
                                    <Icon source="account-circle" size={24} color="#5e7055" />
                                </View>
                                <Text style={styles.cardTitle}>Account Information</Text>
                            </View>

                            <View style={styles.infoSection}>
                                <View style={styles.infoRow}>
                                    <Icon source="account" size={20} color="#666" />
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>Display Name</Text>
                                        <Text style={styles.infoValue}>
                                            {user?.displayName || 'Not set'}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.infoRow}>
                                    <Icon source="email" size={20} color="#666" />
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>Email Address</Text>
                                        <Text style={styles.infoValue}>
                                            {user?.email || 'Not available'}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.infoRow}>
                                    <Icon source="calendar" size={20} color="#666" />
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>Member Since</Text>
                                        <Text style={styles.infoValue}>
                                            {formatJoinDate(user)}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.infoRow}>
                                    <Icon source={user?.emailVerified ? "check-circle" : "alert-circle"}
                                        size={20}
                                        color={user?.emailVerified ? colors.status.success : colors.status.error} />
                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>Email Status</Text>
                                        <Text style={[
                                            styles.infoValue,
                                            { color: user?.emailVerified ? colors.status.success : colors.status.error }
                                        ]}>
                                            {user?.emailVerified ? 'Verified' : 'Not verified'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* Help Card */}
                    <Card style={styles.helpCard}>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.helpHeader}>
                                <Icon source="information" size={24} color="#3498db" />
                                <Text style={styles.helpTitle}>Profile Help</Text>
                            </View>
                            <Text style={styles.helpText}>
                                Your profile photo and display name help personalize your SpeakMate experience.
                                Your email is used for account security and important updates.
                            </Text>
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    profileCard: {
        marginBottom: 20,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: colors.background.secondary,
    },
    profileCardContent: {
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    profilePhotoSection: {
        alignItems: 'center',
    },
    profilePhotoContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    profilePhoto: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: colors.primary,
    },
    defaultAvatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: colors.primary,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: colors.shadow.color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    photoInstruction: {
        fontSize: 14,
        color: colors.text.secondary,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    infoCard: {
        marginBottom: 16,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: colors.background.secondary,
    },
    helpCard: {
        borderRadius: 16,
        elevation: 2,
        backgroundColor: colors.status.info + '20', // Light blue background
        borderWidth: 1,
        borderColor: colors.status.info + '40', // Slightly darker blue border
    },
    cardContent: {
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    cardIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.primary,
    },
    infoSection: {
        gap: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoContent: {
        marginLeft: 12,
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: colors.text.secondary,
        fontWeight: '500',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        color: colors.text.primary,
        fontWeight: '500',
    },
    helpHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    helpTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.status.info,
        marginLeft: 8,
    },
    helpText: {
        fontSize: 14,
        color: colors.status.info,
        lineHeight: 22,
        fontWeight: '500',
    },
});