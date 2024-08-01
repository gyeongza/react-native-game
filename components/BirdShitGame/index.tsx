import React, { useRef, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  GameEngine,
  GameEngineUpdateEventOptionType,
} from 'react-native-game-engine';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

// 상수 및 타입 정의
const CONSTANTS = {
  CHARACTER_SIZE: 50,
  POOP_SIZE: 30,
  POOP_SPAWN_RATE: 0.1,
  MAX_POOPS: 10,
  POOP_SPEED: 5,
};

type Position = { x: number; y: number };

interface CharacterEntity {
  position: Position;
  renderer: JSX.Element;
}

interface PoopEntity {
  position: Position;
  renderer: JSX.Element;
}

interface Entities {
  character: CharacterEntity;
  [key: string]: CharacterEntity | PoopEntity;
}

// 컴포넌트 정의
const Character: React.FC<{ position: Position }> = ({ position }) => (
  <View style={[styles.character, { left: position.x, bottom: position.y }]} />
);

const Poop: React.FC<{ position: Position }> = ({ position }) => (
  <View style={[styles.poop, { left: position.x, bottom: position.y }]} />
);

// 게임 시스템 정의
const moveCharacter = (
  entities: Entities,
  { touches }: GameEngineUpdateEventOptionType
): Entities => {
  touches
    .filter((t) => t.type === 'move')
    .forEach((t) => {
      if (t.event) {
        entities.character.position.x = Math.max(
          0,
          Math.min(
            WIDTH - CONSTANTS.CHARACTER_SIZE,
            t.event.pageX - CONSTANTS.CHARACTER_SIZE / 2
          )
        );
      }
    });
  return entities;
};

const createPoop = (entities: Entities): Entities => {
  const poops = Object.keys(entities).filter((key) => key.startsWith('poop'));

  if (
    Math.random() < CONSTANTS.POOP_SPAWN_RATE &&
    poops.length < CONSTANTS.MAX_POOPS
  ) {
    const id = `poop-${Date.now()}`;
    entities[id] = {
      position: { x: Math.random() * (WIDTH - CONSTANTS.POOP_SIZE), y: HEIGHT },
      renderer: <Poop position={{ x: 0, y: 0 }} />,
    };
  }
  return entities;
};

const movePoop = (entities: Entities): Entities => {
  Object.keys(entities).forEach((key) => {
    if (key.startsWith('poop')) {
      const poop = entities[key] as PoopEntity;
      poop.position.y -= CONSTANTS.POOP_SPEED;
      if (poop.position.y + CONSTANTS.POOP_SIZE < 0) {
        delete entities[key];
      }
    }
  });
  return entities;
};

const COLLISION_THRESHOLD = 0.7; // 충돌 감지 임계값 (0.0 ~ 1.0)

const checkCollisions = (
  entities: Entities,
  { dispatch }: GameEngineUpdateEventOptionType
): Entities => {
  const character = entities.character;
  const charCenter = {
    x: character.position.x + CONSTANTS.CHARACTER_SIZE / 2,
    y: character.position.y + CONSTANTS.CHARACTER_SIZE / 2,
  };

  Object.keys(entities).forEach((key) => {
    if (key.startsWith('poop')) {
      const poop = entities[key] as PoopEntity;
      const poopCenter = {
        x: poop.position.x + CONSTANTS.POOP_SIZE / 2,
        y: poop.position.y + CONSTANTS.POOP_SIZE / 2,
      };

      const distance = Math.sqrt(
        Math.pow(charCenter.x - poopCenter.x, 2) +
          Math.pow(charCenter.y - poopCenter.y, 2)
      );

      const collisionDistance =
        ((CONSTANTS.CHARACTER_SIZE + CONSTANTS.POOP_SIZE) / 2) *
        COLLISION_THRESHOLD;

      if (distance < collisionDistance) {
        dispatch && dispatch({ type: 'game-over' });
      }
    }
  });
  return entities;
};

// 메인 게임 컴포넌트
const BirdShitGame = () => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const engineRef = useRef<GameEngine | null>(null);

  const onEvent = useCallback((e: { type: string }) => {
    if (e.type === 'game-over') {
      setGameOver(true);
      engineRef.current?.stop();
    }
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setGameOver(false);
    if (engineRef.current) {
      engineRef.current.swap({
        character: {
          position: { x: WIDTH / 2 - CONSTANTS.CHARACTER_SIZE / 2, y: 50 },
          renderer: <Character position={{ x: 0, y: 0 }} />,
        },
      });
      engineRef.current.start();
    }
  }, []);

  const updateScore = useCallback((entities: Entities): Entities => {
    setScore((prevScore) => prevScore + 1);
    return entities;
  }, []);

  return (
    <View style={styles.container}>
      <GameEngine
        ref={engineRef}
        style={styles.gameEngine}
        systems={[
          moveCharacter,
          createPoop,
          movePoop,
          checkCollisions,
          updateScore,
        ]}
        entities={{
          character: {
            position: { x: WIDTH / 2 - CONSTANTS.CHARACTER_SIZE / 2, y: 50 },
            renderer: <Character position={{ x: 0, y: 0 }} />,
          },
        }}
        onEvent={onEvent}
        running={!gameOver}
      >
        <Text style={styles.score}>Score: {score}</Text>
        {gameOver && (
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOver}>Game Over!</Text>
            <Text style={styles.finalScore}>Final Score: {score}</Text>
            <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
              <Text style={styles.restartButtonText}>Restart</Text>
            </TouchableOpacity>
          </View>
        )}
      </GameEngine>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  gameEngine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  character: {
    position: 'absolute',
    width: CONSTANTS.CHARACTER_SIZE,
    height: CONSTANTS.CHARACTER_SIZE,
    backgroundColor: 'blue',
    borderRadius: CONSTANTS.CHARACTER_SIZE / 2,
  },
  poop: {
    position: 'absolute',
    width: CONSTANTS.POOP_SIZE,
    height: CONSTANTS.POOP_SIZE,
    backgroundColor: 'brown',
    borderRadius: CONSTANTS.POOP_SIZE / 2,
  },
  score: {
    position: 'absolute',
    top: 20,
    left: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  gameOver: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 20,
  },
  finalScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default BirdShitGame;
