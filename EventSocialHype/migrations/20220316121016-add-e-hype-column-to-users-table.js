module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
  */
    return queryInterface.sequelize.transaction(async t => {
      try {
        const ehypeColumn = await queryInterface.addColumn(
          "users",
          "eHypeCurrency",
          {
            type: Sequelize.FLOAT,
            allowNull: true,
            defaultValue: 0.0
          },
          {
            transaction: t
          }
        );
        

        return Promise.all(ehypeColumn);
      } catch (error) {
        return t.rollback();
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
    const ehypeColumn = await queryInterface.removeColumn(
      "users",
      "eHypeCurrency",
      {}
    );
    
    return Promise.all(ehypeColumn);
  }
};
