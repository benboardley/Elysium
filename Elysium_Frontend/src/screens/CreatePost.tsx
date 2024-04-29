import React, { memo, useEffect, useRef, useState, useContext } from 'react';
import Background from '../components/Background';
import Header from '../components/Header';
import { View, TextInput, Text, StyleSheet, ScrollView, Image, Modal } from 'react-native';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { Navigation } from '../utils/types';
import { makeAuthenticatedRequest } from '../helper'; // Import the makeAuthenticatedRequest function
import { Platform } from 'react-native';
import  useAxios  from "../utils/useAxios";
import jwtDecode from 'jwt-decode'
import { AuthContext } from '../context/AuthContext';
import { theme } from '../core/theme';
import { StripSong, StripAlbum, StripPost, StripPlaylist } from '../utils/interfaces';
import { playlistType } from '../utils/types';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { SearchSource } from 'jest';
import {url} from '../utils/url';
type Props = {
  navigation: Navigation;
};
  
const CreatePost = ({ navigation }: Props) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedSong, setSelectedSong] = useState<any | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'No Media', value: 'noMedia'},
    {label: 'Song', value: 'song'},
    {label: 'Album', value: 'album'},
    {label: 'Playlist', value: 'playlist'}
  ]);
  const [isModalVisible, setModalVisible] = useState(false);
  const axiosInstance = useAxios(navigation);
  let searchEndpoint: string = '';

  const [songSearchQuery, setSongSearchQuery] = useState('');
  const [songSearchResult, setSongSearchResult] = useState<any | null>(null);

  const [albumSearchQuery, setAlbumSearchQuery] = useState('');
  const [albumSearchResult, setAlbumSearchResult] = useState<any | null>(null);

  const [playlistSearchResult, setPlaylistSearchResult] = useState<any | null>(null);
  
  const handleNavAway = () => {
      setModalVisible(true);
  };
  
  const handleYes = () => {
      setModalVisible(false);
      navigation.navigate('MainScreen', { screen: 'Feed' });
  };
  
  const handleNo = () => {
      setModalVisible(false);
  };

  /***** SEARCH FOR SONGS *****/
  const handleSongSearch = async () => {
    if (!songSearchQuery) return;
    console.log('Searching for:', songSearchQuery);
    if (Platform.OS === 'web' || Platform.OS === 'ios') {
        // Logic for web platform
        searchEndpoint = url + 'music/song/'+songSearchQuery.toString();
        } else {
        // // Logic for Android platform and ther platforms
        searchEndpoint = 'http://10.0.0.2:8000/music/song/'+songSearchQuery.toString();
        }
    try {
        const result = await axiosInstance.get(searchEndpoint);
        setSongSearchResult(result.data);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    handleSongSearch();
    console.log('Song search result:', JSON.stringify(songSearchResult));
  }, [songSearchQuery]);

  useEffect(() => {
    console.log('Song search result:', JSON.stringify(songSearchResult));
  }, [selectedSong]);


  /***** SEARCH FOR ALBUMS *****/
  const handleAlbumSearch = async () => {
    if (!albumSearchQuery) return;
    console.log('Searching for:', albumSearchQuery);
    if (Platform.OS === 'web' || Platform.OS === 'ios') {
        // Logic for web platform
        searchEndpoint = url + 'music/album/'+albumSearchQuery.toString();
        } else {
        // // Logic for Android platform and ther platforms
        searchEndpoint = 'http://10.0.0.2:8000/music/album/'+albumSearchQuery.toString();
        }
    try {
        const result = await axiosInstance.get(searchEndpoint);
        setAlbumSearchResult(result.data);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    handleAlbumSearch();
    console.log('Album search result:', JSON.stringify(albumSearchResult));
  }, [albumSearchQuery]);

  useEffect(() => {
    console.log('Album search result:', JSON.stringify(albumSearchResult));
  }, [selectedAlbum]);


  /***** SEARCH FOR Playlists *****/
  const handleLoadPlaylists = async () => {
    if (Platform.OS === 'web' || Platform.OS === 'ios') {
        // Logic for web platform
        searchEndpoint = url + 'music/spotify/playlists';
        } else {
        // // Logic for Android platform and ther platforms
        searchEndpoint = 'http://10.0.0.2:8000/music/spotify/playlists';
    }
    try {
        const result = await axiosInstance.get(searchEndpoint);
        console.log('Playlist search result:', result.data);
        setPlaylistSearchResult(result.data);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    console.log('Playlist search results:', JSON.stringify(playlistSearchResult));
  }, [selectedPlaylist]);

  /***** RETRIEVES ALL MEDIA MATCHING THE SEARCH *****/
  let songs: StripSong[] = [];
  if (songSearchResult) {
    const searchInfo = songSearchResult.map((song: any) => JSON.parse(JSON.stringify(song)));
    songs = searchInfo.map((song: any) => ({
        name: song.name,
        artist: song.artist,
        uri: song.uri,
        song_thumbnail_location: song.song_thumbnail_location,
    }));
  }

  let albums: StripAlbum[] = [];
  if (albumSearchResult) {
    const searchInfo = albumSearchResult.map((album: any) => JSON.parse(JSON.stringify(album)));
    albums = searchInfo.map((album: any) => ({
        name: album.name,
        artist: album.artist,
        uri: album.uri,
        album_thumbnail_location: album.album_thumbnail_location,
    }));
  }

  let playlists: StripPlaylist[] = [];
  if (playlistSearchResult && playlistSearchResult.playlists) {
    playlists = playlistSearchResult.playlists.map((playlist: any) => ({
      name: playlist[0],
      id: playlist[1],
      uri: playlist[2],
      thumbnail: playlist[3],
    }));
  }

  const handlePost = async () => {
    let data: StripPost = {
        "title": title,
        "caption": content,
    };
    if (value === 'song' && selectedSong) {
      data["song_uri"] = selectedSong.uri;
    } else if (value === 'album' && selectedAlbum) {
      data["album_uri"] = selectedAlbum.uri;
    } else if (value === 'playlist' && selectedPlaylist) {
      data["playlist_uri"] = selectedPlaylist.uri;
    }
    if (Platform.OS === 'web' || Platform.OS === 'ios') {
      // Logic for web platform
      searchEndpoint = url + 'social/posts/';
    } else {
      // Logic for Android platform and ther platforms
      searchEndpoint = url + 'social/posts/';
    }
    try {
        const result = await axiosInstance.post(searchEndpoint, data);
        console.log("Post made!", result.data);
        navigation.navigate('MainScreen', { screen: 'Feed' });
    } catch (error) {
        console.error('Error creating post:', error);
        console.log('Data:', data);
    }
  };
   

  return (
  <Background>
    <Button
    mode="outlined"
    onPress={handleNavAway}>
        <View style={styles.searchContainer}>
        <Image
            source={require('../assets/arrow_back.png')}
            style={{ tintColor: theme.colors.black, width: 25, height: 25 }}
        />
        <Text>Exit</Text>
        </View>
    </Button>
    <ScrollView>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Header>Create Post</Header>
        <View style={styles.container}>
            <Paragraph>
                <TextInput
                style={styles.input}
                placeholder="Title"
                placeholderTextColor={theme.colors.black}
                value={title}
                onChangeText={title => setTitle(title)}
                />
            </Paragraph>
            <Paragraph>
            <TextInput
            style={styles.input}
            placeholder="content"
            placeholderTextColor={theme.colors.black}
            value={content}
            onChangeText={content => setContent(content)}
            />
            </Paragraph>
        </View>
        <Paragraph>Choose a Media Type (optional):</Paragraph>
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
        
        {value === 'song' && selectedSong && (
            <View>
                <View style={styles.container}>
                    <Text style={styles.title}>Selected Song</Text>
                </View>
                <View style={styles.idvContainer}>
                    <View style={styles.searchContainer}>
                        <Image style={styles.image} source={{uri: selectedSong.song_thumbnail_location}}/>
                        <View>
                        <Text style={styles.title} numberOfLines={2}>{selectedSong.name}</Text>
                        <Text style={styles.artist} numberOfLines={1}>By: {selectedSong.artist}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )}
        {value === 'song' && (
        <View style={styles.conditionalContainer}>
            <Header>Search for a song!</Header>
            <View style={styles.searchContainer}>
                <TextInput
                style={styles.input}
                placeholder="search"
                placeholderTextColor={theme.colors.black}
                value={songSearchQuery}
                onChangeText={text => setSongSearchQuery(text)}
                />
                <View>
                <Button 
                    mode="outlined" 
                    onPress={handleSongSearch} 
                    style={styles.buttonImageContainer}>
                        <Image
                        source={require('../assets/search-icon.png')}
                        style={{ tintColor: theme.colors.black, width: 25, height: 25 }}
                        />
                </Button>
                </View>
            </View>
            <View>
                {(songSearchResult && songSearchQuery) ? (
                <React.Fragment>
                    {songs.map(song => (
                    <React.Fragment>
                        <View>
                            <Button
                            mode="outlined"
                            style={styles.idvContainer}
                            onPress={() => setSelectedSong(
                                { uri: song.uri,
                                  name: song.name,
                                  artist: song.artist,
                                  song_thumbnail_location: song.song_thumbnail_location
                                })}>
                                <View style={styles.searchContainer}>
                                    <Image style={styles.image} source={{uri: song.song_thumbnail_location}}/>
                                    <View>
                                    <Text style={styles.title} numberOfLines={2}>{song.name}</Text>
                                    <Text style={styles.artist} numberOfLines={1}>By: {song.artist}</Text>
                                    </View>
                                </View>
                            </Button>
                        </View>
                    </React.Fragment>
                    ))}
                </React.Fragment>
                ) : null}
            </View>
        </View>
        )}

        {value === 'album' && selectedAlbum && (
            <View>
                <View style={styles.container}>
                    <Text style={styles.title}>Selected Album</Text>
                </View>
                <View style={styles.idvContainer}>
                    <View style={styles.searchContainer}>
                        <Image style={styles.image} source={{uri: selectedAlbum.album_thumbnail_location}}/>
                        <View>
                        <Text style={styles.title} numberOfLines={2}>{selectedAlbum.name}</Text>
                        <Text style={styles.artist} numberOfLines={1}>By: {selectedAlbum.artist}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )}
        {value === 'album' && (
        <View style={styles.conditionalContainer}>
            <Header>Search for an album!</Header>
            <View style={styles.searchContainer}>
                <TextInput
                style={styles.input}
                placeholder="search"
                placeholderTextColor={theme.colors.black}
                value={albumSearchQuery}
                onChangeText={text => setAlbumSearchQuery(text)}
                />
                <View>
                <Button 
                    mode="outlined" 
                    onPress={handleAlbumSearch} 
                    style={styles.buttonImageContainer}>
                        <Image
                        source={require('../assets/search-icon.png')}
                        style={{ tintColor: theme.colors.black, width: 25, height: 25 }}
                        />
                </Button>
                </View>
            </View>
            <View>
                {(albumSearchResult && albumSearchQuery) ? (
                <React.Fragment>
                    {albums.map(album => (
                    <React.Fragment>
                        <View>
                            <Button
                            mode="outlined"
                            style={styles.idvContainer}
                            onPress={() => setSelectedAlbum(
                                { uri: album.uri,
                                  name: album.name,
                                  artist: album.artist,
                                  album_thumbnail_location: album.album_thumbnail_location
                                })}>
                                <View style={styles.searchContainer}>
                                    <Image style={styles.image} source={{uri: album.album_thumbnail_location}}/>
                                    <View>
                                    <Text style={styles.title} numberOfLines={2}>{album.name}</Text>
                                    <Text style={styles.artist} numberOfLines={1}>By: {album.artist}</Text>
                                    </View>
                                </View>
                            </Button>
                        </View>
                    </React.Fragment>
                    ))}
                </React.Fragment>
                ) : null}
            </View>
        </View>
        )}

        {value === 'playlist' && selectedPlaylist && (
            <View>
                <View style={styles.container}>
                    <Text style={styles.title}>Selected Playlist</Text>
                </View>
                <View style={styles.idvContainer}>
                    <View style={styles.searchContainer}>
                        <Image style={styles.image} source={{uri: selectedPlaylist.thumbnail}}/>
                        <View>
                        <Text style={styles.title} numberOfLines={2}>{selectedPlaylist.name}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )}
        {value === 'playlist' && (
        <View>
            <View style={styles.searchContainer}>
                <Button 
                    mode="outlined" 
                    onPress={handleLoadPlaylists}>
                    Load Playlists!
                </Button>
            </View>
            {playlists.map(playlist => (
                <React.Fragment>
                    <View>
                        <Button
                        mode="outlined"
                        style={styles.idvContainer}
                        onPress={() => setSelectedPlaylist(
                            { name: playlist.name,
                                uri: playlist.uri,
                                id: playlist.id,
                                thumbnail: playlist.thumbnail
                            })}>
                            <View style={styles.searchContainer}>
                                <Image style={styles.image} source={{uri: playlist.thumbnail}}/>
                                <View>
                                <Text style={styles.title} numberOfLines={2}>{playlist.name}</Text>
                                </View>
                            </View>
                        </Button>
                    </View>
                </React.Fragment>
            ))}
        </View>
        )}
    </ScrollView>
    <Button 
        mode="outlined" 
        onPress={handlePost}>
        POST!
    </Button>
    <Text style={styles.smallText}>***ALL FIELDS REQUIRED***</Text>
    {/* Modal confirmation */}
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
    <View style={styles.container}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 }}>
        <Paragraph>If you leave, your post will not be saved!</Paragraph>
        <Paragraph>Are you sure you want to leave?</Paragraph>
        <View style={styles.buttonContainer}>
            <Button mode="outlined" style={styles.idvContainer} onPress={handleYes}>Yes</Button>
            <Button mode="outlined" style={styles.idvContainer} onPress={handleNo}>No</Button>
        </View>
        </View>
    </View>
    </Modal>
  </Background>
  );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    idvContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.black,
      },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20 
    },
    buttonImageContainer: {
        height: 40,
        width: 25,
        borderWidth: 1,
        borderColor: theme.colors.black
    },
    conditionalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: theme.colors.offwhite,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.colors.black
    },
    input: {
      height: 40,
      backgroundColor: theme.colors.offwhite,
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.colors.primary,
      borderWidth: 1,
      borderColor: theme.colors.black,
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
    image: {
        width: 60,
        height: 60,
        marginRight: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    artist: {
        fontSize: 14,
        color: theme.colors.secondary,
    },
    smallText: {
        fontSize: 10,
        color: theme.colors.secondary,
        textAlign: 'center',
    }
  });

export default memo(CreatePost);