export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  avatar?: string;
  bio?: string;
  isOnline?: boolean;
  lastSeen?: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  type: 'chat' | 'channel' | 'group';
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastMessage?: Message;
  unreadCount?: number;
  subscribersCount?: number;
  createdAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  userId: string;
  content: string;
  attachments?: Attachment[];
  reactions?: Reaction[];
  isRead?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface WSMessage {
  type: 'message' | 'typing' | 'read' | 'online' | 'offline';
  data: any;
}
