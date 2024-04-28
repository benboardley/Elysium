import React, { memo, useEffect, useRef, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { theme } from '../core/theme';
import { Post } from '../utils/interfaces';
import PlusSong from './AddSong';
import Nav2User from './Nav2User';
import  useAxios  from "../utils/useAxios";
import { Navigation, Route } from '../utils/types';
import { User, StripUser } from '../utils/interfaces';
//import { StripSong, StripAlbum, StripPost } from '../utils/interfaces';
import { stripSongType } from '../utils/types';
import Button from './Button';
import Swal from 'sweetalert2';
import DropDownPicker from 'react-native-dropdown-picker';
import Paragraph from './Paragraph';
import {url} from '../utils/url';
interface UserPostProps {
  post: Post;
}

type Props = {
  navigation: Navigation;
};

const UserPost: React.FC<UserPostProps & Props> = ({ post, navigation }) => {
  const axiosInstance = useAxios(navigation);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

/*   const addSongToElysium = async () => {
    if (post.song_post) {
      try {
        const postData = {
          uri: [post.song_post.uri],
          location: 'Elysium',
        };
        const result = await axiosInstance.post('http://localhost:8000/music/spotify/songs', postData);
        console.log('Post created successfully:', result.data);
        showSwalNotification(result.status);
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }
  };*/

  let songs: stripSongType[] = [];
  if (post.album_post) {
    const searchInfo = post.album_post.songs.map((song: any) => JSON.parse(JSON.stringify(song)));
    songs = searchInfo.map((song: any) => ({
        pk: song.pk,
        name: song.name,
        artist: song.artist,
        uri: song.uri,
        song_thumbnail_location: song.song_thumbnail_location,
    }));
  } else if (post.playlist_post) {
    const searchInfo = post.playlist_post.songs.map((song: any) => JSON.parse(JSON.stringify(song)));
    songs = searchInfo.map((song: any) => ({
        pk: song.pk,
        name: song.name,
        artist: song.artist,
        uri: song.uri,
        song_thumbnail_location: song.song_thumbnail_location,
    }));
  }

  const showSwalNotification = (status: any) => {
    if (status === 200) {
      Swal.fire({
        title: "Media Added Successfully",
        icon: "success",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: "Error Adding Media",
        icon: "error",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const go2User = async () => {
    let userData = null;
    let searchEndpoint = '';
    if (Platform.OS === 'web' || Platform.OS === 'ios') {
      // Logic for web platform
      searchEndpoint = 'http://localhost:8000/user/profile/' + post.profile.toString();
    } else {
      // Logic for Android platform and other platforms
      searchEndpoint = 'http://10.0.0.2:8000/user/profile/' + post.profile.toString();
    }
    try {
      const result = await axiosInstance.get(searchEndpoint);
      userData = result.data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    let userInfo = null;
    if (userData) {
      const uInfo = JSON.parse(JSON.stringify(userData));
      userInfo = {
        id: uInfo.id,
        user: uInfo.user,
        username: uInfo.username,
        followers: uInfo.followers,
        following: uInfo.follow,
        posts: uInfo.posts,
        creation_time: uInfo.creation_time,
        bio: uInfo.bio,
        location: uInfo.location,
        update_time: uInfo.update_time,
      };
    }
    navigation.navigate('ViewUser', { userInfo: userInfo });
  }

  const addSongToElysium = async () => {
    if (post.song_post) {
      try {
        const postData = {
          uri: [post.song_post.uri],
          location: 'Elysium',
        };
        const result = await axiosInstance.post(url + 'music/spotify/songs', postData);
        console.log('Song added successfully:', result.data);
        showSwalNotification(result.status);
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }
  };

  const addPlaylistToElysium = async () => {
    if (post.playlist_post) {
      console.log('Adding playlist to Elysium:', post.playlist_post.uri)
      try {
        const postData = {
          uri: post.playlist_post.uri,
        };
        const result = await axiosInstance.post(url + 'music/spotify/playlists', postData);
        console.log('Playlist added successfully:', result.data);
        showSwalNotification(result.status);
      } catch (error) {
        showSwalNotification(0);
        console.error('Error creating post:', error);
      }
    }
  };
/*
        <View style={styles.header}>
          <Nav2User nav2User={go2User} username={post.profile_username}/>
        </View>
*/
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={go2User}>
          <Text style={styles.addSongText}>{post.profile_username}</Text>
        </TouchableOpacity>
        {post.song_post ? (
        <View style={styles.header}>
          <Text style={styles.addSongText}>Add Song</Text>
          <PlusSong addSong={addSongToElysium}/>
        </View>
        ) : null}
        {post.playlist_post ? (
        <View style={styles.header}>
          <Text style={styles.addSongText}>Add Playlist</Text>
          <PlusSong addSong={addPlaylistToElysium}/>
        </View>
        ) : null}
        {post.album_post ? (
        <View style={styles.header}>
          <Text style={styles.addSongText}>Album Post</Text>
        </View>
        ) : null}
      </View>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.caption}>{post.caption}</Text>
      {post.song_post ? (
        <View style={styles.mediaPostContainer}>
          <View style={styles.rowContainer}>
            <Image style={styles.image} source={{uri: post.song_post.song_thumbnail_location}}/>
            <Text style={styles.caption}>{post.song_post.name}</Text>
          </View>
        </View>
      ) : null}
      {post.album_post ? (
        <ScrollView style={styles.mediaContainer}>
        <View style={styles.mediaPostContainer}>
          <View style={styles.rowContainer}>
            <Image style={styles.image} source={{uri: post.album_post.album_thumbnail_location}}/>
            <Text style={styles.caption}>{post.album_post.name}</Text>
          </View>
          <Paragraph>Song List:</Paragraph>
          {songs ? (
            songs.map((song: any) => (
            <Text key={song.pk} style={styles.songText}>{song.name}</Text>
          )))
          : null}
        </View>
        </ScrollView>
      ) : null}
      {post.playlist_post ? (
        <ScrollView style={styles.mediaContainer}>
        <View style={styles.mediaPostContainer}>
          <View style={styles.rowContainer}>
            <Image style={styles.image} source={{uri: post.playlist_post.playlist_thumbnail_location}}/>
            <Text style={styles.caption}>{post.playlist_post.name}</Text>
          </View>
          {songs ? (
            songs.map((song: any) => (
            <Text key={song.pk} style={styles.songText}>{song.name}</Text>
          )))
          : null}
        </View>
        </ScrollView>
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
  mediaContainer: {
    height: 200, // Adjust the height according to your requirement
  },
  mediaPostContainer: {
    backgroundColor: theme.colors.songBackground,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  rowContainer: {
    flexDirection: 'row',
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
    padding: 8,
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
  dropdownContainer: {
    height: 40,
    marginBottom: 10,
  },
  dropdown: {
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
  },
  songText: {
    fontSize: 12,
    marginBottom: 5,
    color: theme.colors.primary,
  },
});

export default UserPost;