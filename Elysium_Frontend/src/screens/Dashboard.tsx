import React, { memo, useEffect, useState, useContext } from 'react';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { Navigation } from '../types';
import { makeAuthenticatedRequest } from '../helper'; // Import the makeAuthenticatedRequest function
import jwtDecode from 'jwt-decode'
import { AuthContext } from '../context/AuthContext';
type Props = {
  navigation: Navigation;
};

const Dashboard = ({ navigation }: Props) => {
  const authContext = useContext(AuthContext);

  const handleLogout = () => {
    authContext?.logoutUser(); // Call the logoutUser function from AuthContext
    navigation.navigate('HomeScreen')
  };

  return (
    <Background>
      <Logo />
      <Header>Let's start</Header>
      <Paragraph>
        Your amazing app starts here. Open your favourite code editor and start editing this project.
      </Paragraph>
      <Button mode="outlined" onPress={handleLogout}>
        Logout
      </Button>
    </Background>
  );
};

export default memo(Dashboard);