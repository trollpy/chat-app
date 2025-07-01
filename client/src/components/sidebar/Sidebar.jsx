import React from 'react';
import UserList from './UserList';
import RoomList from './RoomList';
import PrivateChats from './PrivateChats';
import OnlineUsers from './OnlineUsers';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Chat App</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <OnlineUsers />
        <RoomList />
        <PrivateChats />
        <UserList />
      </div>
    </div>
  );
};

export default Sidebar;