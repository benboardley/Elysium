import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ToggleButtonProps {
  label: string;
  onToggle: (value: boolean) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ label, onToggle }) => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    const newValue = !isActive;
    setIsActive(newValue);
    onToggle(newValue);
  };

  return (
    <TouchableOpacity onPress={handleToggle} activeOpacity={0.8}>
      <View style={[styles.container, isActive && styles.activeContainer]}>
        <Text style={[styles.label, isActive && styles.activeLabel]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeContainer: {
    backgroundColor: '#4caf50',
  },
  label: {
    color: '#333',
  },
  activeLabel: {
    color: '#fff',
  },
});

export default ToggleButton;
