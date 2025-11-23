const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('yettel', 'postgres', 'super', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

const connectSequelize = async () => {
  await sequelize.authenticate();
  await sequelize.sync(); 
  console.log('PostgreSQL connected & synced');
};

module.exports = sequelize;
module.exports.connectSequelize = connectSequelize;