import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';

import HomeScreen from "./src/screens/HomeScreen"
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import SignOutScreen from "./src/screens/SignOutScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import DialogueScreen from './src/screens/DialogueScreen';

import ProgressScreen from './src/screens/ProgressScreen';
import VocabScreen from './src/screens/VocabScreen';
import CallsScreen from './src/screens/CallsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for Calls, Progress, and Vocab
function TabNavigator() {
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
          backgroundColor: '#fff',
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
        tabBarActiveTintColor: 'tomato',
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
      <Tab.Screen name="Calls" component={CallsScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Vocab" component={VocabScreen} />

    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignInScreen"
        screenOptions={{ headerShown: false, }}
      >
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="HomeScreen" component={TabNavigator} />
        <Stack.Screen name="DialogueScreen" component={DialogueScreen} />
        <Stack.Screen name="SignOutScreen" component={SignOutScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
