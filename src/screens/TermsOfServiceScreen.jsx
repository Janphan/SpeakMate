import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import { colors } from '../theme';
import HeaderSection from '../components/HeaderSection';

export default function TermsOfServiceScreen({ navigation }) {
    const termsSection = [
        {
            title: "1. Acceptance of Terms",
            content: "By using SpeakMate, you agree to these terms. If you don't agree, please don't use the app."
        },
        {
            title: "2. How SpeakMate Works",
            content: "SpeakMate is an AI-powered app that helps you practice English speaking. We analyze your voice to provide feedback and track your progress."
        },
        {
            title: "3. Your Data & Privacy",
            content: "We collect voice recordings and conversation data to improve your learning experience. Your data is kept secure and used only for educational purposes."
        },
        {
            title: "4. Your Responsibilities",
            content: "Use the app respectfully and for learning purposes only. Keep your account information secure and don't share inappropriate content."
        },
        {
            title: "5. Service Availability",
            content: "We try to keep SpeakMate available 24/7, but sometimes we need maintenance or updates. The service may be temporarily unavailable."
        },
        {
            title: "6. Changes to Terms",
            content: "We may update these terms occasionally. We'll notify you of important changes through the app."
        }
    ];

    return (
        <View style={styles.container}>
            <HeaderSection
                title="Terms of Service"
                subtitle="Please read these terms carefully"
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            {/* Content */}
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.contentContainer}>
                    {/* Introduction Card */}
                    <Card style={styles.introCard}>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardIconContainer}>
                                    <Icon source="file-document-outline" size={24} color={colors.primary} />
                                </View>
                                <Text style={styles.cardTitle}>Terms & Conditions</Text>
                            </View>
                            <Text style={styles.introText}>
                                These are the basic terms for using SpeakMate. This is a draft version -
                                we keep it simple so you can easily understand your rights and responsibilities.
                            </Text>
                            <View style={styles.lastUpdatedContainer}>
                                <Icon source="calendar" size={16} color={colors.text.secondary} />
                                <Text style={styles.lastUpdatedText}>Draft version - September 2025</Text>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* Terms Sections */}
                    {termsSection.map((section) => (
                        <Card key={`terms-${section.title.replace(/\W/g, '')}`} style={styles.termCard}>
                            <Card.Content style={styles.cardContent}>
                                <Text style={styles.termTitle}>{section.title}</Text>
                                <Text style={styles.termContent}>{section.content}</Text>
                            </Card.Content>
                        </Card>
                    ))}

                    {/* Agreement Card */}
                    <Card style={styles.agreementCard}>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.agreementHeader}>
                                <Icon source="check-circle" size={24} color={colors.status.success} />
                                <Text style={styles.agreementTitle}>Agreement Confirmation</Text>
                            </View>
                            <Text style={styles.agreementText}>
                                By continuing to use SpeakMate, you acknowledge that you have read, understood,
                                and agree to be bound by these Terms of Service.
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
    introCard: {
        marginBottom: 20,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: colors.background.secondary,
    },
    termCard: {
        marginBottom: 12,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: colors.background.secondary,
    },
    agreementCard: {
        marginTop: 8,
        borderRadius: 16,
        elevation: 2,
        backgroundColor: colors.status.successLight,
        borderWidth: 1,
        borderColor: colors.status.success,
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
    termTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 12,
    },
    termContent: {
        fontSize: 14,
        color: colors.text.secondary,
        lineHeight: 22,
    },
    agreementHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    agreementTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.status.success,
        marginLeft: 8,
    },
    agreementText: {
        fontSize: 14,
        color: colors.status.success,
        lineHeight: 22,
        fontWeight: '500',
    },
});