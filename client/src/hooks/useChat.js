import { useState, useEffect, useContext, createContext } from 'react';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';
import api from '../services/api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user: currentUser } = useAuth();
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState({});
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [privateChats, setPrivateChats] = useState([]);
  const [isTyping, setIsTyping] = useState({});
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !currentUser) return;

    const fetchInitialData = async () => {
      try {
        const [roomsResponse, usersResponse] = await Promise.all([
          api.get('/rooms'),
          api.get('/users')
        ]);

        setRooms(roomsResponse.data);
        setUsers(usersResponse.data);
        
        setPrivateChats(
          usersResponse.data
            .filter(u => u._id !== currentUser._id)
            .map(user => ({
              _id: `private-${user._id}`,
              user,
              lastMessage: null,
              unreadCount: 0
            }))
        );
      } catch (err) {
        console.error('Failed to fetch initial chat data:', err);
      }
    };

    const handleMessageReceived = (message) => {
      setMessages(prev => ({
        ...prev,
        [message.room]: [...(prev[message.room] || []), message]
      }));
    };

    const handleMessageUpdated = (message) => {
      setMessages(prev => ({
        ...prev,
        [message.room]: prev[message.room]?.map(m => 
          m._id === message._id ? message : m
        ) || []
      }));
    };

    const handleMessageDeleted = (messageId) => {
      setMessages(prev => {
        const newMessages = { ...prev };
        for (const roomId in newMessages) {
          newMessages[roomId] = newMessages[roomId].filter(m => m._id !== messageId);
        }
        return newMessages;
      });
    };

    const handleTyping = ({ userId, roomId, isTyping: typingStatus }) => {
      setIsTyping(prev => {
        const currentTyping = prev[roomId] || [];
        const newTyping = typingStatus
          ? [...new Set([...currentTyping, userId])]
          : currentTyping.filter(id => id !== userId);
        
        return {
          ...prev,
          [roomId]: newTyping.length ? newTyping : undefined
        };
      });
    };

    const handleUserStatusChanged = ({ userId, status }) => {
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, status } : user
      ));
      
      setOnlineUsers(prev => status === 'online'
        ? [...prev, { _id: userId }]
        : prev.filter(user => user._id !== userId)
      );
    };

    const handleRoomEvent = {
      created: (room) => setRooms(prev => [...prev, room]),
      updated: (room) => setRooms(prev => prev.map(r => 
        r._id === room._id ? room : r
      )),
      deleted: (roomId) => {
        setRooms(prev => prev.filter(r => r._id !== roomId));
        if (currentRoom?._id === roomId) setCurrentRoom(null);
      }
    };

    fetchInitialData();

    socket.on('messageReceived', handleMessageReceived);
    socket.on('messageUpdated', handleMessageUpdated);
    socket.on('messageDeleted', handleMessageDeleted);
    socket.on('typing', handleTyping);
    socket.on('userStatusChanged', handleUserStatusChanged);
    socket.on('roomCreated', handleRoomEvent.created);
    socket.on('roomUpdated', handleRoomEvent.updated);
    socket.on('roomDeleted', handleRoomEvent.deleted);

    return () => {
      socket.off('messageReceived', handleMessageReceived);
      socket.off('messageUpdated', handleMessageUpdated);
      socket.off('messageDeleted', handleMessageDeleted);
      socket.off('typing', handleTyping);
      socket.off('userStatusChanged', handleUserStatusChanged);
      socket.off('roomCreated', handleRoomEvent.created);
      socket.off('roomUpdated', handleRoomEvent.updated);
      socket.off('roomDeleted', handleRoomEvent.deleted);
    };
  }, [socket, currentUser, currentRoom?._id]);

  const joinRoom = async (roomId) => {
    try {
      const [roomResponse, messagesResponse] = await Promise.all([
        api.get(`/rooms/${roomId}`),
        !messages[roomId] ? api.get(`/chat/messages/${roomId}`) : null
      ]);

      setCurrentRoom(roomResponse.data);
      
      if (messagesResponse) {
        setMessages(prev => ({
          ...prev,
          [roomId]: messagesResponse.data
        }));
      }
    } catch (err) {
      console.error('Failed to join room:', err);
    }
  };

  const sendMessage = async ({ roomId, text, file }) => {
    try {
      const fileData = file ? await api.post('/upload', file) : null;
      
      socket.emit('sendMessage', {
        room: roomId,
        text,
        file: fileData?.data
      }, (response) => {
        setMessages(prev => ({
          ...prev,
          [roomId]: [...(prev[roomId] || []), response]
        }));
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const reactToMessage = (messageId, reaction) => {
    socket.emit('reactToMessage', { messageId, reaction });
  };

  const deleteMessage = (messageId) => {
    socket.emit('deleteMessage', { messageId });
  };

  const setTypingStatus = (roomId, isTyping) => {
    if (!currentUser) return;
    socket.emit('typing', { 
      roomId, 
      userId: currentUser._id, 
      isTyping 
    });
  };

  return (
    <ChatContext.Provider
      value={{
        currentRoom,
        messages,
        rooms,
        users,
        onlineUsers,
        privateChats,
        isTyping,
        joinRoom,
        sendMessage,
        reactToMessage,
        deleteMessage,
        setIsTyping: setTypingStatus,
        uploadFile: async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          const response = await api.post('/upload', formData);
          return response.data;
        }
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};