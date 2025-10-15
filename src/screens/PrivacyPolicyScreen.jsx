import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import { colors } from '../theme';

export default function PrivacyPolicyScreen({ navigation }) {
    const privacySection = [
        {
            title: "1. Information We Collect",
            content: "We collect your voice recordings, conversation data, and basic account information (email) to provide personalized learning feedback and track your progress."
        },
        {
            title: "2. How We Use Your Data",
            content: "Your voice recordings are analyzed by AI to provide speaking feedback. We use conversation history to track your improvement and suggest better practice topics."
        },
        {
            title: "3. Data Storage & Security",
            content: "Your data is stored securely on Firebase servers with encryption. We don't share your personal information or voice recordings with third parties."
        },
        {
            title: "4. Your Data Rights",
            content: "You can view, delete, or export your data anytime through the app. If you delete your account, all your data will be permanently removed."
        },
        {
            title: "5. Cookies & Analytics",
            content: "We use minimal analytics to understand app usage and improve performance. No personal information is shared with analytics services."
        }
    ];

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerSection}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon source="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>Privacy Policy</Text>
                    <Text style={styles.subtitle}>How we protect your data</Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.contentContainer}>
                    {/* Introduction Card */}
                    <Card style={styles.introCard}>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardIconContainer}>
                                    <Icon source="shield-lock-outline" size={24} color="#5e7055" />
                                </View>
                                <Text style={styles.cardTitle}>Your Privacy Matters</Text>
                            </View>
                            <Text style={styles.introText}>
                                This is a simple overview of how SpeakMate collects, uses, and protects your personal information.
                                We're committed to keeping your data safe and private.
                            </Text>
                            <View style={styles.lastUpdatedContainer}>
                                <Icon source="calendar" size={16} color="#666" />
                                <Text style={styles.lastUpdatedText}>Draft version - September 2025</Text>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* Privacy Sections */}
                    {privacySection.map((section) => (
                        <Card key={`privacy-${section.title.replace(/\W/g, '')}`} style={styles.policyCard}>
                            <Card.Content style={styles.cardContent}>
                                <Text style={styles.policyTitle}>{section.title}</Text>
                                <Text style={styles.policyContent}>{section.content}</Text>
                            </Card.Content>
                        </Card>
                    ))}

                    {/* Contact Card */}
                    <Card style={styles.contactCard}>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.contactHeader}>
                                <Icon source="help-circle" size={24} color="#3498db" />
                                <Text style={styles.contactTitle}>Questions About Privacy?</Text>
                            </View>
                            <Text style={styles.contactText}>
                                If you have any questions about how we handle your data,
                                please contact us through the app's support feature.
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
    headerSection: {
        backgroundColor: colors.primary,
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 8,
        shadowColor: colors.shadow.color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.text.light + '20', // White with 20% opacity
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text.light,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: colors.text.light,
        opacity: 0.9,
    },
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    introCard: {
        marginBottom: 20,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: colors.background.secondary,
    },
    policyCard: {
        marginBottom: 12,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: colors.background.secondary,
    },
    contactCard: {
        marginTop: 8,
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
        marginBottom: 16,
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
    introText: {
        fontSize: 14,
        color: colors.text.secondary,
        lineHeight: 22,
        marginBottom: 16,
    },
    lastUpdatedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
    },
    lastUpdatedText: {
        fontSize: 12,
        color: colors.text.secondary,
        marginLeft: 6,
        fontStyle: 'italic',
    },
    policyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 12,
    },
    policyContent: {
        fontSize: 14,
        color: colors.text.secondary,
        lineHeight: 22,
    },
    contactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.status.info,
        marginLeft: 8,
    },
    contactText: {
        fontSize: 14,
        color: colors.status.info,
        lineHeight: 22,
        fontWeight: '500',
    },
});