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
