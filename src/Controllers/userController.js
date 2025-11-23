const { User } = require('../Model/User');

exports.me = async (req, res) => {
  const me = await User.findByPk(req.user.id);
  res.json(me);
};

exports.updateMe = async (req, res) => {
  const me = await User.findByPk(req.user.id);
  await me.update(req.body);
  res.json(me);
};


exports.listUsers = async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } =
    req.query;
  const offset = (page - 1) * limit;
  const result = await User.findAndCountAll({
    offset: +offset,
    limit: +limit,
    order: [[sortBy, order.toUpperCase()]],
  });
  res.json({
    data: result.rows,
    page: +page,
    limit: +limit,
    total: result.count,
    totalPages: Math.ceil(result.count / +limit),
  });
};

exports.updateAny = async (req, res) => {
  const u = await User.findByPk(req.params.id);
  if (!u) return res.status(404).json({ message: 'Not found' });
  await u.update(req.body);
  res.json(u);
};