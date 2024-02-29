import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { theme } from '../core/theme';
import { Post } from '../utils/interfaces';
import PlusSong from './AddSong';
import  useAxios  from "../utils/useAxios";
import { Navigation, Route } from '../utils/types';
import Swal from 'sweetalert2';

interface UserPostProps {
  post: Post;
}

type Props = {
  navigation: Navigation;
};

const UserPost: React.FC<UserPostProps & Props> = ({ post, navigation }) => {
  const axiosInstance = useAxios(navigation);

  const addSongToElysium = async () => {
    if (post.song_post) {
      try {
        const postData = {
          // Your data to be sent in the request body
          // For example, if you're sending JSON data:
          uri: [post.song_post.uri],
          location: 'Elysium',
        };
  
        const result = await axiosInstance.post('http://localhost:8000/music/spotify/songs', postData);
        console.log('Post created successfully:', result.data);
        if (result.status === 200) {
          Swal.fire({
            title: "Song Added Successfully",
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
  
        // Optionally, you can update your state or perform other actions
        // setPostData(result.data);
  
      } catch (error) {
        console.error('Error creating post:', error);
        Swal.fire({
          title: "Song Failed to Add :(",
          icon: "error",
          toast: true,
          timer: 6000,
          position: 'top-right',
          timerProgressBar: true,
          showConfirmButton: false,
      });
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Text style={styles.profile}>{post.profile}</Text>
        {post.song_post ? (
        <View style={styles.header}>
          <Text style={styles.addSongText}>Add Song</Text>
          <PlusSong addSong={addSongToElysium}/>
        </View>
        ) : null}
      </View>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.caption}>{post.caption}</Text>
      {post.song_post ? (
        <View style={styles.songPostContainer}>
          <Image style={styles.image} source={{uri: post.song_post.song_thumbnail_location}}/>
          <Text style={styles.caption}>{post.song_post.name}</Text>
        </View>
      ) : null}
      <Text style={styles.footer}>{post.creation_time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
    marginBottom: 2,
    fontSize: 12,
    color: theme.colors.secondary,
  },
  songPostContainer: {
    backgroundColor: theme.colors.songBackground,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  profile: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  creation_time: {
    fontSize: 12,
    color: theme.colors.secondary,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: theme.colors.black,
  },
  caption: {
    fontSize: 16,
    padding: 4,
    color: theme.colors.black,
  },
  addSongText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.secondary,
  },
});

export default UserPost;
