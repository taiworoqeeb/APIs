"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("trivia", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      adminuserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "adminusers",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      image: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      details: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      instruction: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      duration: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM("free", "paid"),
        defaultValue: "free",
      },
      numberoftimes: {
        allowNull: false,
        type: Sequelize.ENUM("once", "unlimited"),
        defaultValue: "unlimited",
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("trivia");
  },
};
