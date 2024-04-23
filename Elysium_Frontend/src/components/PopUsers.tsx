import React, { memo, useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../core/theme';
import { User, StripUser } from '../utils/interfaces';
import Button from '../components/Button';
import PlusSong from './AddSong';
import  useAxios  from "../utils/useAxios";
import { Platform } from 'react-native';
import { Navigation, Route } from '../utils/types';
import {url} from '../utils/url';
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

  useEffect(() => {
    if (Platform.OS === 'web' || Platform.OS === 'ios') {
      // Logic for web platform
      userEndpoint = url + 'user/profile/'+user.id.toString();
    } else {
      // Logic for Android platform and other platforms
      userEndpoint = url + 'user/profile/'+user.id.toString();
    }

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

  const goUser = () => {
    let userInfo: User | null = null;
    //console.log(JSON.stringify(userData))
    if (userData) {
      const uInfo = JSON.parse(JSON.stringify(userData));
      userInfo = {
        id: uInfo.id,
        user: uInfo.user,
        username: uInfo.username,
        followers: uInfo.followers,
        following: uInfo.follow,
        posts: uInfo.posts,
        creation_time: uInfo.creation_time,
        bio: uInfo.bio,
        location: uInfo.location,
        update_time: uInfo.update_time,
      };
    }
    navigation.navigate('ViewUser', { userInfo: userInfo });
  };

  return (
    <Button mode="outlined" onPress={goUser}>{user.username}</Button>
  );
};

export default UserPost;
