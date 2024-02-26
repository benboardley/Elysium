import React, { memo, useEffect, useState, useContext } from 'react';
import Background from '../components/Background';
import Header from '../components/Header';
import { View, Text, StyleSheet } from 'react-native';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { Navigation } from '../types';
import { makeAuthenticatedRequest } from '../helper'; // Import the makeAuthenticatedRequest function
import { Platform } from 'react-native';
import  useAxios  from "../utils/useAxios";
import jwtDecode from 'jwt-decode'
import { AuthContext } from '../context/AuthContext';
import { Post } from '../utils/interfaces';
import UserPost from '../components/post';
import { theme } from '../core/theme';
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

  let post: Post | null = null;
  if (postData) {
    const postInfo = JSON.parse(JSON.stringify(postData[0]));
    post = {
      id: postInfo.id,
      profile: postInfo.profile,
      creation_time: postInfo.creation_time,
      update_time: postInfo.update_time,
      title: postInfo.title,
      caption: postInfo.caption,
      parent_post: postInfo.parent_post,
      song: postInfo.song,
      playlist: postInfo.playlist,
      album: postInfo.album,
      likes: postInfo.likes,
    };
  }
  let posts: Post[] = [];
  if (postData) {
    const postInfo = postData.map((post: any) => JSON.parse(JSON.stringify(post)));
    posts = postInfo.map((post: any) => ({
      id: post.id,
      profile: post.profile,
      creation_time: post.creation_time,
      update_time: post.update_time,
      title: post.title,
      caption: post.caption,
      parent_post: post.parent_post,
      song: post.song,
      playlist: post.playlist,
      album: post.album,
      likes: post.likes,
    }));
  }

  return (
    <Background>
    <View style={styles.headerContainer}>
      <Text style={styles.header}>User Feed</Text>
    </View>
      {postData && (
        <React.Fragment>
          {posts.map(post => (
            <UserPost post={post} />
          ))}
        </React.Fragment>
      )}
    </Background>
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