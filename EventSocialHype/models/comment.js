'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.Event, {
        foreignKey: "eventId",
        as: "event",
      });
      Comment.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Comment.hasMany(models.CommentReview, {
        foreignKey: "commentId",
        as: "comments",
      });
    }
  };
  Comment.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
    },
    userId: {
      allowNull: true,
      type: DataTypes.UUID
    },
    eventId: {
      allowNull: true,
      type: DataTypes.UUID
    },
    comment: {type: DataTypes.TEXT},
  }, {
    sequelize,
    modelName: 'Comment',
    tableName:"comments",
    timestamps: true,
    paranoid:true
  });
  // Comment.sync({force: true})
  return Comment;
};