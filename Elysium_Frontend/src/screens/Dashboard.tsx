import React, { memo, useEffect, useState, useContext } from 'react';
import { TouchableOpacity, StyleSheet, ScrollView, Text, View, Image } from 'react-native';
import { theme } from '../core/theme';
import Background from '../components/Background';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { Navigation } from '../utils/types';
import { Follower } from '../utils/interfaces';
import { makeAuthenticatedRequest } from '../helper'; // Import the makeAuthenticatedRequest function
import { Platform } from 'react-native';
import  useAxios  from "../utils/useAxios";
import jwtDecode from 'jwt-decode'
import { AuthContext } from '../context/AuthContext';
type Props = {
  navigation: Navigation;
};

const Dashboard = ({ navigation }: Props) => {
  const [userData, setUserData] = useState<any | null>(null);
  const [followingData, setFollowingData] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const axiosInstance = useAxios(navigation);
  const authContext = useContext(AuthContext);
  let postsEndpoint: string = '';
  let userEndpoint: string = '';
  let followingEndpoint: string = '';
  if (Platform.OS === 'web' || Platform.OS === 'ios') {
    // Logic for web platform
    userEndpoint = 'http://localhost:8000/user/profile/';
    followingEndpoint = 'http://localhost:8000/user/follow/';
  } else {
    // Logic for Android platform and ther platforms
    userEndpoint = 'http://10.0.0.2:8000/user/profile/';
    followingEndpoint = 'http://10.0.0.2:8000/user/follow/';
  }
  useEffect(() => {
    
    const fetchPosts = async () => {
      try {
        const result = await axiosInstance.get(followingEndpoint);
        setFollowingData(result.data);
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
  let followers: Follower[] = [];
  let numFollowers: number;
  if (followingData) {
    const postInfo = followingData.map((post: any) => JSON.parse(JSON.stringify(post)));
    numFollowers = postInfo.length;
    followers = postInfo.map((post: any) => ({
      id: post.id,
      username: post.username,
      email: post.email,
    }));
  }

  const handleLogout = () => {
    authContext?.logoutUser(); // Call the logoutUser function from AuthContext
    navigation.navigate('HomeScreen')
  };

  useEffect(() => {
    const setConnected = async () => {
      if (authContext) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    };
    setConnected();
  }, []);//[axiosInstance, endpoint]);
  
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
      <ScrollView>
        <View style={styles.container}>
          <Header>User Dashboard</Header>
        </View>
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.number}>0</Text>
              <Paragraph>Posts</Paragraph>
            </View>
            <View style={styles.column}>
              <Text style={styles.number}>0</Text>
              <Paragraph>Followers</Paragraph>
            </View>
            <View style={styles.column}>
              <Text style={styles.number}>0</Text>
              <Paragraph>Following</Paragraph>
            </View>
          </View>
        </View>
        <Button style={styles.spotButton} mode="outlined" onPress={authenticateSpotify}>
          <Paragraph>Connect Spotify </Paragraph>
          {isConnected ? (
            <Image source={require('../assets/check-icon.png')} style={{ tintColor: 'green', width: 20, height: 20 }} />
          ) : (
            <Image source={require('../assets/x.svg')} style={{ tintColor: 'red', width: 20, height: 20 }} />
          )}
          
        </Button>
        <React.Fragment>
          {userData && (
            <Paragraph>
              User data: {JSON.stringify(userData)}
            </Paragraph>
          )}
        </React.Fragment>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <Button mode="outlined" onPress={handleLogout}>
          Logout
        </Button>
      </View>
    </Background>

  );
};

/*
        {userData && (
          <Paragraph>
            User data: {JSON.stringify(userData)}
          </Paragraph>
        )}
      {postData && (
        <Paragraph>
          Posts data: {JSON.stringify(postData)}
        </Paragraph>
      )}
*/

const styles = StyleSheet.create({
  bottomContainer: {
    bottom: 0,
    width: 105,
    margin: 16,
  },
  topContainer: {
    top: 0,
    margin: 16,
  },
  spotButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    marginHorizontal: 10, // Adjust left and right margins
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    color: '#888',
  },
  connectedText: {
    color: 'green',
  },
  notConnectedText: {
    color: 'red',
  },
});

export default memo(Dashboard);