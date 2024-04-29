import React, { memo } from 'react';
import { theme } from '../core/theme';
import { TouchableOpacity, Image, StyleSheet, Text } from 'react-native';

type Props = {
  nav2User: () => void;
  username: string;
};

const Nav2User = ({ nav2User, username }: Props) => (
  <TouchableOpacity onPress={nav2User} style={styles.container}>
    <Text style={styles.addSongText}>{username}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  addSongText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.secondary,
  },
});

export default memo(Nav2User);
