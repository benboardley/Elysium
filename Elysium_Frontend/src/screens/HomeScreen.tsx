import React, { memo, useContext, useEffect } from 'react';
import { Navigation } from '../utils/types';
import Background from '../components/Background';
import { Text } from 'react-native';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';
import { AuthContext } from '../context/AuthContext'; // Import your AuthContext
import {url} from '../utils/url';
type Props = {
  navigation: Navigation;
};

const HomeScreen = ({ navigation }: Props) => {
  const authContext = useContext(AuthContext);
  console.log(url)
  useEffect(() => {
    // Check if authTokens exist and navigate to Dashboard if they do
    if (authContext?.authTokens) {
      console.log(authContext.authTokens)
      navigation.navigate('MainScreen', { screen: 'Dashboard' });
    }
  }, [authContext]);

  return (
    <Background>
      <Logo />
      <Paragraph>A new generation music-sharing application</Paragraph>

      <Button mode="outlined" onPress={() => navigation.navigate('LoginScreen')}>
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Sign Up
      </Button>
    </Background>
  );
};

export default memo(HomeScreen);

