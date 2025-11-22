// src/Model/User.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // import Sequelize instance

const ROLES = {
  BASIC: 'basic',
  ADMIN: 'admin',
};

class User extends Model {}

User.init({
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { 
    type: DataTypes.ARRAY(DataTypes.STRING), 
    defaultValue: [ROLES.BASIC]
  }
}, {
  sequelize,       // OVDE se koristi tvoja instanca iz db.js
  modelName: 'User',
  tableName: 'users',
  timestamps: false
});

module.exports = { User, ROLES };
