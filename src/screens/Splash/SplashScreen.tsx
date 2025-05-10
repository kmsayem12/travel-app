import React, {useCallback, useEffect} from 'react';
import {View, Text} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles} from './styles';
import {checkAuthState} from '@/services/auth';
import {RootStackParamList} from '@/types/navigation';
import LoadingIndicator from '@/components/common/LoadingIndicator';

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;

interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  const checkAuthStatus = useCallback(async () => {
    try {
      const isAuthenticated = await checkAuthState();
      setTimeout(() => {
        navigation.replace(isAuthenticated ? 'Home' : 'Login');
      }, 2000); // Show splash for 2 seconds
    } catch (error) {
      navigation.replace('Login');
    }
  }, [navigation]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Travel App</Text>
      <LoadingIndicator size="large" color="#0066cc" />
    </View>
  );
};

export default SplashScreen;
