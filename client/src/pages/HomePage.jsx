import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center p-4"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-md w-full bg-white bg-opacity-90 backdrop-blur-sm p-8 rounded-xl shadow-2xl text-center space-y-6 border border-white border-opacity-20">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {user ? `Welcome back, ${user.username}!` : 'ConnectChat'}
          </h1>
          <p className="text-gray-600">
            {user
              ? 'Your conversations are waiting...'
              : 'Secure, fast, and beautiful messaging'}
          </p>
        </div>

        <div className="space-y-4">
          {user ? (
            <Link
              to="/chat"
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Continue to Chat →
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 border border-gray-200 shadow"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

        {!user && (
          <p className="text-sm text-gray-500">
            Join <span className="font-semibold">10,000+</span> users already connected
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;