const Notification = require('../models/Notification');

module.exports = (io, socket) => {
  // Send notification
  socket.on('sendNotification', async ({ recipientId, senderId, message, type, link }) => {
    try {
      // Create notification
      const notification = await Notification.create({
        user: recipientId,
        sender: senderId,
        message,
        type,
        link
      });

      // Populate sender info
      const populatedNotification = await Notification.findById(notification._id)
        .populate('sender', 'username avatar');

      // Send to recipient if they're online
      io.to(recipientId.toString()).emit('notificationReceived', populatedNotification);
    } catch (err) {
      console.error(err.message);
    }
  });

  // Mark notification as read
  socket.on('markNotificationAsRead', async (notificationId) => {
    try {
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
      );

      if (notification) {
        // Notify user that notification was marked as read
        io.to(notification.user.toString()).emit('notificationRead', notificationId);
      }
    } catch (err) {
      console.error(err.message);
    }
  });
};