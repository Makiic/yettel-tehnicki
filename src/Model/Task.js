const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); 

class Task extends Model {}

Task.init({
  body: { type: DataTypes.STRING, allowNull: false },
  
}, {
  sequelize,      
  modelName: 'Task',
  tableName: 'tasks',
  timestamps: false
});

module.exports = { Task };
