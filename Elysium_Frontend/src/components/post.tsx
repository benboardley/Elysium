import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../core/theme';
import { Post } from '../utils/interfaces';
import PlusSong from '../components/AddSong';
import { Navigation, Route } from '../types';

interface UserPostProps {
  post: Post;
}

type Props = {
  navigation?: Navigation;
};

const UserPost: React.FC<UserPostProps & Props> = ({ post, navigation }) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Text style={styles.profile}>{post.profile}</Text>
        <View style={styles.header}>
          <Text style={styles.addSongText}>Add Song</Text>
          <PlusSong addSong={() => navigation.navigate('MainScreen', { screen: 'Dashboard' })} />
        </View>
      </View>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.caption}>{post.caption}</Text>
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
    marginBottom: 8,
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
    marginBottom: 8,
    color: theme.colors.black,
  },
  caption: {
    fontSize: 16,
    color: theme.colors.black,
  },
  addSongText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.secondary,
  },
});

export default UserPost;

/*
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../core/theme';
import { Post } from '../utils/interfaces';

interface UserPostProps {
  post: Post;
}

const UserPost: React.FC<UserPostProps> = ({ post }) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.profile, { color: theme.colors.primary }]}>{post.profile}</Text>
      <Text style={[styles.title, { color: theme.colors.primary }]}>{post.title}</Text>
      <Text style={[styles.caption, { color: theme.colors.white }]}>{post.caption}</Text>
      <Text style={[styles.creation_time, { color: theme.colors.white }]}>{post.creation_time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  profile: {
    top: 0,
    right: 0,
    margin: 15,
    fontSize: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  caption: {
    fontSize: 16,
  },
  creation_time: {
    fontSize: 16,
  }
});

export default UserPost;
*/
