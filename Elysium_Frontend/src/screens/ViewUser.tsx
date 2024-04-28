import React, { memo, useEffect, useState, useContext } from 'react';
import { TouchableOpacity, StyleSheet, ScrollView, Text, View, Image } from 'react-native';
import { theme } from '../core/theme';
import Background from '../components/Background';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { Navigation } from '../utils/types';
import { Follower, Post, User, RouteParams, StripUser } from '../utils/interfaces';
import UserPost from '../components/Post';
import { makeAuthenticatedRequest } from '../helper'; // Import the makeAuthenticatedRequest function
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import  useAxios  from "../utils/useAxios";
import { json, useParams } from 'react-router-dom';
import { Route } from '@react-navigation/native';
import Swal from 'sweetalert2';
import { url } from '../utils/url';
type Props = {
  navigation: Navigation;
};
type ViewUserProps = {
  route: Route<string, { userInfo: User }>;
};

const ViewUser: React.FC<Props & ViewUserProps> = ({ navigation, route}) => {
  const [selfData, setSelfData] = useState<any | null>(null);
  const [userPostsData, setUserPostsData] = useState<any | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const axiosInstance = useAxios(navigation);
  let userPostEndpoint: string = '';
  let selfEndpoint: string = '';

  let userInfo: User | null = route.params?.userInfo;
  if (!route.params) {
    console.error('User parameter not found in route');
    Swal.fire({
      title: "User Not Found",
      icon: "error",
      toast: true,
      timer: 6000,
      position: 'top-right',
      timerProgressBar: true,
      showConfirmButton: false,
    });
    navigation.navigate('MainScreen', { screen: 'Search' }); // Redirect to search screen 
  }

  useEffect(() =>{
    const fetchUserPosts = async () => {
      try {
        let userId: number;
        if (userInfo) {
          userId = userInfo.id;
          if (Platform.OS === 'web' || Platform.OS === 'ios') {
            // Logic for web platform
            userPostEndpoint = url + 'user/profile/posts/'+userId.toString();
            
          } else {
            // Logic for Android platform and ther platforms
            userPostEndpoint = url + 'user/profile/posts/'+userId.toString();
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
  }, [userInfo]);

  useEffect(() => {
    if (Platform.OS === 'web' || Platform.OS === 'ios') {
      // Logic for web platform
      selfEndpoint = url + 'user/self/';
    } else {
      // Logic for Android platform and ther platforms
      selfEndpoint = 'http://10.0.0.2:8000/user/self/';
    }
    const fetchUserData = async () => {
      try {
        const result = await axiosInstance.get(selfEndpoint);
        setSelfData(result.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  /****** HOLDS DATA FOR CURRENT USER ********/
  let selfInfo: User | null = null;
  if (selfData) {
    const uInfo = JSON.parse(JSON.stringify(selfData));
    selfInfo = {
      id: uInfo.id,
      user: uInfo.user,
      username: uInfo.username,
      followers: uInfo.followers,
      following: uInfo.follow,
      posts: uInfo.posts,
      creation_time: uInfo.creation_time,
      profile_image: uInfo.profile_image,
      bio: uInfo.bio,
      location: uInfo.location,
      update_time: uInfo.update_time,
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
      likes: post.likes,
      song_post: post.song_post,
      playlist_post: post.playlist_post,
      album_post: post.album_post,
    }));
  }

  useEffect(() => {
    const checkFollowing = async () => {
      if (selfInfo && userInfo) { // Check if userInfo exists as well
        const followingList = selfInfo.following;
        const userId: number = userInfo.id;
        const isUserFollowing = followingList.includes(userId);
        setIsFollowing(isUserFollowing);
      }
    };
    checkFollowing();
  }, [selfInfo, userInfo]); // Include userInfo in the dependency array

  const followUser = () => {
    const followUserHelper = async () => {
      if (!userInfo) {
        console.error('Error following user: User data not found');
        return;
      }
      const followEndpoint = url + 'user/follow/';
      const jsonId = {
        "id": userInfo.id
      };
      try {
        const result = await axiosInstance.post(followEndpoint, jsonId);
        setIsFollowing(true);
        console.log("Followed user: ", result.data);
      } catch (error) {
        console.error('Error following user:', error);
      }
    }
    followUserHelper();
  };

  const unfollowUser = () => {
    const unfollowUserHelper = async () => {
      if (!userInfo) {
        console.error('Error following user: User data not found');
        return;
      }
      const unfollowEndpoint = url + 'user/follow/'+userInfo.id.toString();
      try {
        const result = await axiosInstance.delete(unfollowEndpoint);
        setIsFollowing(false);
        console.log("Unfollowed user: ", result.data);
      } catch (error) {
        console.error('Error unfollowing user:', error);
      }
    }
    unfollowUserHelper();
  };

/*
        {userInfo?.profile_image && (
          <View style={styles.container}>
            <Image style={styles.image} source={{uri: userInfo?.profile_image}}/>
          </View>
        )}
*/

  return (
    <Background>
      <Button mode="outlined" onPress={() => navigation.navigate('MainScreen', { screen: 'Search' })}>
        Back to Search
      </Button>
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
        {isFollowing ? (
          <Button mode="outlined" style={styles.unfButton} onPress={unfollowUser}>
            Unfollow
          </Button>
        ) : (
          <Button mode="outlined" style={styles.fButton} onPress={followUser}>
            Follow
          </Button>
        )}
        
        {userPostsData && (
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
  fButton: {
    opacity: 0.5,
    backgroundColor: 'green',
  },
  unfButton: {
    opacity: 0.5,
    backgroundColor: 'red',
  },
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
  image: {
    width: 60,
    height: 60,
  },
});

export default memo(ViewUser);