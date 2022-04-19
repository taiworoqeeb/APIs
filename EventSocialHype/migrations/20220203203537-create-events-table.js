'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('events', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      type: {
        allowNull: true,
        type: Sequelize.ENUM("open", "invitation", "ticket")
      },
      title: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      organizers: {
        allowNull: true,
        type: Sequelize.STRING
      },
      slot: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      address: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      city: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      state: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      country: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      eventDate: {
        allowNull: true,
        type: Sequelize.DATE
      },
      eventTime: {
        allowNull: true,
        type: Sequelize.STRING
      },
      approvalStatus: {
        allowNull: true,
        type: Sequelize.ENUM("pending", "draft", "approved", "disapproved"),
        defaultValue: "pending"
      },
      eventStatus: {
        allowNull: true,
        type: Sequelize.ENUM("pending", "draft",  "ongoing", "completed"),
        defaultValue: "pending"
      },
      totalAmount: {
        allowNull: true,
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      trustScore: {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      investBtn: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      donateBtn: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      commentBtn: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      event_status: {
        type: Sequelize.ENUM("ongoing", "upcoming", "postponed", "cancelled"),
        allowNull: true,
        defaultValue: "upcoming"
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
    await queryInterface.dropTable('events');
  }
};