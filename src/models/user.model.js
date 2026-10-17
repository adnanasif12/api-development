const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstname: { type: DataTypes.STRING(100), allowNull: false },
    lastname: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    profileImage: { type: DataTypes.STRING(255), allowNull: true },
    resetPasswordToken: { type: DataTypes.STRING(64), allowNull: true },
    resetPasswordExpires: { type: DataTypes.DATE, allowNull: true },
    role: { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' },
  },
  {
    tableName: 'users',
    createdAt: 'createAt',
    updatedAt: 'updateAt',
    // The password column is excluded from every query by default,
    // so it can never leak into an API response by accident.
    defaultScope: { attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] } },
    scopes: { withPassword: { attributes: { include: ['password'] } } },
  }
);

module.exports = User;
