module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`New socket connection: ${socket.id}`);

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};