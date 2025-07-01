const express = require('express');
const {
  getMessages,
  createMessage,
  deleteMessage,
  reactToMessage
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const { messageRules } = require('../middleware/validation');

const router = express.Router();

router
  .route('/messages/:roomId')
  .get(protect, getMessages);

router
  .route('/messages')
  .post(protect, messageRules(), createMessage);

router
  .route('/messages/:id')
  .delete(protect, deleteMessage);

router
  .route('/messages/:id/react')
  .put(protect, reactToMessage);

module.exports = router;