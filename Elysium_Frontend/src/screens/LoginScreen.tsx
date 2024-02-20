import React, { memo, useState, useContext } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { nameValidator, passwordValidator } from '../core/utils';
import { Navigation, Route } from '../types';
import { Platform } from 'react-native';
import axios, { AxiosError } from 'axios';
import {setAuthToken, getAuthToken} from '../helper'
import  { AuthContext }  from '../context/AuthContext';

type Props = {
  navigation: Navigation;
  route: Route<{ errorMessage?: string }>;
};

const LoginScreen = ({ navigation, route }: Props) => {
  const [username, setusername] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const errorMessage = route.params?.errorMessage || '';
  const authContext = useContext(AuthContext);
  if (!authContext) {
    // Handle the case where the context is not available
    return null;
  }

  const { loginUser } = authContext;

  const _onLoginPressed = async () => {
    const usernameError = nameValidator(username.value);
    const passwordError = passwordValidator(password.value);

    if (usernameError || passwordError) {
      setusername({ ...username, error: usernameError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    /*let endpoint: string = '';
    if (Platform.OS === 'web') {
      // Logic for web platform
      endpoint = 'http://localhost:8000/user/login/';
    } else if (Platform.OS === 'ios') {
      // Logic for iOS platform
      endpoint = 'http://localhost:8000/user/login/';
    } else if (Platform.OS === 'android') {
      // Logic for Android platform
      endpoint = 'http://10.0.0.2:8000/user/login/';
    } else {
      // Fallback for other platforms
      endpoint = 'http://10.0.0.2:8000/user/login/';
    }

    try {
      const response = await axios.post(endpoint, {
        username: username.value,
        password: password.value,
      });

      if ('token' in response.data) {
        await setAuthToken(response.data.token);
        navigation.navigate('Dashboard');
      } else if ('error' in response.data) {
        console.error(response.status, response.data);
        setusername({ value: username.value, error: response.data.error });
        setPassword({ value: '', error: '' });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data as { error: string };
        console.error(error.response.status, responseData.error);
        setusername({ value: username.value, error: responseData.error });
        setPassword({ value: '', error: '' });
      } else {
        console.error('Error:', error);
        setusername({ value: username.value, error: 'Unknown Error' });
        setPassword({ value: '', error: '' });
      }
    }*/
    try {
      await loginUser(username.value, password.value);
      //navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate('HomeScreen')} />

      <Logo />

      <Header>Welcome back.</Header>

      <TextInput
        label="username"
        returnKeyType="next"
        value={username.value}
        onChangeText={text => setusername({ value: text, error: '' })}
        error={!!username.error}
        errorText={username.error}
        autoCapitalize="none"
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
      {!!errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPasswordScreen')}
        >
          <Text style={styles.label}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={_onLoginPressed}>
        Login
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default memo(LoginScreen);
