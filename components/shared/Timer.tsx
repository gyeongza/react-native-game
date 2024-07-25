import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
}

const Timer = ({ duration, onTimeUp }: TimerProps) => {
  const [remainingTime, setRemainingTime] = useState(duration);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (remainingTime === 0) {
      onTimeUp();
    }
  }, [remainingTime, onTimeUp]);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>Time: {remainingTime}s</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Timer;
