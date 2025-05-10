import database from '@react-native-firebase/database';

import {getCurrentUser} from './auth';
import {ChatUser, Message} from '../types/chat';

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
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return;
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
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return;
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
      // @ts-ignore
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

export const sendMessage = async (
  receiverId: string,
  messageText: string,
): Promise<void> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return;
    }
    const timestamp = database.ServerValue.TIMESTAMP;

    const chatId = getChatId(currentUser.uid, receiverId);
    const messageRef = database().ref(`/chats/${chatId}/messages`).push();

    const newMessage = {
      text: messageText,
      createdAt: timestamp,
      user: {
        _id: currentUser.uid,
        name: currentUser.displayName || '',
      },
    };

    await messageRef.set(newMessage);

    await database()
      .ref(`/chats/${chatId}/summary`)
      .set({
        lastMessage: messageText,
        lastMessageTime: timestamp,
        participants: {
          [currentUser.uid]: true,
          [receiverId]: true,
        },
        readStatus: {
          [currentUser.uid]: true,
          [receiverId]: false,
        },
      });

    await Promise.all([
      database()
        .ref(`/users/${currentUser.uid}/lastMessageTimestamp`)
        .set(timestamp),
      database()
        .ref(`/users/${receiverId}/lastMessageTimestamp`)
        .set(timestamp),
    ]);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

export const subscribeToMessages = ({
  chatId,
  setMessages,
  setLoading,
}: {
  chatId: string;
  setMessages: (messages: Message[]) => void;
  setLoading: (loading: boolean) => void;
}): (() => void) => {
  const messagesRef = database().ref(`/chats/${chatId}/messages`);

  const onValueChange = messagesRef
    .orderByChild('createdAt')
    .on('value', snapshot => {
      try {
        const data = snapshot.val() || {};
        const messages = Object.entries(data)
          .map(([id, msg]: any) => ({
            _id: id,
            ...msg,
            createdAt: new Date(msg.createdAt),
          }))
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // DESC order

        setMessages(messages);
        setLoading(false);
      } catch (error) {
        console.error('Error while fetching messages:', error);
      }
    });

  return () => messagesRef.off('value', onValueChange);
};

export const updateOnlineStatus = async (isOnline: boolean): Promise<void> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return;
  }

  const uid = currentUser.uid;
  const userRef = database().ref(`status/${uid}`);
  const timestamp = database.ServerValue.TIMESTAMP;

  try {
    await userRef.set({isOnline, lastSeen: timestamp});
    await database().ref(`users/${uid}`).update({
      isOnline,
      lastSeen: timestamp,
    });
  } catch (error) {
    console.error('Error updating online status:', error);
  }
};

export const subscribeToUserStatus = (
  userId: string,
  setIsReceiverOnline: (isOnline: boolean) => void,
): (() => void) => {
  const statusRef = database().ref(`status/${userId}`);
  try {
    statusRef.on('value', snapshot => {
      const status = snapshot.val();
      setIsReceiverOnline(status?.isOnline || false);
    });
  } catch (error) {
    console.error('Error subscribing to user status:', error);
  }
  return () => statusRef.off();
};
