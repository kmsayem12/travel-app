import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import auth from '@react-native-firebase/auth';

import {styles} from './styles';
import {ChatUser} from '@/types/chat';
import Input from '@/components/inputs/Input';
import {RootStackParamList} from '@/types/navigation';
import StatusDot from '@/components/common/StatusDot';
import {useFocusEffect} from '@react-navigation/native';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import {fetchUsers, getStatusForUsers, markAsRead} from '@/services/chat';

type ChatListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChatList'
>;

interface ChatListScreenProps {
  navigation: ChatListScreenNavigationProp;
}

// Separator component
const Separator = () => <View style={styles.separator} />;

const ChatListScreen: React.FC<ChatListScreenProps> = ({navigation}) => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ChatUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState<{[key: string]: boolean}>(
    {},
  );
  const currentUser = auth().currentUser;

  // Initial fetch & refresh on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchUsers({
        setUsers,
        setFilteredUsers,
        setLoading,
      });
    }, []),
  );

  useEffect(() => {
    // Monitor online status
    const unsubscribeStatus = getStatusForUsers({
      users,
      setOnlineStatus,
    });
    return () => {
      unsubscribeStatus();
    };
  }, [users]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          u =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q),
        ),
      );
    }
  }, [searchQuery, users]);

  const navigateToChat = useCallback(
    (user: ChatUser) => {
      const chatId =
        currentUser!.uid < user.id
          ? `${currentUser!.uid}_${user.id}`
          : `${user.id}_${currentUser!.uid}`;

      // Mark messages as read
      markAsRead(chatId);

      navigation.navigate('Chat', {
        userId: user.id,
        userName: user.name,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigation],
  );

  const renderUser = useCallback(
    ({item}: {item: ChatUser}) => (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => navigateToChat(item)}>
        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>{item.name}</Text>
            <StatusDot isOnline={onlineStatus[item.id]} />
          </View>
          <Text style={[styles.lastMessage, item.unread && styles.unreadText]}>
            {item.lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [navigateToChat, onlineStatus],
  );

  if (loading) {
    return <LoadingIndicator fullScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name or email"
          autoCapitalize="none"
        />
      </View>
      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={Separator}
      />
    </SafeAreaView>
  );
};

export default ChatListScreen;
