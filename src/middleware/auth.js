const jwt = require('jsonwebtoken');
const { User } = require('../Model/User');

module.exports = async (req, res, next) => {
  try {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'No token' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    const user = await User.findByPk(payload.sub);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user.toJSON();
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
};