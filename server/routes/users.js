const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserRooms
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin'), getUsers);

router
  .route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, authorize('admin'), deleteUser);

router
  .route('/:id/rooms')
  .get(protect, getUserRooms);

module.exports = router;