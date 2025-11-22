const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('yettel', 'postgres', 'super', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;
