const Joi = require('joi');

exports.validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details });
  req.body = value;
  next();
};

exports.schemas = {
  register: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('basic', 'admin').optional(),
  }),
  login: Joi.object({ username: Joi.string(), email: Joi.string().email() })
    .xor('username', 'email')
    .concat(Joi.object({ password: Joi.string().required() })),
  userUpdate: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    username: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(6),
  }),
  taskCreate: Joi.object({ body: Joi.string().required() }),
  taskUpdate: Joi.object({ body: Joi.string().required() }),
};