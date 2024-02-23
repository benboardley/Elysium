import React, { useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { AuthProvider } from './context/AuthContext';
import { NavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  Dashboard,
  Feed,
} from './screens';

type RootStackParamList = {
  HomeScreen: undefined;
  LoginScreen: { errorMessage?: string };
  RegisterScreen: { errorMessage?: string };
  ForgotPasswordScreen: undefined;
  Dashboard: undefined;
  MainScreen: undefined;
  Feed: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const App = () => {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  // Wrapper component to include AuthProvider for each screen
  const AuthProviderWrapper = (Component: React.ComponentType<any>) => (props: any) => (
    <AuthProvider navigation={navigationRef.current}>
      <Component {...props} />
    </AuthProvider>
  );

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={AuthProviderWrapper(HomeScreen)} />
        <Stack.Screen
          name="LoginScreen"
          component={AuthProviderWrapper(LoginScreen)}
          initialParams={{ errorMessage: '' }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={AuthProviderWrapper(RegisterScreen)}
          initialParams={{ errorMessage: '' }}
        />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={AuthProviderWrapper(ForgotPasswordScreen)}
        />
        <Stack.Screen name="MainScreen" options={{ headerShown: false }} >
          {() => (
            <Tab.Navigator>
              <Tab.Screen name="Feed" component={AuthProviderWrapper(Feed)} />
              <Tab.Screen name="Dashboard" component={AuthProviderWrapper(Dashboard)} />
            </Tab.Navigator>
          )}
          </Stack.Screen>
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
