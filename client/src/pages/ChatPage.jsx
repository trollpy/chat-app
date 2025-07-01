import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import Layout from '../components/layout/Layout';
import { useChat } from '../hooks/useChat';

const ChatPage = () => {
  const { currentRoom } = useChat();

  return (
    <Layout>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentRoom ? (
            <ChatWindow room={currentRoom} />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h2 className="text-xl font-medium text-gray-700 mb-2">
                  Select a chat to start messaging
                </h2>
                <p className="text-gray-500">
                  Choose from your existing conversations or start a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;