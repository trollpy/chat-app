export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  SEND_MESSAGE: 'sendMessage',
  MESSAGE_RECEIVED: 'messageReceived',
  MESSAGE_UPDATED: 'messageUpdated',
  MESSAGE_DELETED: 'messageDeleted',
  TYPING: 'typing',
  REACT_TO_MESSAGE: 'reactToMessage',
  USER_STATUS_CHANGED: 'userStatusChanged',
  ROOM_CREATED: 'roomCreated',
  ROOM_UPDATED: 'roomUpdated',
  ROOM_DELETED: 'roomDeleted',
  NOTIFICATION_RECEIVED: 'notificationReceived',
  NOTIFICATION_READ: 'notificationRead'
};

export const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away',
  BUSY: 'busy'
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file'
};

export const REACTIONS = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];