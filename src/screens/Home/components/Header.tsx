import {View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

import {styles} from '../styles';
import {signOut} from '@/services/auth';
import Button from '@/components/buttons/Button';
import {RootStackParamList} from '@/types/navigation';

type HeaderProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const Header: React.FC<HeaderProps> = ({navigation}) => {
  const handleLogout = async () => {
    try {
      await signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.header}>
      <Button
        title="Chat"
        variant="primary"
        onPress={() => navigation.navigate('ChatList')}
        style={styles.chatButton}
      />
      <Button
        title="+ Add Travel"
        variant="secondary"
        onPress={() => navigation.navigate('CreateTravel')}
        style={styles.addButton}
      />
      <Button
        title="Logout"
        variant="outline"
        onPress={handleLogout}
        style={styles.logoutButton}
      />
    </View>
  );
};

export default Header;
