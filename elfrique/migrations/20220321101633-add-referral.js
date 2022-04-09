"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "adminusers",
          "reference",
          {
            allowNull: true,
            type: Sequelize.STRING,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "adminusers",
          "referral_id",
          {
            allowNull: true,
            type: Sequelize.INTEGER,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     *
     */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("adminusers", "reference", {
          transaction: t,
        }),
        queryInterface.removeColumn("adminusers", "referral_id", {
          transaction: t,
        }),
      ]);
    });
  },
};
