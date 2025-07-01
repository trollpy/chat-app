const Room = require('../models/Room');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all rooms
// @route   GET /api/v1/rooms
// @access  Private
exports.getRooms = asyncHandler(async (req, res, next) => {
  // Get rooms where current user is a member
  const rooms = await Room.find({ members: req.user.id })
    .populate('members', 'username avatar')
    .populate('admin', 'username avatar');

  res.status(200).json({
    success: true,
    count: rooms.length,
    data: rooms
  });
});

// @desc    Get single room
// @route   GET /api/v1/rooms/:id
// @access  Private
exports.getRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id)
    .populate('members', 'username avatar')
    .populate('admin', 'username avatar');

  if (!room) {
    return next(
      new ErrorResponse(`Room not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is a member of the room
  if (!room.members.some(member => member._id.toString() === req.user.id)) {
    return next(
      new ErrorResponse(`Not authorized to access this room`, 401)
    );
  }

  res.status(200).json({
    success: true,
    data: room
  });
});

// @desc    Create room
// @route   POST /api/v1/rooms
// @access  Private
exports.createRoom = asyncHandler(async (req, res, next) => {
  const { name, isPrivate, members } = req.body;

  // Check if all members exist
  const membersExist = await User.find({ _id: { $in: members } });
  if (membersExist.length !== members.length) {
    return next(
      new ErrorResponse(`One or more members not found`, 404)
    );
  }

  // Add current user to members if not already included
  if (!members.includes(req.user.id)) {
    members.push(req.user.id);
  }

  const room = await Room.create({
    name,
    isPrivate,
    members,
    admin: req.user.id
  });

  const populatedRoom = await Room.findById(room._id)
    .populate('members', 'username avatar')
    .populate('admin', 'username avatar');

  res.status(201).json({
    success: true,
    data: populatedRoom
  });
});

// @desc    Update room
// @route   PUT /api/v1/rooms/:id
// @access  Private
exports.updateRoom = asyncHandler(async (req, res, next) => {
  let room = await Room.findById(req.params.id);

  if (!room) {
    return next(
      new ErrorResponse(`Room not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is room admin
  if (room.admin.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this room`, 401)
    );
  }

  room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
    .populate('members', 'username avatar')
    .populate('admin', 'username avatar');

  res.status(200).json({
    success: true,
    data: room
  });
});

// @desc    Delete room
// @route   DELETE /api/v1/rooms/:id
// @access  Private
exports.deleteRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return next(
      new ErrorResponse(`Room not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is room admin
  if (room.admin.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to delete this room`, 401)
    );
  }

  await room.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add member to room
// @route   PUT /api/v1/rooms/:id/add-member
// @access  Private
exports.addMember = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  let room = await Room.findById(req.params.id);

  if (!room) {
    return next(
      new ErrorResponse(`Room not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is room admin
  if (room.admin.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to add members to this room`, 401)
    );
  }

  // Check if user is already a member
  if (room.members.includes(userId)) {
    return next(
      new ErrorResponse(`User ${userId} is already a member of this room`, 400)
    );
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${userId}`, 404)
    );
  }

  room.members.push(userId);
  await room.save();

  room = await Room.findById(room._id)
    .populate('members', 'username avatar')
    .populate('admin', 'username avatar');

  res.status(200).json({
    success: true,
    data: room
  });
});

// @desc    Remove member from room
// @route   PUT /api/v1/rooms/:id/remove-member
// @access  Private
exports.removeMember = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  let room = await Room.findById(req.params.id);

  if (!room) {
    return next(
      new ErrorResponse(`Room not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is room admin
  if (room.admin.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to remove members from this room`, 401)
    );
  }

  // Check if user is a member
  if (!room.members.includes(userId)) {
    return next(
      new ErrorResponse(`User ${userId} is not a member of this room`, 400)
    );
  }

  // Cannot remove admin
  if (room.admin.toString() === userId) {
    return next(
      new ErrorResponse(`Cannot remove admin from room`, 400)
    );
  }

  room.members = room.members.filter(member => member.toString() !== userId);
  await room.save();

  room = await Room.findById(room._id)
    .populate('members', 'username avatar')
    .populate('admin', 'username avatar');

  res.status(200).json({
    success: true,
    data: room
  });
});