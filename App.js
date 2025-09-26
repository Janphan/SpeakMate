import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from "./src/screens/HomeScreen"
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import SignOutScreen from "./src/screens/SignOutScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import DialogueScreen from './src/screens/DialogueScreen';

import StatisticsScreen from './src/screens/StatisticsScreen';
import CallsScreen from './src/screens/CallsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TermsOfServiceScreen from './src/screens/TermsOfServiceScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import ConversationDetailsScreen from './src/screens/ConversationDetailsScreen';
import TopicList from './src/screens/TopicList';
import Feedback from './src/screens/Feedback';

import { initializeQuestionBanks } from './src/api/initializeQuestions';
import { initializeExpandedQuestionBanks } from './src/api/initializeQuestions_expanded';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for Calls, Progress, and Settings
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
          backgroundColor: '#c2e4ab',
          borderTopWidth: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Calls') {
            iconName = focused ? 'call' : 'call-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Home') {
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
          headerTitle: "",
        }}
      />
      <Tab.Screen name="Calls" component={CallsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Progress" component={StatisticsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />

    </Tab.Navigator>
  );
}

export default function App() {
  // Initialize both original and expanded question banks
  initializeQuestionBanks();
  initializeExpandedQuestionBanks();
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
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="TermsOfServiceScreen" component={TermsOfServiceScreen} />
        <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
        <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
        <Stack.Screen
          name="ConversationDetailsScreen"
          component={ConversationDetailsScreen}
          options={{ title: 'Conversation Details' }}
        />
        <Stack.Screen name="TopicList" component={TopicList} />
        <Stack.Screen name="Feedback" component={Feedback} />
        <Stack.Screen name="StatisticsScreen" component={StatisticsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
