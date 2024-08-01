import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScoreDisplay from '../shared/ScoreDisplay';
import Timer from '../shared/Timer';
import NumberButton from '../shared/NumberButton';

const TOTAL_NUMBERS = 9;
const TIMER_DURATION = 60;

const NumberTabGame = () => {
  const [score, setScore] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [numbers, setNumbers] = useState<number[]>([]);
  const nums = Array.from({ length: TOTAL_NUMBERS }, (_, index) => index + 1);

  useEffect(() => {
    generateRandomNumbers();
  }, []);

  useEffect(() => {
    if (timeUp || gameOver) {
      handleGameOver();
    }
  }, [timeUp, gameOver]);

  const generateRandomNumbers = () => {
    const randomNumbers = [...nums];

    for (let i = randomNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomNumbers[i], randomNumbers[j]] = [
        randomNumbers[j],
        randomNumbers[i],
      ];
    }

    setNumbers(randomNumbers);
  };

  const handleNumberPress = (number: number) => {
    if (number === nums[score]) {
      if (score + 1 === TOTAL_NUMBERS) {
        generateRandomNumbers();
        setScore(0);
      } else {
        setScore(score + 1);
      }
    } else {
      setGameOver(true);
    }
  };

  const handleGameOver = () => {
    alert('게임 오버!');
  };

  const restartGame = () => {
    setScore(0);
    setTimeUp(false);
    setGameOver(false);
    generateRandomNumbers();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Number Tap Game</Text>
      <ScoreDisplay score={score} />
      <Timer duration={TIMER_DURATION} onTimeUp={() => setTimeUp(true)} />
      <View style={styles.buttonContainer}>
        {numbers.map((number) => (
          <NumberButton
            key={number}
            number={number}
            onPress={() => handleNumberPress(number)}
            disabled={timeUp || gameOver || score > nums.indexOf(number)}
            isCorrectNumber={score > nums.indexOf(number)}
          />
        ))}
      </View>
      {(timeUp || gameOver) && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
            <Text style={styles.restartButtonText}>Restart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gameOverContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  },
  restartButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  restartButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default NumberTabGame;
