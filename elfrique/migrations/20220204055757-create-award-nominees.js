"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("awardNominees", {
      id: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
      },
      fullname: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      contestantnumber: {
        type: Sequelize.STRING,
      },
      about: {
        type: Sequelize.TEXT,
      },
      awardContestId: {
        type: Sequelize.UUID,
        references: {
          model: "awardContests",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      awardCategoriesId: {
        type: Sequelize.UUID,
        references: {
          model: "awardCategories",
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("awardNominees");
  },
};
