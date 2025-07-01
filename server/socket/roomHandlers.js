const Room = require('../models/Room');

module.exports = (io, socket) => {
  // Room created
  socket.on('roomCreated', async (room) => {
    try {
      // Notify all members except creator
      room.members.forEach(memberId => {
        if (memberId.toString() !== room.admin.toString()) {
          io.to(memberId.toString()).emit('roomInvite', room);
        }
      });
    } catch (err) {
      console.error(err.message);
    }
  });

  // Room updated
  socket.on('roomUpdated', async (room) => {
    try {
      // Notify all members
      io.to(room._id.toString()).emit('roomUpdated', room);
    } catch (err) {
      console.error(err.message);
    }
  });

  // Room deleted
  socket.on('roomDeleted', async (roomId) => {
    try {
      // Notify all members
      io.to(roomId).emit('roomDeleted', roomId);
    } catch (err) {
      console.error(err.message);
    }
  });

  // Member added to room
  socket.on('memberAdded', async ({ room, userId }) => {
    try {
      // Notify the new member
      io.to(userId.toString()).emit('memberAdded', room);
    } catch (err) {
      console.error(err.message);
    }
  });

  // Member removed from room
  socket.on('memberRemoved', async ({ roomId, userId }) => {
    try {
      // Notify the removed member
      io.to(userId.toString()).emit('memberRemoved', roomId);

      // Remove them from socket room if they're connected
      const userSocket = io.sockets.sockets.get(userId.toString());
      if (userSocket) {
        userSocket.leave(roomId);
      }
    } catch (err) {
      console.error(err.message);
    }
  });
};