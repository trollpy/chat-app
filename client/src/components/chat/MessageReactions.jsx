import React from 'react';

const MessageReactions = ({ onSelect, onClose }) => {
  const reactions = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];

  const handleReactionSelect = (reaction) => {
    onSelect(reaction);
  };

  return (
    <div className="absolute bottom-6 left-0 bg-white shadow-lg rounded-full p-1 flex space-x-1 z-10">
      {reactions.map((reaction) => (
        <button
          key={reaction}
          onClick={() => handleReactionSelect(reaction)}
          className="p-1 hover:scale-125 transform transition-transform"
        >
          <span className="text-xl">
            {getReactionEmoji(reaction)}
          </span>
        </button>
      ))}
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

export default MessageReactions;