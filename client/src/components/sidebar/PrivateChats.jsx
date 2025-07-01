import React from 'react';
import Avatar from '../common/Avatar';
import { useChat } from '../../hooks/useChat';

const PrivateChats = () => {
  const { privateChats } = useChat();

  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
        Private Chats
      </h3>
      <div className="space-y-2">
        {privateChats.map((chat) => (
          <div key={chat._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
            <Avatar src={chat.user.avatar} size="sm" status={chat.user.status} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{chat.user.username}</p>
              <p className="text-xs text-gray-500 truncate">
                {chat.lastMessage?.text || 'No messages yet'}
              </p>
            </div>
            {chat.unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {chat.unreadCount}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivateChats;