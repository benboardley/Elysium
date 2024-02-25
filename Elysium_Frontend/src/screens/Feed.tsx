import React, { memo, useEffect, useState, useContext } from 'react';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { Navigation } from '../types';
import { makeAuthenticatedRequest } from '../helper'; // Import the makeAuthenticatedRequest function
import { Platform } from 'react-native';
import  useAxios  from "../utils/useAxios";
import jwtDecode from 'jwt-decode'
import { AuthContext } from '../context/AuthContext';
type Props = {
  navigation: Navigation;
};

const Feed = ({ navigation }: Props) => {
  const [postData, setPostData] = useState<any | null>(null);
  const axiosInstance = useAxios(navigation);
  const authContext = useContext(AuthContext);
  let endpoint: string = '';
  if (Platform.OS === 'web') {
    // Logic for web platform
    endpoint = 'http://localhost:8000/social/posts/';
  } else if (Platform.OS === 'ios') {
    // Logic for iOS platform
    endpoint = 'http://localhost:8000/social/posts/';
  } else if (Platform.OS === 'android') {
    // Logic for Android platform
    endpoint = 'http://10.0.0.2:8000/social/posts/';
  } else {
    // Fallback for other platforms
    endpoint = 'http://10.0.0.2:8000/social/posts/';
  }
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await axiosInstance.get(endpoint);
        setPostData(result.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);//[axiosInstance, endpoint]);

  return (
    <Background>
      <Logo />
      <Header>User Feed</Header>
      <Paragraph>
        Unlock infinite scroll...
      </Paragraph>
      {postData && (
        <Paragraph>
          Posts data: {JSON.stringify(postData)}
        </Paragraph>
      )}
    </Background>
  );
};

export default memo(Feed);