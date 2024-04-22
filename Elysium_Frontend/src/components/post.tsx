import React, { memo, useEffect, useRef, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { theme } from '../core/theme';
import { Post } from '../utils/interfaces';
import PlusSong from './AddSong';
import  useAxios  from "../utils/useAxios";
import { Navigation, Route } from '../utils/types';
import Swal from 'sweetalert2';
import DropDownPicker from 'react-native-dropdown-picker';

interface UserPostProps {
  post: Post;
}

type Props = {
  navigation: Navigation;
};

/***********************************************************************
 * Depending on whether an album or playlist is embedded within the post,
 * need to update the setItems variable to include the songs within
 * the album or playlist. Display the first 3-5 songs in the media
 * container, then add a veiw more feature which will open a modal
 * to view the rest of the songs in the album or playlist (or populate
 * the next 5/10).
***********************************************************************/

const UserPost: React.FC<UserPostProps & Props> = ({ post, navigation }) => {
  const axiosInstance = useAxios(navigation);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'No Media', value: 'noMedia'},
  ]);

  const addSongToElysium = async () => {
    if (post.song_post) {
      try {
        const postData = {
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
        <Text style={styles.profile}>{post.profile_username}</Text>
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
        <View style={styles.mediaPostContainer}>
          <View style={styles.rowContainer}>
            <Image style={styles.image} source={{uri: post.song_post.song_thumbnail_location}}/>
            <Text style={styles.caption}>{post.song_post.name}</Text>
          </View>
        </View>
      ) : null}
      {post.album_post ? (
        <View style={styles.mediaPostContainer}>
          <View style={styles.rowContainer}>
            <Image style={styles.image} source={{uri: post.album_post.album_thumbnail_location}}/>
            <Text style={styles.caption}>{post.album_post.name}</Text>
          </View>
          <DropDownPicker
          open={open}
          value={value}
          items={items}
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          />
        </View>
      ) : null}
      {post.playlist_post ? (
        <View style={styles.mediaPostContainer}>
          <View style={styles.rowContainer}>
            <Image style={styles.image} source={{uri: post.playlist_post.playlist_thumbnail_location}}/>
            <Text style={styles.caption}>{post.playlist_post.name}</Text>
          </View>
          <DropDownPicker
          open={open}
          value={value}
          items={items}
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          />
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
});

export default UserPost;
