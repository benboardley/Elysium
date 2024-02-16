import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  Dashboard,
} from './screens';

const Stack = createNativeStackNavigator();
/*
const App = () => {
  const [count, setCount] = useState(0);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello from {'\n'}React Native Web!</Text>
      <TouchableOpacity
        onPress={() => setCount(count + 1)}
        style={styles.button}>
        <Text>Click me!</Text>
      </TouchableOpacity>

      <Text>You clicked {count} times!</Text>
      <Text>Hello Mr</Text>
    </View>
  );
};
*/



const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
        />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C3E8BD',
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#ADBDFF',
    padding: 5,
    marginVertical: 20,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 40,
  },
});

export default App;