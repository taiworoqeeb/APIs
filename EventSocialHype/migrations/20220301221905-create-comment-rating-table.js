'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comment_reviews', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
      },
      userId: {
        allowNull: true,
        type: Sequelize.UUID,
        unique: true
      },
      commentId: {
        allowNull: true,
        type: Sequelize.UUID
      },
      star: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          max: 5,
          min: 1
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('comment_reviews');
  }
};