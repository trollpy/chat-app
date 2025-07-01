import React from 'react';
import MessageItem from './MessageItem';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';

const MessageList = ({ messages }) => {
  const { user } = useAuth();

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    
    messages.forEach(message => {
      const date = format(new Date(message.createdAt), 'MMM d, yyyy');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    
    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="space-y-6">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="space-y-4">
          <div className="relative flex justify-center">
            <span className="px-2 bg-gray-100 text-gray-500 text-sm rounded-full">
              {date}
            </span>
          </div>
          {dateMessages.map((message) => (
            <MessageItem 
              key={message._id} 
              message={message} 
              isCurrentUser={message.user._id === user?._id} 
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MessageList;