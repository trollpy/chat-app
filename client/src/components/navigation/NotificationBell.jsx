import React, { useState } from 'react';
import { IoNotificationsOutline, IoNotifications } from 'react-icons/io5';
import { useNotifications } from '../../hooks/useNotifications';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markAsRead } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (unreadCount > 0) {
      markAsRead();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        {isOpen ? (
          <IoNotifications size={24} />
        ) : (
          <IoNotificationsOutline size={24} />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
            Notifications
          </div>
          <div className="max-h-60 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`px-4 py-2 text-sm ${!notification.read ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-100`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={notification.sender.avatar || '/default-avatar.png'}
                        alt={notification.sender.username}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.sender.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;