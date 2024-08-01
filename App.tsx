import { SafeAreaView, View } from 'react-native';
import BirdShitGame from './components/BirdShitGame';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SnakeGame from './components/SnakeGame';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// 메인 게임 컴포넌트
const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SnakeGame />
    </GestureHandlerRootView>
  );
};

export default App;
