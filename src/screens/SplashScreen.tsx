import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles} from '../styles/SplashStyles';
import {RootStackParamList} from '../types/navigation';
import LoadingIndicator from '../components/common/LoadingIndicator';

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;

interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Home');
    }, 2000); // Show splash for 2 seconds
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Travel App</Text>
      <LoadingIndicator size="large" color="#0066cc" />
    </View>
  );
};

export default SplashScreen;
