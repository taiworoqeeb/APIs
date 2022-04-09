"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("votingContests", {
      id: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
      },
      title: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      votelimit: {
        type: Sequelize.STRING, //chanhe to date
      },
      startdate: {
        type: Sequelize.STRING,
      },
      closedate: {
        type: Sequelize.STRING,
      },
      timezone: {
        type: Sequelize.STRING,
      },
      paymentgateway: {
        type: Sequelize.STRING,
      },
      fee: {
        type: Sequelize.STRING,
      },
      packagestatus: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      adminuserId: {
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("votingContests");
  },
};
