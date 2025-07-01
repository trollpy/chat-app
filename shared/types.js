interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen: Date;
  role: 'user' | 'admin';
  createdAt: Date;
}

interface Message {
  _id: string;
  user: User;
  room: string;
  text: string;
  reactions: Array<{
    user: string;
    reaction: string;
  }>;
  file?: {
    url: string;
    type: 'image' | 'video' | 'document' | 'audio';
    name: string;
  };
  isEdited: boolean;
  createdAt: Date;
}

interface Room {
  _id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  members: User[];
  admin: User;
  createdAt: Date;
}

interface Notification {
  _id: string;
  user: string;
  sender: User;
  message: string;
  type: 'message' | 'friend-request' | 'room-invite' | 'reaction';
  read: boolean;
  link?: string;
  createdAt: Date;
}

export type { User, Message, Room, Notification };