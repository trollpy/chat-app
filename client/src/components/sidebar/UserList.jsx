import React from 'react';
import Avatar from '../common/Avatar';
import { useChat } from '../../hooks/useChat';

const UserList = () => {
  const { users } = useChat();

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
        All Users
      </h3>
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
            <Avatar src={user.avatar} size="sm" status={user.status} />
            <span className="text-sm">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;