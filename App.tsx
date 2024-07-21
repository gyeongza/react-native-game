import 'react-native-gesture-handler';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import HomeScreen from './components/HomeScreen';
import CreatorScreen from './components/CreatorScreen';
import AboutScreen from './components/AboutScreen';
import {
  Center,
  extendTheme,
  Heading,
  HStack,
  Icon,
  NativeBaseProvider,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

const theme = extendTheme({});
const getIcon = (screenName: string) => {
  switch (screenName) {
    case 'Home':
      return 'home';
    case 'About':
      return 'information';
    case 'Creator':
      return 'fire';
    default:
      return undefined;
  }
};

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      <Center>
        <Heading color={'secondary.500'}>Menu</Heading>
      </Center>
      <VStack my={2} mx={1} space={3}>
        {props.state.routeNames.map((name: string, index: number) => (
          <Pressable
            key={index}
            py={3}
            px={5}
            rounded="md"
            onPress={(e) => props.navigation.navigate(name)}
            bg={index === props.state.index ? 'secondary.100' : 'transparent'}
          >
            <HStack p={1} space={4} alignItems="center">
              <Icon
                size={5}
                color={
                  index === props.state.index ? 'secondary.600' : 'gray.700'
                }
                as={
                  <MaterialCommunityIcons
                    name={getIcon(name)}
                  ></MaterialCommunityIcons>
                }
              ></Icon>
              <Text
                fontWeight={500}
                color={
                  index === props.state.index ? 'secondary.600' : 'gray.700'
                }
              >
                {name}
              </Text>
            </HStack>
          </Pressable>
        ))}
      </VStack>
    </DrawerContentScrollView>
  );
};

export default function App() {
  const headerStyle = {
    headerStyle: {
      backgroundColor: theme.colors.secondary[600],
    },
    headerTintColor: '#fff',
  };

  return (
    <NativeBaseProvider theme={theme}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            initialRouteName="Home"
          >
            <Drawer.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Trending Meme',
                ...headerStyle,
              }}
            />
            <Drawer.Screen
              name="Creator"
              component={CreatorScreen}
              options={{
                title: 'Meme Generator',
                ...headerStyle,
              }}
            />
            <Drawer.Screen name="About" component={AboutScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </NativeBaseProvider>
  );
}
