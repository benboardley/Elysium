import React, { memo, useEffect, useState, useContext } from 'react';
import { TouchableOpacity, StyleSheet, ScrollView, Text, View, Image } from 'react-native';
import { theme } from '../core/theme';
import Background from '../components/Background';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { Navigation } from '../utils/types';
import { Follower, Post, User } from '../utils/interfaces';
import UserPost from '../components/Post';
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
  const [userPostsData, setUserPostsData] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const axiosInstance = useAxios(navigation);
  const authContext = useContext(AuthContext);
  let userPostEndpoint: string = '';
  let userEndpoint: string = '';
  if (Platform.OS === 'web' || Platform.OS === 'ios') {
    // Logic for web platform
    userEndpoint = 'http://localhost:8000/user/self/';
  } else {
    // Logic for Android platform and ther platforms
    userEndpoint = 'http://10.0.0.2:8000/user/self/';
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

  useEffect(() =>{
    const fetchUserPosts = async () => {
      try {
        let userId: string = '';
        if (userData) {
          userId = userData.id;
          if (Platform.OS === 'web' || Platform.OS === 'ios') {
            // Logic for web platform
            userPostEndpoint = 'http://localhost:8000/user/profile/posts/'+userId.toString();
            
          } else {
            // Logic for Android platform and ther platforms
            userPostEndpoint = 'http://localhost:8000/user/profile/posts/'+userId.toString();
          }
          const result = await axiosInstance.get(userPostEndpoint);
          setUserPostsData(result.data);
        } else {
          console.error('Error fetching user posts: User data not found');
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    }
    fetchUserPosts();
  }, [userData]);

  /***** RETRIEVES ALL DATA OF LOGGED IN USER *****/ 
  let userInfo: User | null = null;
  //console.log(JSON.stringify(userData))
  if (userData) {
    const uInfo = JSON.parse(JSON.stringify(userData));
    userInfo = {
      id: uInfo.id,
      username: uInfo.username,
      email: uInfo.email,
      password: uInfo.password,
      followers: uInfo.followers,
      following: uInfo.follow,
      posts: uInfo.posts,
      playlists: uInfo.playlists,
      albums: uInfo.albums,
      songs: uInfo.songs,
    };
  }

  /***** RETRIEVES ALL POSTS OF LOGGED IN USER *****/ 
  let posts: Post[] = [];
  if (userPostsData) {
    const postInfo = userPostsData.map((post: any) => JSON.parse(JSON.stringify(post)));
    posts = postInfo.map((post: any) => ({
      id: post.id,
      profile: post.profile,
      profile_username: post.profile_username,
      creation_time: post.creation_time,
      update_time: post.update_time,
      title: post.title,
      caption: post.caption,
      parent_post: post.parent_post,
      song: post.song,
      playlist: post.playlist,
      album: post.album,
      likes: post.likes,
      song_post: post.song_post,
    }));
  }

  /***** HANDELS LOGOUT OF USER *****/ 
  const handleLogout = () => {
    authContext?.logoutUser();
    navigation.navigate('HomeScreen')
  };

  /***** SETS CONNECTION STATUS OF SPOTIFY *****/ 
  useEffect(() => {
    const setConnected = async () => {
      axiosInstance.get("http://localhost:8000/user/spotify/is-authenticated")
      .then((response) => response.data)
      .then((data) => {
        //this.setState({ spotifyAuthenticated: data.status });
        if (data.auth) {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      });
    };
    setConnected();
  }, []);//[axiosInstance, endpoint]);  

  /***** HANDELS CONNECTIVITY TO SPOTIFY *****/ 
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
          <Header>{userInfo?.username}'s Dashboard</Header>
        </View>

        <View style={styles.container}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.number}>{userInfo?.posts.length}</Text>
              <Paragraph>Posts</Paragraph>
            </View>
            <View style={styles.column}>
              <Text style={styles.number}>0</Text>
              <Paragraph>Followers</Paragraph>
            </View>
            <View style={styles.column}>
              <Text style={styles.number}>{userInfo?.following.length}</Text>
              <Paragraph>Following</Paragraph>
            </View>
          </View>
        </View>

        <Button style={styles.spotButton} mode="outlined" onPress={authenticateSpotify}>
          <Paragraph>Connect Spotify </Paragraph>
          {isConnected ? (
            <Image source={require('../assets/check-icon.png')} style={{ tintColor: 'green', width: 20, height: 20 }} />
          ) : (
            <Image source={require('../assets/x.png')} style={{ tintColor: 'red', width: 20, height: 20 }} />
          )}
        </Button>
        
        {userPostsData && (
          <React.Fragment>
            {posts.map(post => (
                <UserPost post={post} navigation={navigation} />
            ))}
          </React.Fragment>
        )}

      </ScrollView>
      <View style={styles.bottomContainer}>
        <Button mode="outlined" onPress={handleLogout}>
          Logout
        </Button>
      </View>
    </Background>

  );
};

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