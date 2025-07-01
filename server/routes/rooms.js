const express = require('express');
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  addMember,
  removeMember
} = require('../controllers/roomController');
const { protect } = require('../middleware/auth');
const { roomRules } = require('../middleware/validation');

const router = express.Router();

router
  .route('/')
  .get(protect, getRooms)
  .post(protect, roomRules(), createRoom);

router
  .route('/:id')
  .get(protect, getRoom)
  .put(protect, updateRoom)
  .delete(protect, deleteRoom);

router
  .route('/:id/add-member')
  .put(protect, addMember);

router
  .route('/:id/remove-member')
  .put(protect, removeMember);

module.exports = router;