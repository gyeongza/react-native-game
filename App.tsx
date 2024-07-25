import 'react-native-gesture-handler';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import GameScreen from './components/GameScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <GameScreen />
    </SafeAreaProvider>
  );
}
