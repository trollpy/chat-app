const chatHandlers = require('./chatHandlers');
const userHandlers = require('./userHandlers');
const roomHandlers = require('./roomHandlers');
const notificationHandlers = require('./notificationHandlers');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`New socket connection: ${socket.id}`);

    // Join user to their own room for private messages
    socket.on('joinUserRoom', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their private room`);
    });

    // Initialize all handlers
    chatHandlers(io, socket);
    userHandlers(io, socket);
    roomHandlers(io, socket);
    notificationHandlers(io, socket);

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};