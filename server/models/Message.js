const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  reaction: {
    type: String,
    required: true,
    enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry']
  }
});

const MessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Please add some text']
  },
  reactions: [ReactionSchema],
  file: {
    url: String,
    type: {
      type: String,
      enum: ['image', 'video', 'document', 'audio']
    },
    name: String
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', MessageSchema);