// import React, { useState, useEffect, useRef } from 'react';
import React, { useRef, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { useChat } from '../../hooks/useChat';
import { useSocket } from '../../hooks/useSocket';

const ChatWindow = ({ room }) => {
  const { messages, sendMessage, isTyping, setIsTyping } = useChat();
  const { socket } = useSocket();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (room) {
      socket.emit('joinRoom', { roomId: room._id, userId: room.userId });
    }

    return () => {
      if (room) {
        socket.emit('leaveRoom', { roomId: room._id, userId: room.userId });
      }
    };
  }, [room, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (text, file) => {
    if (!room) return;

    sendMessage({
      roomId: room._id,
      text,
      file
    });
  };

  const handleTyping = (isTyping) => {
    if (!room) return;
    setIsTyping(room._id, isTyping);
    socket.emit('typing', { roomId: room._id, userId: room.userId, isTyping });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-xl font-semibold">{room?.name}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages[room?._id] || []} />
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 p-4">
        {isTyping[room?._id] && <TypingIndicator users={isTyping[room?._id]} />}
        <MessageInput 
          onSendMessage={handleSendMessage} 
          onTyping={handleTyping} 
        />
      </div>
    </div>
  );
};

export default ChatWindow;