const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const { User } = require('./User');

class Task extends Model {}

Task.init(
  {
    body: { type: DataTypes.TEXT, allowNull: false },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    timestamps: true,
  }
);

User.hasMany(Task, { as: 'tasks', foreignKey: 'ownerId' });
Task.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

module.exports = { Task };