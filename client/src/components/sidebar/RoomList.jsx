import React from 'react';
import { useChat } from '../../hooks/useChat';

const RoomList = () => {
  const { rooms, joinRoom } = useChat();

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
        Group Chats
      </h3>
      <div className="space-y-2">
        {rooms.map((room) => (
          <div 
            key={room._id} 
            className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
            onClick={() => joinRoom(room._id)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{room.name}</span>
              <span className="text-xs text-gray-500">
                {room.members.length} members
              </span>
            </div>
            {room.description && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {room.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;