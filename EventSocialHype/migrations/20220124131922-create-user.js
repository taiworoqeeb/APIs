'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      username: {
        allowNull: true,
        type: Sequelize.STRING
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING
      },
      phone: {
        allowNull: true,
        type: Sequelize.STRING
      },
      activated:{
        allowNull: true,
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
      token: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.ENUM("event_organizer", "event_vendor", "socialite"),
        allowNull: true,
      },
      wallet: {
        allowNull: true,
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
      },
      business: {
        allowNull: true,
        type: Sequelize.STRING
      },
      address: {
        allowNull: true,
        type: Sequelize.STRING
      },
      state: {
        allowNull: true,
        type: Sequelize.STRING
      },
      city: {
        allowNull: true,
        type: Sequelize.STRING
      },
      country: {
        allowNull: true,
        type: Sequelize.STRING
      },
      referral_count: {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      referral_amount: {
        allowNull: true,
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING
      },
      reference: {
        allowNull: true,
        type: Sequelize.STRING
      },
      referral_id: {
        allowNull: true,
        type: Sequelize.UUID,
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
    await queryInterface.dropTable('users');
  }
};