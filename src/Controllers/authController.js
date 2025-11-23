const jwt = require('jsonwebtoken');
const { User } = require('../Model/User');

exports.register = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
};

exports.login = async (req, res) => {
  const { username, email, password } = req.body;
  const where = username ? { username } : { email };
  const user = await User.scope('withPassword').findOne({ where });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await user.validPassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET || 'devsecret',
    { expiresIn: '1d' }
  );
  res.json({ token });
};