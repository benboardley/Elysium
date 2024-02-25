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
import  useAxios  from "../utils/useAxios";
import { Platform } from 'react-native';
type Props = {
  navigation: Navigation;
};

const Dashboard = ({ navigation }: Props) => {
  const [postData, setPostData] = useState<any | null>(null);
  const [playlistData, setPlaylistData] = useState<any | null>(null);
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
    const fetchPlaylists = async () => {
      try {
        const result = await axiosInstance.get('http://localhost:8000/music/spotify/playlists');
        setPlaylistData(result.data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        setPlaylistData(error)
      }
    };
    fetchPosts();
    fetchPlaylists();
  }, []);//[axiosInstance, endpoint]);

  const handleLogout = () => {
    authContext?.logoutUser(); // Call the logoutUser function from AuthContext
    navigation.navigate('HomeScreen')
  };

  const authenticateSpotify = () => {
    axiosInstance.get("http://localhost:8000/user/spotify/is-authenticated")
      .then((response) => response.data)
      .then((data) => {
        //this.setState({ spotifyAuthenticated: data.status });
        console.log(data.status);
        if (!data.status) {
          axiosInstance.get("http://localhost:8000/user/spotify/get-auth-url")
            .then((response) => response.data)
            .then((data) => {
              window.location.replace(data.url);
            })
            .catch((error) => {
              // Handle the error here
              console.error("Error fetching authentication URL:", error);
          
              // Optionally, you can check the specific error status
              if (error.response && error.response.status === 401) {
                // Handle 401 Unauthorized
                console.error("Unauthorized request");
              }
            });
        }
      });
  }
  return (
    <Background>
      <Logo />
      <Header>Let's start</Header>
      <Paragraph>
        Your amazing app starts here. Open your favourite code editor and start editing this project.
      </Paragraph>
      <Button mode="outlined" onPress={authenticateSpotify}>
        Connect Spotify
      </Button>
      <Button mode="outlined" onPress={handleLogout}>
        Logout
      </Button>
      {postData && (
        <Paragraph>
          Posts data: {JSON.stringify(postData)}
          Playlists: {JSON.stringify(playlistData)}
        </Paragraph>
      )}
    </Background>
  );
};

export default memo(Dashboard);