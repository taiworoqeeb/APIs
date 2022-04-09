'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable("eventjobs", {
        id: {
          type: Sequelize.STRING(10),
          autoincrement: false,
          allowNull: false,
          primaryKey: true,
      },
      eventId:{
          type: Sequelize.INTEGER,
          references:{ 
              model: 'events',
              key: 'id',
          }
      },
      job_type: {
          type: Sequelize.STRING,
      },
      job_description: {
          type: Sequelize.STRING,
      },
      budget: {
          type: Sequelize.STRING
      },
      location:{
          type: Sequelize.STRING
      },
      assign: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
      },
      userassignId: {
          type: Sequelize.INTEGER,
          references:{ 
              model: 'adminusers',
              key: 'id',
          }
      },
      img_id: {
        type: Sequelize.STRING
      },
      img_url: {
        type: Sequelize.STRING
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
  
      })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("eventjobs");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
