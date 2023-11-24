'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostsCategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // PostsCategories.belongsToMany(models.Categories, {through: 'PostsCategories', foreignKey: 'categoryId', as: 'category'});
      // PostsCategories.belongsToMany(models.Posts, {through: 'Posts', foreignKey: 'postId', as: 'post'})
    }
  }
  PostsCategories.init({
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    categoryId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    postId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: true,
      type: Sequelize.DATE
    }
  }, {
    sequelize,
    modelName: 'PostsCategories',
  });
  return PostsCategories;
};