const { body, validationResult } = require('express-validator');

// Validation rules
exports.registerRules = () => {
  return [
    body('username', 'Username is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ];
};

exports.loginRules = () => {
  return [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
  ];
};

exports.messageRules = () => {
  return [
    body('room', 'Room ID is required').not().isEmpty(),
    body('text', 'Message text is required').not().isEmpty()
  ];
};

exports.roomRules = () => {
  return [
    body('name', 'Room name is required').not().isEmpty(),
    body('members', 'Members array is required').isArray()
  ];
};

// Validate middleware
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};