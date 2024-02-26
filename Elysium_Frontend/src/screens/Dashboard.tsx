import React, { memo, useEffect, useState, useContext } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Background from '../components/Background';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { Navigation } from '../utils/types';
import { makeAuthenticatedRequest } from '../helper'; // Import the makeAuthenticatedRequest function
import { Platform } from 'react-native';
import  useAxios  from "../utils/useAxios";
import jwtDecode from 'jwt-decode'
import { AuthContext } from '../context/AuthContext';
type Props = {
  navigation: Navigation;
};

const Dashboard = ({ navigation }: Props) => {
  const [postData, setPostData] = useState<any | null>(null);
  //const [userData, setUserData] = useState<any | null>(null);
  const [followingData, setFollowingData] = useState<any | null>(null);
  const axiosInstance = useAxios(navigation);
  const authContext = useContext(AuthContext);
  let postsEndpoint: string = '';
  //let userEndpoint: string = '';
  let followingEndpoint: string = '';
  if (Platform.OS === 'web' || Platform.OS === 'ios') {
    // Logic for web platform
    postsEndpoint = 'http://localhost:8000/social/posts/';
    //userEndpoint = 'http://localhost:8000/user/profile/';
    followingEndpoint = 'http://localhost:8000/user/follow/';
  } else {
    // // Logic for Android platform and ther platforms
    postsEndpoint = 'http://10.0.0.2:8000/social/posts/';
    //userEndpoint = 'http://10.0.0.2:8000/user/profile/';
    followingEndpoint = 'http://10.0.0.2:8000/user/follow/';
  }
  useEffect(() => {
    
    const fetchPosts = async () => {
      try {
        const result = await axiosInstance.get(postsEndpoint);
        setPostData(result.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    /*
    const fetchUserData = async () => {
      try {
        const result = await axiosInstance.get(userEndpoint);
        setUserData(result.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    */
    fetchPosts();
    //fetchUserData();
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
      <Header>User Dashboard</Header>
      <Paragraph>
        This is where a user's profile will be displayed. 
      </Paragraph>
      <Button mode="outlined" onPress={authenticateSpotify}>
        Connect Spotify
      </Button>
      {postData && (
        <Paragraph>
          Posts data: {JSON.stringify(postData)}
        </Paragraph>
      )}
      <Button style={styles.logoutButton} mode="outlined" onPress={handleLogout}>
        Logout
      </Button>
    </Background>
  );
};

/*
        {userData && (
          <Paragraph>
            User data: {JSON.stringify(userData)}
          </Paragraph>
        )}
*/

const styles = StyleSheet.create({
  logoutButton: {
    position: 'absolute',
    bottom: 0,
    width: 105,
    margin: 16,
  },
});

export default memo(Dashboard);