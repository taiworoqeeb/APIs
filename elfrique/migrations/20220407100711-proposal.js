'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("proposals", {
      id: {
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
    },
    userId:{
        type: Sequelize.INTEGER,
        references:{ 
            model: 'adminusers',
            key: 'id',
        }
    },
    jobId:{
        type: Sequelize.STRING,
        references:{ 
            model: 'eventjobs',
            key: 'id',
        }
    },
    description: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable("proposal");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
