module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
  */
    return queryInterface.sequelize.transaction(async t => {
      try {
        const newspaperColumn = await queryInterface.addColumn(
          "promotions",
          "newspaper",
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          {
            transaction: t
          }
        );
        const radioColumn = await queryInterface.addColumn(
          "promotions",
          "radio",
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          {
            transaction: t
          }
        );
        const televisionColumn = await queryInterface.addColumn(
          "promotions",
          "television",
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          {
            transaction: t
          }
        );
        

        return Promise.all(newspaperColumn, radioColumn, televisionColumn);
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
    const newspaperColumn = await queryInterface.removeColumn(
      "promotions",
      "newspaper",
      {}
    );
    const radioColumn = await queryInterface.removeColumn(
      "promotions",
      "radio",
      {}
    );
    const televisionColumn = await queryInterface.removeColumn(
      "promotions",
      "television",
      {}
    );
    
    return Promise.all(newspaperColumn, radioColumn, televisionColumn);
  }
};
