export interface ChatUser {
  id: string;
  name: string;
  email: string;
  isOnline?: boolean;
  lastSeen?: Date;
  photoURL?: string;
  lastMessage?: string;
  lastMessageTime: number;
  unread?: boolean;
}

export interface Message {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  image?: string;
}
