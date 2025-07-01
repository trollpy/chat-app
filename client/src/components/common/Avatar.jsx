import React from 'react';

const Avatar = ({
  src,
  alt = 'User avatar',
  size = 'md',
  status = 'offline',
  className = '',
  onClick
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  };

  return (
    <div className={`relative inline-block ${className}`} onClick={onClick}>
      <img
        className={`${sizeClasses[size]} rounded-full object-cover`}
        src={src || '/default-avatar.png'}
        alt={alt}
      />
      <span
        className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white ${statusColors[status]} ${
          size === 'xs' || size === 'sm' ? 'h-2 w-2' : 'h-3 w-3'
        }`}
      ></span>
    </div>
  );
};

export default Avatar;