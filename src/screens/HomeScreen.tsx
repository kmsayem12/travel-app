import React from 'react';
import {View} from 'react-native';
import {styles} from '../styles/HomeStyles';
import {signOut} from '../services/auth';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';
import Button from '../components/buttons/Button';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const handleLogout = async () => {
    try {
      await signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title="Logout"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
