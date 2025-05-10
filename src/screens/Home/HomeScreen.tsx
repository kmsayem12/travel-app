import {FlatList} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';

import {styles} from './styles';
import {Travel} from '@/types/travel';
import Header from './components/Header';
import Card from '@/components/cards/Card';
import {getTravels} from '@/services/travel';
import {RootStackParamList} from '@/types/navigation';
import TravelDetails from './components/TravelDetails';
import LoadingIndicator from '@/components/common/LoadingIndicator';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [travels, setTravels] = useState<Travel[]>([]);
  const [selectedLog, setSelectedLog] = useState<Travel | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadTravel();
    }, []),
  );

  const loadTravel = async () => {
    try {
      const logs = await getTravels();
      setTravels(logs);
    } catch (error) {
      console.error('Error loading travel logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (log: Travel) => {
    setSelectedLog(log);
    setModalVisible(true);
  };

  if (loading) {
    return <LoadingIndicator fullScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      <FlatList
        data={travels}
        renderItem={({item}) => <Card log={item} onPress={handleMarkerPress} />}
        keyExtractor={item => item.id!}
        style={styles.logsList}
        contentContainerStyle={styles.logsContent}
      />
      <TravelDetails
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedLog={selectedLog}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
