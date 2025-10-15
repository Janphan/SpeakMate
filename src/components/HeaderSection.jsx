import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

const HeaderSection = ({
    icon,
    title,
    subtitle,
    backgroundColor = colors.primary,
    iconColor = colors.text.light,
    titleColor = colors.text.light,
    subtitleColor = colors.text.light,
    children
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[
            styles.headerSection,
            {
                backgroundColor,
                paddingTop: insets.top + 20
            }
        ]}>
            <View style={styles.headerContent}>
                {icon && <Icon source={icon} size={40} color={iconColor} />}
                {title && <Text style={[styles.title, { color: titleColor }]}>{title}</Text>}
                {subtitle && <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>}
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerSection: {
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 8,
        shadowColor: colors.shadow.color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    headerContent: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.9,
        textAlign: 'center',
    },
});

export default HeaderSection;