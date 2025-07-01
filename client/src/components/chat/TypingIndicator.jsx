import React from 'react';
import Avatar from '../common/Avatar';

const TypingIndicator = ({ users }) => {
  return (
    <div className="flex items-center space-x-2 mb-2">
      {users.map((userId) => (
        <div key={userId} className="flex items-center">
          <Avatar src={null} size="xs" status="online" />
          <div className="ml-2 flex space-x-1">
            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TypingIndicator;