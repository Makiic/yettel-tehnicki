const express = require('express');
const router = express.Router();

const authMw = require('../middleware/auth');
const role = require('../middleware/role');
const { validate, schemas } = require('../middleware/validate');
const Auth = require('../Controllers/authController');
const Users = require('../Controllers/userController');
const Tasks = require('../Controllers/taskController');


router.post('/auth/register', validate(schemas.register), Auth.register);
router.post('/auth/login', validate(schemas.login), Auth.login);

router.get('/users/me', authMw, Users.me);
router.put('/users/me', authMw, validate(schemas.userUpdate), Users.updateMe);

router.get('/users', authMw, role('admin'), Users.listUsers);
router.put('/users/:id', authMw, role('admin'), validate(schemas.userUpdate), Users.updateAny);

router.post('/tasks', authMw, role('basic', 'admin'), validate(schemas.taskCreate), Tasks.create);
router.get('/tasks/mine', authMw, role('basic', 'admin'), Tasks.listMine);
router.put('/tasks/:id', authMw, role('basic', 'admin'), validate(schemas.taskUpdate), Tasks.updateOwn);

router.get('/tasks', authMw, role('admin'), Tasks.listAll);
router.put('/tasks/:id/admin', authMw, role('admin'), validate(schemas.taskUpdate), Tasks.updateAny);

module.exports = router;