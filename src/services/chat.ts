import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import {ChatUser} from '../types/chat';

export const fetchUsers = async ({
  setUsers,
  setFilteredUsers,
  setLoading,
}: {
  setUsers: (users: ChatUser[]) => void;
  setFilteredUsers: (users: ChatUser[]) => void;
  setLoading: (loading: boolean) => void;
}): Promise<void> => {
  try {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    const allUsersSnap = await database().ref('/users').once('value');
    const usersData: ChatUser[] = [];

    const allUsers = allUsersSnap.val() || {};
    const userIds = Object.keys(allUsers).filter(id => id !== currentUser.uid);

    const chatSummariesSnap = await database().ref('/chats').once('value');
    const allChats = chatSummariesSnap.val() || {};

    for (const userId of userIds) {
      const userData = allUsers[userId];
      const chatId =
        currentUser.uid < userId
          ? `${currentUser.uid}_${userId}`
          : `${userId}_${currentUser.uid}`;
      const chat = allChats[chatId]?.summary;

      usersData.push({
        id: userId,
        name: userData.name,
        email: userData.email,
        lastMessage: chat?.lastMessage ?? '',
        lastMessageTime: chat?.lastMessageTime ?? 0,
        unread: chat?.readStatus?.[currentUser.uid] === false,
      });
    }

    usersData.sort((a, b) => b.lastMessageTime - a.lastMessageTime);

    setUsers(usersData);
    setFilteredUsers(usersData);
    setLoading(false);
  } catch (error) {
    throw error;
  }
};

export const markAsRead = async (chatId: string): Promise<void> => {
  try {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    await database()
      .ref(`/chats/${chatId}/summary/readStatus/${currentUser!.uid}`)
      .set(true);
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};

export const getStatusForUsers = ({
  users,
  setOnlineStatus,
}: {
  users: ChatUser[];
  setOnlineStatus: (status: {[key: string]: boolean}) => void;
}) => {
  const listeners: (() => void)[] = [];

  users.forEach(user => {
    const ref = database().ref(`/status/${user.id}`);
    const listener = ref.on('value', snap => {
      setOnlineStatus(prev => ({
        ...prev,
        [user.id]: snap.val()?.isOnline ?? false,
      }));
    });
    listeners.push(() => ref.off('value', listener));
  });

  return () => {
    listeners.forEach(unsub => unsub());
  };
};

export const getChatId = (userId1: string, userId2: string): string => {
  return [userId1, userId2].sort().join('_');
};
