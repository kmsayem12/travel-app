import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useMemo,
} from 'react';
import auth from '@react-native-firebase/auth';
import {RouteProp} from '@react-navigation/native';
import {AppState, AppStateStatus, SafeAreaView} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {GiftedChat, IMessage} from 'react-native-gifted-chat';

import {
  getChatId,
  sendMessage,
  updateOnlineStatus,
  subscribeToMessages,
  subscribeToUserStatus,
} from '../../services/chat';
import {styles} from './styles';
import StatusDot from '../../components/common/StatusDot';
import {RootStackParamList} from '../../types/navigation';
import LoadingIndicator from '../../components/common/LoadingIndicator';

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

interface ChatScreenProps {
  navigation: ChatScreenNavigationProp;
  route: ChatScreenRouteProp;
}

const HeaderRight = React.memo(({isOnline}: {isOnline: boolean}) => (
  <StatusDot isOnline={isOnline} size={10} />
));

const ChatScreen: React.FC<ChatScreenProps> = ({route, navigation}) => {
  const [chatMessages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isReceiverOnline, setIsReceiverOnline] = useState(false);

  const {userId: receiverId} = route.params;
  const currentUser = auth().currentUser;
  const currentUserId = currentUser?.uid || '';
  const currentUserName = currentUser?.displayName || '';

  const renderHeaderRight = useCallback(
    () => <HeaderRight isOnline={isReceiverOnline} />,
    [isReceiverOnline],
  );

  useLayoutEffect(() => {
    navigation.setOptions({headerRight: renderHeaderRight});
  }, [navigation, renderHeaderRight]);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    // Set online status
    updateOnlineStatus(true);

    // Setup subscriptions
    const unsubscribeStatus = subscribeToUserStatus(
      receiverId,
      setIsReceiverOnline,
    );
    const chatId = getChatId(currentUserId, receiverId);

    const unsubscribeMessages = subscribeToMessages({
      chatId,
      setMessages,
      setLoading,
    });

    return () => {
      unsubscribeStatus?.();
      unsubscribeMessages?.();
      updateOnlineStatus(false);
    };
  }, [currentUserId, receiverId]);

  useEffect(() => {
    const handleAppStateChange = (state: AppStateStatus) => {
      updateOnlineStatus(state === 'active');
    };

    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, []);

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      if (!currentUserId || newMessages.length === 0) {
        return;
      }
      try {
        const messageText = newMessages[0].text;
        await sendMessage(receiverId, messageText);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    [currentUserId, receiverId],
  );

  const giftedUser = useMemo(
    () => ({
      _id: currentUserId ?? 'default-id',
      name: currentUserName ?? 'Anonymous',
    }),
    [currentUserId, currentUserName],
  );

  if (loading) {
    return <LoadingIndicator fullScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <GiftedChat
        messages={chatMessages}
        onSend={messages => onSend(messages)}
        user={giftedUser}
        renderAvatar={null}
        showAvatarForEveryMessage={false}
        showUserAvatar={false}
        alwaysShowSend
        isScrollToBottomEnabled
      />
    </SafeAreaView>
  );
};

export default ChatScreen;
