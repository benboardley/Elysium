import React, { memo, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { nameValidator, passwordValidator } from '../core/utils';
import { Navigation } from '../types';
import { Platform } from 'react-native';
import axios from 'axios';
type Props = {
  navigation: Navigation;
};

const LoginScreen = ({ navigation }: Props) => {
  const [username, setusername] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });

  const _onLoginPressed = () => {
    const usernameError = nameValidator(username.value);
    const passwordError = passwordValidator(password.value);

    if (usernameError || passwordError) {
      setusername({ ...username, error: usernameError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    let endpoint = '';
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
    axios.post(endpoint, {
      username: username.value,
      password: password.value
    })
    .then(response => {
      console.log('API Response:', response.data);
      navigation.navigate('Dashboard');
    })
    .catch(error => {
      console.error('API Error:', error);
      // Handle error or show a relevant message to the user
    });
    navigation.navigate('Dashboard');
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
});

export default memo(LoginScreen);
