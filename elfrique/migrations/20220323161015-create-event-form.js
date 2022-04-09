"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("eventforms", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      image: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      startdate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      closedate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      timezone: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      fee: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM("free", "paid"),
        defaultValue: "free",
      },
      adminuserId: {
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
    await queryInterface.dropTable("eventforms");
  },
};
