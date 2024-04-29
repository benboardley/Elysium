import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { theme } from '../core/theme';

type Props = {
  children: React.ReactNode;
};

const SubHeading = ({ children }: Props) => (
  <Text style={styles.subheading}>{children}</Text>
);

const styles = StyleSheet.create({
  subheading: {
    fontSize: 20,
    color: theme.colors.secondary,
    fontWeight: 'bold',
    paddingVertical: 14,
  },
});

export default memo(SubHeading);