import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = () => (
  <Image source={require('../assets/Elysium_Logo.png')} style={styles.image} />
);

const styles = StyleSheet.create({
  image: {
    width: 350,
    height: 100,
    marginBottom: 12,
  },
});

export default memo(Logo);
