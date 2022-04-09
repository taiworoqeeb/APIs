"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("eventsTickets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      quantity: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.STRING,
      },
      salesstart: {
        type: Sequelize.DATE,
      },
      salesend: {
        type: Sequelize.DATE,
      },
      eventname: {
        type: Sequelize.STRING,
      },
      booked: {
        type: Sequelize.STRING,
      },
      eventId: {
        type: Sequelize.INTEGER,
        references: {
          model: "events",
          key: "id",
        },
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
    await queryInterface.dropTable("eventsTickets");
  },
};
