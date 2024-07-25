import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface NumberButtonProps {
  number: number;
  onPress: () => void;
  disabled: boolean;
  isCorrectNumber: boolean;
}

const NumberButton = ({
  number,
  onPress,
  disabled,
  isCorrectNumber,
}: NumberButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.disabledButton,
        isCorrectNumber && styles.correctButton,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{number}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  correctButton: {
    opacity: 0.3,
  },
});

export default NumberButton;
