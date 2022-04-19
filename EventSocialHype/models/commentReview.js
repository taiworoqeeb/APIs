'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommentReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CommentReview.belongsTo(models.Comment, {
        foreignKey: "commentId",
        as: "comment",
      });
      CommentReview.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  };
  CommentReview.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
    },
    userId: {
      allowNull: true,
      type: DataTypes.UUID,
      unique: true
    },
    commentId: {
      allowNull: true,
      type: DataTypes.UUID
    },
    star: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: 5,
        min: 1
      }
    },
  }, {
    sequelize,
    modelName: 'CommentReview',
    tableName:"comment_reviews",
    timestamps: true,
    paranoid:true
  });
  // CommentReview.sync({force: true})
  return CommentReview;
};