const User = require('../models/User');

module.exports = (io, socket) => {
  // User connects
  socket.on('userConnected', async (userId) => {
    try {
      // Update user status
      await User.findByIdAndUpdate(userId, { 
        status: 'online',
        lastSeen: new Date()
      });

      // Notify friends/contacts
      socket.broadcast.emit('userStatusChanged', { 
        userId, 
        status: 'online' 
      });
    } catch (err) {
      console.error(err.message);
    }
  });

  // User disconnects
  socket.on('userDisconnected', async (userId) => {
    try {
      // Update user status
      await User.findByIdAndUpdate(userId, { 
        status: 'offline',
        lastSeen: new Date()
      });

      // Notify friends/contacts
      socket.broadcast.emit('userStatusChanged', { 
        userId, 
        status: 'offline' 
      });
    } catch (err) {
      console.error(err.message);
    }
  });

  // User status update
  socket.on('updateStatus', async ({ userId, status }) => {
    try {
      // Update user status
      await User.findByIdAndUpdate(userId, { 
        status,
        lastSeen: status === 'offline' ? new Date() : undefined
      });

      // Notify friends/contacts
      socket.broadcast.emit('userStatusChanged', { 
        userId, 
        status 
      });
    } catch (err) {
      console.error(err.message);
    }
  });
};