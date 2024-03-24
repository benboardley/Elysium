import React, { memo, useEffect, useState, useContext } from 'react';
import Background from '../components/Background';
import Header from '../components/Header';
import { View, TextInput, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import PopUser from '../components/PopUsers';
import { Navigation } from '../utils/types';
import { makeAuthenticatedRequest } from '../helper'; // Import the makeAuthenticatedRequest function
import { Platform } from 'react-native';
import  useAxios  from "../utils/useAxios";
import jwtDecode from 'jwt-decode'
import { AuthContext } from '../context/AuthContext';
import { StripUser } from '../utils/interfaces';
import { theme } from '../core/theme';
import PlusSong from '../components/AddSong';
type Props = {
  navigation: Navigation;
};
  
const Search = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const axiosInstance = useAxios(navigation);
  let searchEndpoint: string = '';
  let users: StripUser[] = [];
  
  const handleSearch = async () => {
      console.log('Searching for:', searchQuery);
      if (Platform.OS === 'web' || Platform.OS === 'ios') {
          // Logic for web platform
          searchEndpoint = 'http://localhost:8000/user/search/'+searchQuery.toString();
          } else {
          // // Logic for Android platform and ther platforms
          searchEndpoint = 'http://10.0.0.2:8000/user/search/'+searchQuery.toString();
          }
      try {
          const result = await axiosInstance.get(searchEndpoint);
          setSearchResult(result.data);
      } catch (error) {
          console.error('Error fetching users:', error);
      }
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);
  
  /***** RETRIEVES ALL USERS MATCHING THE SEARCH *****/ 
  if (searchResult) {
  const searchInfo = searchResult.map((user: any) => JSON.parse(JSON.stringify(user)));
  users = searchInfo.map((user: any) => ({
      id: user.id,
      username: user.username,
  }));
  }  

  return (
    <Background>
      <View>
        <View style={styles.container}>
            <TextInput
            style={styles.input}
            placeholder="search"
            placeholderTextColor={theme.colors.black}
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
            />
            <View>
              <Button mode="outlined" onPress={handleSearch} style={styles.buttonContainer}>
                <Image
                  source={require('../assets/search-icon.png')}
                  style={{ tintColor: theme.colors.black, width: 25, height: 25 }}
                />
              </Button>
              </View>
          </View>
          <ScrollView>
              {searchResult && (
                  <React.Fragment>
                  {users.map(user => (
                      <PopUser user={user} navigation={navigation} />
                  ))}
                  </React.Fragment>
              )}
          </ScrollView>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonContainer: {
      height: 40,
      width: 25,
      borderWidth: 1,
      borderColor: theme.colors.black,
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
  });

export default memo(Search);