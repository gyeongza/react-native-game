import { StyleSheet, Text } from 'react-native';
import { Coordinate } from '../../../types/types';

const Food = ({ x, y }: Coordinate) => {
  return <Text style={[{ top: y * 10, left: x * 10 }, styles.food]}>🪳</Text>;
};

const styles = StyleSheet.create({
  food: {
    width: 50,
    height: 50,
    borderRadius: 7,
    position: 'absolute',
  },
});

export default Food;
