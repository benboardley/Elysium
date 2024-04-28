import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './context/AuthContext';
import { NavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { theme } from './core/theme';
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  Dashboard,
  Feed,
  Search,
  ViewUser,
  CreatePost,
} from './screens';

type RootStackParamList = {
  HomeScreen: undefined;
  LoginScreen: { errorMessage?: string };
  RegisterScreen: { errorMessage?: string };
  ForgotPasswordScreen: undefined;
  Dashboard: undefined;
  MainScreen: undefined;
  Feed: undefined;
  Search: undefined;
  ViewUser: undefined;
  CreatePost: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const SearchStack = createNativeStackNavigator();

/*
<Stack.Screen
name="ViewUser"
component={AuthProviderWrapper(ViewUser)}
/>
*/

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
        <Stack.Screen
          name="HomeScreen"
          component={AuthProviderWrapper(HomeScreen)}
        />
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
        <Stack.Screen
          name="ViewUser"
          component={AuthProviderWrapper(ViewUser)}
        />
        <Stack.Screen name="MainScreen" options={{ headerShown: false }} >
          {() => (
              <Tab.Navigator
                tabBarOptions={{
                  activeTintColor: theme.colors.black, // Change active tab text color
                  inactiveTintColor: 'gray', // Change inactive tab text color
                  style: {
                    backgroundColor: theme.colors.offwhite, // Change background color of the tab bar
                    borderTopWidth: 1, // Add a border on top of the tab bar
                    borderTopColor: 'lightgray', // Set the border color
                  },
                  labelStyle: {
                    fontSize: 16, // Change the font size of the tab labels
                    fontWeight: 'bold', // Set the font weight of the tab labels
                  },
                }}
              >
              <Tab.Screen
                name="Feed"
                component={AuthProviderWrapper(Feed)}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Image
                      source={require('./assets/home.png')}
                      style={{ tintColor: theme.colors.black, width: 25, height: 25 }}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="Search"
                component={AuthProviderWrapper(Search)}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Image
                      source={require('./assets/search-icon.png')}
                      style={{ tintColor: theme.colors.black, width: 25, height: 25 }}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="CreatePost"
                component={AuthProviderWrapper(CreatePost)}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Image
                      source={require('./assets/create_post_icon.png')}
                      style={{ tintColor: theme.colors.black, width: 25, height: 25 }}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="Dashboard"
                component={AuthProviderWrapper(Dashboard)}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Image
                      source={require('./assets/profile2.png')}
                      style={{ tintColor: theme.colors.black, width: 25, height: 25 }}
                    />
                  ),
                }}
              />
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
