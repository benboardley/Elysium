/*
import React, { memo, useEffect, useState, useContext } from 'react';
import Background from '../components/Background';
import Header from '../components/Header';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { Navigation } from '../utils/types';
import { makeAuthenticatedRequest } from '../helper'; // Import the makeAuthenticatedRequest function
import { Platform } from 'react-native';
import  useAxios  from "../utils/useAxios";
import jwtDecode from 'jwt-decode'
import { AuthContext } from '../context/AuthContext';
import { Post } from '../utils/interfaces';
import UserPost from '../components/Post';
import { theme } from '../core/theme';
import PlusSong from '../components/AddSong';
type Props = {
  navigation: Navigation;
};

const Feed = ({ navigation }: Props) => {
  const [postData, setPostData] = useState<any | null>(null);
  const axiosInstance = useAxios(navigation);
  const authContext = useContext(AuthContext);
  let postsEndpoint: string = '';
  let topSongEndpoint: string = '';
  if (Platform.OS === 'web' || Platform.OS === 'ios') {
    // Logic for web platform
    postsEndpoint = 'http://localhost:8000/social/posts/';
  } else {
    // // Logic for Android platform and ther platforms
    postsEndpoint = 'http://10.0.0.2:8000/social/posts/';
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
    fetchPosts();
  }, []);//[axiosInstance, endpoint]);
  
  let posts: Post[] = [];
  if (postData) {
    const postInfo = postData.map((post: any) => JSON.parse(JSON.stringify(post)));
    posts = postInfo.map((post: any) => ({
      id: post.id,
      profile: post.profile,
      profile_username: post.profile_username,
      creation_time: post.creation_time,
      update_time: post.update_time,
      title: post.title,
      caption: post.caption,
      parent_post: post.parent_post,
      likes: post.likes,
      song_post: post.song_post,
      playlist_post: post.playlist_post,
      album_post: post.album_post,
    }));
  }

  return (
    <ScrollView>
      <Background>
        {postData && (
          <React.Fragment>
            {posts.map(post => (
                <UserPost key={post.id} post={post} navigation={navigation} />
            ))}
          </React.Fragment>
        )}
      </Background>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 16,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  header: {
    fontSize: 18,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default memo(Feed);
*/
import React, { memo, useEffect, useState, useContext } from 'react';
import Background from '../components/Background';
import Header from '../components/Header';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { Navigation } from '../utils/types';
import { makeAuthenticatedRequest } from '../helper'; // Import the makeAuthenticatedRequest function
import { Platform } from 'react-native';
import  useAxios  from "../utils/useAxios";
import jwtDecode from 'jwt-decode'
import { AuthContext } from '../context/AuthContext';
import { Post } from '../utils/interfaces';
import UserPost from '../components/Post';
import { theme } from '../core/theme';
import PlusSong from '../components/AddSong';

type Props = {
  navigation: Navigation;
};

const Feed = ({ navigation }: Props) => {
  const [postData, setPostData] = useState<any | null>(null);
  const [selectedFeed, setSelectedFeed] = useState<'follower' | 'elysium'>('follower');
  const axiosInstance = useAxios(navigation);
  const authContext = useContext(AuthContext);

  const getPostsEndpoint = () => {
    if (selectedFeed === 'follower') {
      return Platform.OS === 'web' || Platform.OS === 'ios'
        ? 'http://localhost:8000/social/posts/follow'
        : 'http://10.0.0.2:8000/social/posts/follow';
    } else {
      return Platform.OS === 'web' || Platform.OS === 'ios'
        ? 'http://localhost:8000/social/posts'
        : 'http://10.0.0.2:8000/social/posts';
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await axiosInstance.get(getPostsEndpoint());
        setPostData(result.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, [selectedFeed]); // Fetch posts when selectedFeed changes

  let posts: Post[] = [];
  if (postData) {
    const postInfo = postData.map((post: any) => JSON.parse(JSON.stringify(post)));
    posts = postInfo.map((post: any) => ({
      id: post.id,
      profile: post.profile,
      profile_username: post.profile_username,
      creation_time: post.creation_time,
      update_time: post.update_time,
      title: post.title,
      caption: post.caption,
      parent_post: post.parent_post,
      likes: post.likes,
      song_post: post.song_post,
      playlist_post: post.playlist_post,
      album_post: post.album_post,
    }));
  }

  return (
      <Background>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedFeed === 'follower' && styles.selectedTab]}
            onPress={() => setSelectedFeed('follower')}
          >
            <Text style={styles.tabText}>Follower Feed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedFeed === 'elysium' && styles.selectedTab]}
            onPress={() => setSelectedFeed('elysium')}
          >
            <Text style={styles.tabText}>Elysium Feed</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
        {postData && (
          <React.Fragment>
            {posts.map(post => (
                <UserPost key={post.id} post={post} navigation={navigation} />
            ))}
          </React.Fragment>
        )}
        </ScrollView>
      </Background>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default memo(Feed);
