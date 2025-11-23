const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');

const ROLES = { BASIC: 'basic', ADMIN: 'admin' };

class User extends Model {
  async validPassword(plain) {
    return bcrypt.compare(plain, this.password);
  }
}

User.init(
  {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM(ROLES.BASIC, ROLES.ADMIN),
      defaultValue: ROLES.BASIC,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (u) => {
        u.password = await bcrypt.hash(u.password, 10);
      },
      beforeUpdate: async (u) => {
        if (u.changed('password')) u.password = await bcrypt.hash(u.password, 10);
      },
    },
    defaultScope: { attributes: { exclude: ['password'] } },
    scopes: { withPassword: { attributes: {} } },
  }
);

module.exports = { User, ROLES };