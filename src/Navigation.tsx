import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import CalorieScreen from './screens/CalorieScreen';
import PlanScreen from './screens/PlanScreen';
import ProgressScreen from './screens/ProgressScreen';
import ProfileOnboarding from './screens/ProfileOnboarding';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#000' },
        tabBarActiveTintColor: '#0580FF',
        tabBarInactiveTintColor: '#9aa0a6',
        tabBarLabelStyle: { fontWeight: '700' },
        tabBarIcon: ({ color, size }) => {
          const name = route.name;
          let iconName: any = 'ellipse';
          if (name === 'Home') iconName = 'home-outline';
          if (name === 'Calorie') iconName = 'restaurant-outline';
          if (name === 'Plan') iconName = 'list-outline';
          if (name === 'Progress') iconName = 'trending-up-outline';
          if (name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size || 20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calorie" component={CalorieScreen} />
      <Tab.Screen name="Plan" component={PlanScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileOnboarding} />
    </Tab.Navigator>
  );
}

export default function Navigation({ initial }: { initial?: string }) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
