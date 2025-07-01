import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';

const useTyping = (roomId) => {
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !roomId) return;

    const handleTyping = ({ userId, isTyping: typingStatus }) => {
      setTypingUsers(prev => {
        if (typingStatus) {
          return [...new Set([...prev, userId])];
        } else {
          return prev.filter(id => id !== userId);
        }
      });
    };

    socket.on('typing', handleTyping);

    return () => {
      socket.off('typing', handleTyping);
    };
  }, [socket, roomId]);

  const startTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', { roomId, isTyping: true });
    }
  };

  const stopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      socket.emit('typing', { roomId, isTyping: false });
    }
  };

  return {
    typingUsers,
    startTyping,
    stopTyping
  };
};

export default useTyping;