import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, Text, TextStyle, ViewStyle } from 'react-native';
import { theme } from '../core/theme';

type Props = {
  mode?: 'text' | 'outlined';
  style?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactNode;
  onPress?: () => void;
};

const Button = ({ mode = 'text', style, textStyle, children, onPress }: Props) => (
  <TouchableOpacity
    style={[
      styles.button,
      mode === 'outlined' && { backgroundColor: theme.colors.button },
      style,
    ]}
    onPress={onPress}
  >
    <Text style={[styles.text, textStyle]}>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.button,
    backgroundColor: theme.colors.primary,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
    color: theme.colors.black,
  },
});

export default memo(Button);
