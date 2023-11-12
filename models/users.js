'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init({
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  fullName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  role: {
    type: Sequelize.ENUM('Admin', 'Member'),
    allowNull: false,
    defaultValue: 'Member'
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('Active', 'Suspend'),
    allowNull: false,
    defaultValue: 'Active'
  },
  avatar: {
    type: Sequelize.UUID,
    allowNull: true
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: true
  },
  deletedAt: {
    type: Sequelize.DATE,
    allowNull: true
  }}, {
    sequelize,
    paranoid: true,
    modelName: 'Users',
  });
  return Users;
};