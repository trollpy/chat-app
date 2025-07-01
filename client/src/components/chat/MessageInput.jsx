import React, { useState, useRef, useEffect } from 'react';
import { IoSend, IoAttach, IoHappy } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import Button from '../common/Button';
import FileUpload from './FileUpload';

const MessageInput = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value);
    
    // Notify typing
    if (e.target.value.trim()) {
      onTyping(true);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 2000);
    } else {
      onTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() || file) {
      onSendMessage(message, file);
      setMessage('');
      setFile(null);
      onTyping(false);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    inputRef.current.focus();
  };

  const handleFileUpload = (file) => {
    setFile(file);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 text-gray-500 hover:text-blue-500"
        >
          <IoHappy size={20} />
        </button>
        
        <div className="relative flex-1 mx-2">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full border-none focus:ring-0 resize-none max-h-32"
            rows="1"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <FileUpload onFileUpload={handleFileUpload}>
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-blue-500"
            >
              <IoAttach size={20} />
            </button>
          </FileUpload>
          
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!message.trim() && !file}
          >
            <IoSend size={16} />
          </Button>
        </div>
      </div>
      
      {file && (
        <div className="mt-2 flex items-center justify-between bg-blue-50 p-2 rounded-lg">
          <span className="text-sm truncate">{file.name}</span>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="text-red-500 text-sm"
          >
            Remove
          </button>
        </div>
      )}
      
      {showEmojiPicker && (
        <div className="absolute bottom-12 left-0 z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </form>
  );
};

export default MessageInput;