import React, { memo, useContext, useEffect } from 'react';
import { Navigation, Screen } from '../utils/types';
import Background from '../components/Background';
import { Text } from 'react-native';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';
import { AuthContext } from '../context/AuthContext'; // Import your AuthContext
import { setCurrentScreen, getCurrentScreen } from '../context/currentScreen';

type Props = {
  navigation: Navigation;
  screen: Screen;
};

const HomeScreen = ({ navigation, screen }: Props) => {
  const updatedScreen: Screen = {
    main: "MainScreen",
    nested: "HomeScreen"
  };
  setCurrentScreen(updatedScreen);

  /****** THERE IS AN ERROR HERE? *****/
  const authContext = useContext(AuthContext);
  useEffect(() => {
    // Check if authTokens exist and navigate to Dashboard if they do
    if (authContext?.authTokens) {
      navigation.navigate("LoginScreen");
      let currScreen: Screen = getCurrentScreen();
      if (currScreen.nested) {
        navigation.navigate(currScreen.main, { screen: currScreen.nested })
      } else {
        navigation.navigate(currScreen.main);
      }
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

