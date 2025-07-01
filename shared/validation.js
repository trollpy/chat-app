const Joi = require('joi');

module.exports = {
  registerSchema: Joi.object({
    username: Joi.string().min(2).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),
  loginSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  messageSchema: Joi.object({
    room: Joi.string().required(),
    text: Joi.string().when('file', {
      is: Joi.exist(),
      then: Joi.string().optional(),
      otherwise: Joi.string().required()
    }),
    file: Joi.object({
      url: Joi.string().required(),
      type: Joi.string().valid('image', 'video', 'document', 'audio').required(),
      name: Joi.string().required()
    }).optional()
  }),
  roomSchema: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    isPrivate: Joi.boolean().default(false),
    members: Joi.array().items(Joi.string()).min(1).required()
  })
};