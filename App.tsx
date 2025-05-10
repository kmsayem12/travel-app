/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import './src/services/firebase';
import {initDB} from './src/config/sqlite';
import HomeScreen from './src/screens/Home/HomeScreen';
import ChatScreen from './src/screens/Chat/ChatScreen';
import LoginScreen from './src/screens/Login/LoginScreen';
import {RootStackParamList} from './src/types/navigation';
import SplashScreen from './src/screens/Splash/SplashScreen';
import RegisterScreen from './src/screens/Register/RegisterScreen';
import ChatListScreen from './src/screens/ChatList/ChatListScreen';
import CreateTravelScreen from './src/screens/CreateTravel/CreateTravelScreen';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  useEffect(() => {
    initDB()
      .then(() => console.log('DB initialized'))
      .catch(err => console.error('Failed to init DB', err));
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChatList"
              component={ChatListScreen}
              options={{title: 'Chats', headerBackTitle: ''}}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={({route}) => ({
                title: route.params?.userName || 'Chat',
                headerBackTitle: '',
              })}
            />
            <Stack.Screen
              name="CreateTravel"
              component={CreateTravelScreen}
              options={{title: 'Create Travel', headerBackTitle: ''}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
