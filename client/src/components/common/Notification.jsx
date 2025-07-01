import React, { useState, useEffect } from 'react';
import { IoNotificationsOutline, IoNotifications } from 'react-icons/io5';

const Notification = ({ count = 0, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {isHovered ? (
        <IoNotifications className="text-2xl text-gray-600" />
      ) : (
        <IoNotificationsOutline className="text-2xl text-gray-600" />
      )}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </div>
  );
};

export default Notification;