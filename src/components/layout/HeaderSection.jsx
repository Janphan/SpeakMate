import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme';

const HeaderSection = ({
    icon,
    title,
    subtitle,
    backgroundColor = colors.primary,
    iconColor = colors.text.light,
    titleColor = colors.text.light,
    subtitleColor = colors.text.light,
    children,
    showBackButton,
    onBackPress
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
            {showBackButton && (
                <TouchableOpacity
                    onPress={onBackPress}
                    style={styles.backButton}
                >
                    <Icon source="arrow-left" size={24} color={colors.text.light} />
                </TouchableOpacity>
            )}
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
    backButton: {
        position: 'absolute',
        top: 50,
        left: 10,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
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