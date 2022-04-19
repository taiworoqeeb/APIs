'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('promotions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
      },
      userId: {
        allowNull: true,
        type: Sequelize.UUID,
      },
      packageId: {
        allowNull: true,
        type: Sequelize.UUID,
      },
      eventId: {
        allowNull: true,
        type: Sequelize.UUID,
      },
      promotion_type: {
        type: Sequelize.ENUM("social_media", "local_press", "both")
      },
      status: {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      expiredAt: {
        allowNull: false,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('promotions');
  }
};