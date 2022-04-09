"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("formQuestions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      question: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      eventformId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "eventforms",
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("formQuestions");
  },
};
