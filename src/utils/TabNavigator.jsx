import { Ionicons } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';

import HomeScreen from "../screens/HomeScreen"
import StatisticsScreen from '../screens/StatisticsScreen';
import VocabScreen from '../screens/VocabScreen';
import CallsScreen from '../screens/CallsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
// Tab Navigator for Calls, Progress, and Vocab
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
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Calls') {
                        iconName = focused ? 'call' : 'call-outline';
                    } else if (route.name === 'Progress') {
                        iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                    } else if (route.name === 'Vocab') {
                        iconName = focused ? 'book' : 'book-outline';
                    }
                    else if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#5e7055',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen}
                options={{
                    headerRight: () => (
                        <IconButton
                            icon="cog"
                            size={24}
                            onPress={() => navigation.navigate("SettingsScreen")}
                            style={{ marginRight: 10 }}
                        />
                    ), headerTitle: "",
                }}
            />
            <Tab.Screen name="Calls" component={CallsScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Progress" component={StatisticsScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Vocab" component={VocabScreen} options={{ headerShown: false }} />

        </Tab.Navigator>
    );
}
