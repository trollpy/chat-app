const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = {
  validateRegisterInput: (data) => {
    let errors = {};

    data.username = !isEmpty(data.username) ? data.username : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    if (!validator.isLength(data.username, { min: 2, max: 30 })) {
      errors.username = 'Username must be between 2 and 30 characters';
    }

    if (validator.isEmpty(data.username)) {
      errors.username = 'Username field is required';
    }

    if (validator.isEmpty(data.email)) {
      errors.email = 'Email field is required';
    }

    if (!validator.isEmail(data.email)) {
      errors.email = 'Email is invalid';
    }

    if (validator.isEmpty(data.password)) {
      errors.password = 'Password field is required';
    }

    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (validator.isEmpty(data.password2)) {
      errors.password2 = 'Confirm Password field is required';
    }

    if (!validator.equals(data.password, data.password2)) {
      errors.password2 = 'Passwords must match';
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  },

  validateLoginInput: (data) => {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (validator.isEmpty(data.email)) {
      errors.email = 'Email field is required';
    }

    if (!validator.isEmail(data.email)) {
      errors.email = 'Email is invalid';
    }

    if (validator.isEmpty(data.password)) {
      errors.password = 'Password field is required';
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  },

  validateMessageInput: (data) => {
    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : '';
    data.room = !isEmpty(data.room) ? data.room : '';

    if (validator.isEmpty(data.text) && !data.file) {
      errors.text = 'Message text is required if no file is attached';
    }

    if (validator.isEmpty(data.room)) {
      errors.room = 'Room ID is required';
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
};