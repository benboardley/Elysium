import React, { memo, useContext, useEffect } from 'react';
import { Navigation } from '../types';
import Background from '../components/Background';
import { Text } from 'react-native';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';
import { AuthContext } from '../context/AuthContext'; // Import your AuthContext

type Props = {
  navigation: Navigation;
};

const HomeScreen = ({ navigation }: Props) => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    // Check if authTokens exist and navigate to Dashboard if they do
    if (authContext?.authTokens) {
      navigation.navigate('Dashboard');
    }
  }, [authContext]);

  return (
    <Background>
      <Logo />
      <Header>Elysium</Header>
      <Paragraph>
        <Text>A new generation music-sharing application</Text>
      </Paragraph>

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

