import React, { memo } from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

type Props = {
  addSong: () => void;
};

const PlusSong = ({ addSong }: Props) => (
  <TouchableOpacity onPress={addSong} style={styles.container}>
    <Image style={styles.image} source={require('../assets/plus-add.png')} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 8,
    position: 'relative',
  },
  image: {
    width: 18,
    height: 18,
  },
});

export default memo(PlusSong);
