import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import NotificationBell from './NotificationBell';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-gray-900">
          Chat App
        </Link>
        
        <div className="flex items-center space-x-4">
          <NotificationBell />
          
          {user ? (
            <div className="flex items-center space-x-2">
              <Avatar src={user.avatar} size="sm" />
              <span className="text-sm font-medium">{user.username}</span>
              <button 
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700">
                Login
              </Link>
              <Link to="/register" className="text-sm text-gray-500 hover:text-gray-700">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;