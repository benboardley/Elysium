import React, { memo, useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../core/theme';
import { User, StripUser } from '../utils/interfaces';
import Button from '../components/Button';
import PlusSong from './AddSong';
import  useAxios  from "../utils/useAxios";
import { Platform } from 'react-native';
import { Navigation, Route } from '../utils/types';

interface UserPopProps {
  user: StripUser;
}

type Props = {
  navigation: Navigation;
};

const UserPost: React.FC<UserPopProps & Props> = ({ user, navigation }) => {
  const [userData, setUserData] = useState<any | null>(null);
  let userEndpoint = '';
  const axiosInstance = useAxios(navigation);

  const goUser = () => {
    
    if (Platform.OS === 'web' || Platform.OS === 'ios') {
      // Logic for web platform
      userEndpoint = 'http://localhost:8000/user/profile/'+user.id.toString()+'/';
    } else {
      // Logic for Android platform and ther platforms
      userEndpoint = 'http://localhost:8000/user/profile/'+user.id.toString()+'/';
    }

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const result = await axiosInstance.get(userEndpoint);
          setUserData(result.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }, []);

    navigation.navigate("ViewUser", { userData });
  };

  return (
    <Button mode="outlined" onPress={goUser}>{user.username}</Button>
  );
};

export default UserPost;
