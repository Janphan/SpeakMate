import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import HomeScreen from "../screens/HomeScreen"
import StatisticsScreen from '../screens/StatisticsScreen';
import CallsScreen from '../screens/CallsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

// Helper function to get icon name
const getTabIconName = (routeName, focused) => {
    if (routeName === 'Calls') {
        return focused ? 'call' : 'call-outline';
    } else if (routeName === 'Progress') {
        return focused ? 'bar-chart' : 'bar-chart-outline';
    } else if (routeName === 'Settings') {
        return focused ? 'settings' : 'settings-outline';
    } else if (routeName === 'Home') {
        return focused ? 'home' : 'home-outline';
    }
    return 'home-outline';
};

// Tab Navigator for Calls, Progress, and Settings
export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: route.name !== 'Home',
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    backgroundColor: '#c2e4ab',
                    borderTopWidth: 0,
                },
                tabBarIcon: function tabBarIcon({ focused, color, size }) {
                    const iconName = getTabIconName(route.name, focused);
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#5e7055',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: { fontWeight: 'bold' },

            })}
        >
            <Tab.Screen name="Home" component={HomeScreen}
                options={{
                    headerTitle: "",
                }}
            />
            <Tab.Screen name="Calls" component={CallsScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Progress" component={StatisticsScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />

        </Tab.Navigator>
    );
}
