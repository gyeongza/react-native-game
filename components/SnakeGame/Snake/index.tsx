import { StyleSheet, View } from 'react-native';
import { Coordinate } from '../../types/types';
import { Fragment } from 'react';
import { Colors } from '../../styles/colors';

interface SnakeProps {
  snake: Coordinate[];
}

const Snake = ({ snake }: SnakeProps) => {
  return (
    <Fragment>
      {snake.map((segment, index: number) => {
        const segmentStyle = {
          left: segment.x * 10,
          top: segment.y * 10,
        };

        return <View key={index} style={[styles.snake, segmentStyle]} />;
      })}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  snake: {
    width: 15,
    height: 15,
    borderRadius: 7,
    backgroundColor: Colors.primary,
    position: 'absolute',
  },
});

export default Snake;
