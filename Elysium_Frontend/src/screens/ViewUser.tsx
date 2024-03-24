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
import { NavigationContainer } from '@react-navigation/native';
import  useAxios  from "../utils/useAxios";
type Props = {
  navigation: Navigation;
};

const Dashboard = (route, { navigation }: Props) => {
  const { userData } = route.params;
  const [userPostsData, setUserPostsData] = useState<any | null>(null);
  const axiosInstance = useAxios(navigation);
  let userPostEndpoint: string = '';

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
              <Text style={styles.number}>{userInfo?.followers.length}</Text>
              <Paragraph>Followers</Paragraph>
            </View>
            <View style={styles.column}>
              <Text style={styles.number}>{userInfo?.following.length}</Text>
              <Paragraph>Following</Paragraph>
            </View>
          </View>
        </View>
        
        {userPostsData && (
          <React.Fragment>
            {posts.map(post => (
                <UserPost post={post} navigation={navigation} />
            ))}
          </React.Fragment>
        )}
      </ScrollView>
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