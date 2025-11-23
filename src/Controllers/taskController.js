const { Task } = require('../Model/Task');

const p = (q) => {
  const page = Math.max(1, parseInt(q.page || '1', 10));
  const limit = Math.max(1, Math.min(100, parseInt(q.limit || '10', 10)));
  const offset = (page - 1) * limit;
  const sortBy = ['createdAt', 'updatedAt'].includes(q.sortBy)
    ? q.sortBy
    : 'createdAt';
  const order = (q.order || 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  return { page, limit, offset, sortBy, order };
};

exports.create = async (req, res) => {
  const task = await Task.create({ body: req.body.body, ownerId: req.user.id });
  res.status(201).json(task);
};

exports.listMine = async (req, res) => {
  const { page, limit, offset, sortBy, order } = p(req.query);
  const { rows, count } = await Task.findAndCountAll({
    where: { ownerId: req.user.id },
    offset,
    limit,
    order: [[sortBy, order]],
  });
  res.json({ data: rows, page, limit, total: count, totalPages: Math.ceil(count / limit) });
};

exports.updateOwn = async (req, res) => {
  const t = await Task.findOne({ where: { id: req.params.id, ownerId: req.user.id } });
  if (!t) return res.status(404).json({ message: 'Not found' });
  await t.update({ body: req.body.body });
  res.json(t);
};

exports.listAll = async (req, res) => {
  const { page, limit, offset, sortBy, order } = p(req.query);
  const { rows, count } = await Task.findAndCountAll({ offset, limit, order: [[sortBy, order]] });
  res.json({ data: rows, page, limit, total: count, totalPages: Math.ceil(count / limit) });
};

exports.updateAny = async (req, res) => {
  const t = await Task.findByPk(req.params.id);
  if (!t) return res.status(404).json({ message: 'Not found' });
  await t.update({ body: req.body.body });
  res.json(t);
};