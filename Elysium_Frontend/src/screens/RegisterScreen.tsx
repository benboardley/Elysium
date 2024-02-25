import React, { memo, useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { Navigation, Route, Screen } from '../utils/types';
import { AuthContext }  from '../context/AuthContext';
import { setCurrentScreen, getCurrentScreen } from '../context/currentScreen';
import {
  emailValidator,
  passwordValidator,
  nameValidator,
} from '../core/utils';
import axios from 'axios';

type Props = {
  navigation: Navigation;
  screen: Screen;
  //route: Route<{ errorMessage?: string }>;
};

const RegisterScreen = ({ navigation, screen }: Props) => {
  const updatedScreen: Screen = {
      main: "RegisterScreen",
      nested: null
  };
  setCurrentScreen(updatedScreen);
  /*
  screen.main = "RegisterScreen";
  screen.nested = null;
  setCurrentScreen(screen);
  */
  const [username, setUsername] = useState({ value: '', error: '' });
  const [firstname, setFirstname] = useState({ value: '', error: '' });
  const [lastname, setLastname] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  //const errorMessage = route.params?.errorMessage || '';
  const authContext = useContext(AuthContext);
  if (!authContext) {
    // Handle the case where the context is not available
    return null;
  }

  const { registerUser } = authContext;

  const _onSignUpPressed = async () => {
    const usernameError = nameValidator(username.value);
    const firstnameError = nameValidator(firstname.value);
    const lastnameError = nameValidator(lastname.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError || usernameError || firstnameError || lastnameError) {
      setUsername({ ...username, error: usernameError });
      setFirstname({ ...firstname, error: firstnameError });
      setLastname({ ...lastname, error: lastnameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    /*
    let endpoint = '';
    if (Platform.OS === 'web') {
      // Logic for web platform
      endpoint = 'http://localhost:8000/user/register/';
    } else if (Platform.OS === 'ios') {
      // Logic for iOS platform
      endpoint = 'http://localhost:8000/user/register/';
    } else if (Platform.OS === 'android') {
      // Logic for Android platform
      endpoint = 'http://10.0.0.2:8000/user/register/';
    } else {
      // Fallback for other platforms
      endpoint = 'http://10.0.0.2:8000/user/register/';
    }
    axios.post(endpoint, {
      username: username.value,
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      password: password.value,
    })
    */
    try {
      await registerUser(email.value, username.value, firstname.value, lastname.value, password.value);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate('HomeScreen')} />

      <Logo />

      <Header>Create Account</Header>

      <TextInput
        label="Userame"
        returnKeyType="next"
        value={username.value}
        onChangeText={text => setUsername({ value: text, error: '' })}
        error={!!username.error}
        errorText={username.error}
      />

      <TextInput
        label="First Name"
        returnKeyType="next"
        value={firstname.value}
        onChangeText={text => setFirstname({ value: text, error: '' })}
        error={!!firstname.error}
        errorText={firstname.error}
      />

      <TextInput
        label="Last Name"
        returnKeyType="next"
        value={lastname.value}
        onChangeText={text => setLastname({ value: text, error: '' })}
        error={!!lastname.error}
        errorText={lastname.error}
      />

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <Button mode="outlined" onPress={_onSignUpPressed} style={styles.button}>
        Sign Up
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  label: {
    color: theme.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default memo(RegisterScreen);
