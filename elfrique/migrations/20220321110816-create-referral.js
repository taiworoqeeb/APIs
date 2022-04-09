"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("referrals", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
      },
      referral_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "adminusers",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      user_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "adminusers",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("referrals");
  },
};
