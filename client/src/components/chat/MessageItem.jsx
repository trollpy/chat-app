import React, { useState } from 'react';
import Avatar from '../common/Avatar';
import { format } from 'date-fns';
import MessageReactions from './MessageReactions';
import { useChat } from '../../hooks/useChat';

const MessageItem = ({ message, isCurrentUser }) => {
  const { reactToMessage, deleteMessage } = useChat();
  const [showReactions, setShowReactions] = useState(false);

  const handleReaction = (reaction) => {
    reactToMessage(message._id, reaction);
    setShowReactions(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessage(message._id);
    }
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${isCurrentUser ? 'bg-blue-100' : 'bg-gray-100'}`}>
        {!isCurrentUser && (
          <div className="flex items-center space-x-2 mb-1">
            <Avatar src={message.user.avatar} size="sm" status="offline" />
            <span className="font-medium text-sm">{message.user.username}</span>
          </div>
        )}
        
        {message.text && (
          <p className={`text-sm ${isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
            {message.text}
          </p>
        )}
        
        {message.file && (
          <div className="mt-2">
            {message.file.type === 'image' ? (
              <img 
                src={message.file.url} 
                alt={message.file.name} 
                className="max-w-full h-auto rounded"
              />
            ) : (
              <a 
                href={message.file.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <span className="truncate">{message.file.name}</span>
              </a>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">
            {format(new Date(message.createdAt), 'h:mm a')}
          </span>
          
          <div className="flex space-x-1">
            {isCurrentUser && (
              <button 
                onClick={handleDelete}
                className="text-xs text-gray-500 hover:text-red-500"
              >
                Delete
              </button>
            )}
            
            <div className="relative">
              <button 
                onClick={() => setShowReactions(!showReactions)}
                className="text-xs text-gray-500 hover:text-blue-500"
              >
                React
              </button>
              
              {showReactions && (
                <MessageReactions 
                  onSelect={handleReaction} 
                  onClose={() => setShowReactions(false)}
                />
              )}
            </div>
          </div>
        </div>
        
        {message.reactions.length > 0 && (
          <div className="flex space-x-1 mt-1">
            {message.reactions.map((reaction, index) => (
              <span key={index} className="text-xs">
                {getReactionEmoji(reaction.reaction)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const getReactionEmoji = (reaction) => {
  const emojis = {
    like: '👍',
    love: '❤️',
    haha: '😄',
    wow: '😮',
    sad: '😢',
    angry: '😠'
  };
  return emojis[reaction] || reaction;
};

export default MessageItem;