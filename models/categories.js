'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Categories.belongsToMany(models.Posts, {
        through: 'PostsCategories',
        foreignKey: 'categoryId',
        as: 'posts',
      });
      // Categories.belongsToMany(models.PostsCategories, { through: 'PostsCategories', foreignKey: 'categoryId', as: 'category' });
    }
  }
  Categories.init({
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: true,
      type: Sequelize.DATE
    },
    deletedAt: {
      allowNull: true,
      type: Sequelize.DATE
    }
  }, {
    sequelize,
    paranoid: true,
    modelName: 'Categories',
  });
  return Categories;
};