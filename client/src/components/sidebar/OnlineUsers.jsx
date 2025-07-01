import React from 'react';
import Avatar from '../common/Avatar';
import { useChat } from '../../hooks/useChat';

const OnlineUsers = () => {
  const { onlineUsers } = useChat();

  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
        Online Now
      </h3>
      <div className="flex flex-wrap gap-2">
        {onlineUsers.map((user) => (
          <div key={user._id} className="flex flex-col items-center">
            <Avatar src={user.avatar} size="sm" status="online" />
            <span className="text-xs mt-1">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineUsers;