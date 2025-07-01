const Message = require('../models/Message');
const Room = require('../models/Room');

module.exports = (io, socket) => {
  // Join a chat room
  socket.on('joinRoom', async ({ roomId, userId }) => {
    try {
      // Check if user is a member of the room
      const room = await Room.findById(roomId);
      if (!room.members.includes(userId)) {
        throw new Error('Not authorized to join this room');
      }

      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
    } catch (err) {
      console.error(err.message);
    }
  });

  // Leave a chat room
  socket.on('leaveRoom', ({ roomId, userId }) => {
    socket.leave(roomId);
    console.log(`User ${userId} left room ${roomId}`);
  });

  // Send a message
  socket.on('sendMessage', async ({ roomId, message, userId }, callback) => {
    try {
      // Check if user is a member of the room
      const room = await Room.findById(roomId);
      if (!room.members.includes(userId)) {
        throw new Error('Not authorized to send messages in this room');
      }

      // Create and save message
      const newMessage = new Message({
        user: userId,
        room: roomId,
        text: message.text,
        file: message.file
      });

      await newMessage.save();

      // Populate user data
      const populatedMessage = await Message.findById(newMessage._id).populate('user', 'username avatar');

      // Emit to all in room except sender
      socket.to(roomId).emit('messageReceived', populatedMessage);

      // Send back to sender
      callback(populatedMessage);
    } catch (err) {
      console.error(err.message);
      callback({ error: err.message });
    }
  });

  // Typing indicator
  socket.on('typing', ({ roomId, userId, isTyping }) => {
    socket.to(roomId).emit('typing', { userId, isTyping });
  });

  // Message reaction
  socket.on('reactToMessage', async ({ messageId, reaction, userId }) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      // Check if user already reacted with this reaction
      const existingReactionIndex = message.reactions.findIndex(
        r => r.user.toString() === userId && r.reaction === reaction
      );

      if (existingReactionIndex >= 0) {
        // Remove the reaction
        message.reactions.splice(existingReactionIndex, 1);
      } else {
        // Add new reaction
        message.reactions.push({ user: userId, reaction });
      }

      await message.save();

      // Emit updated message to room
      io.to(message.room.toString()).emit('messageUpdated', message);
    } catch (err) {
      console.error(err.message);
    }
  });

  // Message deleted
  socket.on('deleteMessage', async ({ messageId, userId }) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      // Check if user is message owner or admin
      if (message.user.toString() !== userId) {
        throw new Error('Not authorized to delete this message');
      }

      await message.remove();

      // Emit to room that message was deleted
      io.to(message.room.toString()).emit('messageDeleted', messageId);
    } catch (err) {
      console.error(err.message);
    }
  });
};