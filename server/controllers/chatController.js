const Message = require('../models/Message');
const Room = require('../models/Room');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');

// @desc    Get all messages in a room
// @route   GET /api/v1/chat/messages/:roomId
// @access  Private
exports.getMessages = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({ room: req.params.roomId })
    .populate('user', 'username avatar')
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages.reverse()
  });
});

// @desc    Create a message
// @route   POST /api/v1/chat/messages
// @access  Private
exports.createMessage = asyncHandler(async (req, res, next) => {
  const { room, text } = req.body;

  // Check if room exists
  const roomExists = await Room.findById(room);
  if (!roomExists) {
    return next(new ErrorResponse(`Room not found with id of ${room}`, 404));
  }

  // Check if user is a member of the room
  if (!roomExists.members.includes(req.user.id)) {
    return next(new ErrorResponse(`Not authorized to send messages in this room`, 401));
  }

  const message = await Message.create({
    user: req.user.id,
    room,
    text
  });

  const populatedMessage = await Message.findById(message._id).populate('user', 'username avatar');

  res.status(201).json({
    success: true,
    data: populatedMessage
  });
});

// @desc    Delete a message
// @route   DELETE /api/v1/chat/messages/:id
// @access  Private
exports.deleteMessage = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return next(new ErrorResponse(`Message not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is message owner or admin
  if (message.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this message`, 401));
  }

  await message.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    React to a message
// @route   PUT /api/v1/chat/messages/:id/react
// @access  Private
exports.reactToMessage = asyncHandler(async (req, res, next) => {
  const { reaction } = req.body;
  const message = await Message.findById(req.params.id);

  if (!message) {
    return next(new ErrorResponse(`Message not found with id of ${req.params.id}`, 404));
  }

  // Check if user already reacted with this reaction
  const existingReactionIndex = message.reactions.findIndex(
    r => r.user.toString() === req.user.id && r.reaction === reaction
  );

  if (existingReactionIndex >= 0) {
    // Remove the reaction
    message.reactions.splice(existingReactionIndex, 1);
  } else {
    // Add new reaction
    message.reactions.push({ user: req.user.id, reaction });
  }

  await message.save();

  res.status(200).json({
    success: true,
    data: message
  });
});