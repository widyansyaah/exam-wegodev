'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Posts.belongsToMany(models.Categories, {
        through: 'PostsCategories',
        foreignKey: 'postId',
        as: 'categories',
      });
      // Posts.has(models.PostsCategories, { through: 'PostsCategories', foreignKey: 'postId', as: 'postsCategories' });
    }
  }
  Posts.init({
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('Published', 'Unpublished'),
      allowNull: false,
      defaultValue: 'Published'
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
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
    modelName: 'Posts',
  });
  return Posts;
};