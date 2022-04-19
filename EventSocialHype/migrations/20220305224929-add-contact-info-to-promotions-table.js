module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
  */
    return queryInterface.sequelize.transaction(async t => {
      try {
        const nameColumn = await queryInterface.addColumn(
          "promotions",
          "name",
          {
            type: Sequelize.STRING,
            allowNull: true
          },
          {
            transaction: t
          }
        );

        const emailColumn = await queryInterface.addColumn(
          "promotions",
          "email",
          {
            type: Sequelize.STRING,
            allowNull: true
          },
          {
            transaction: t
          }
        );
        const mobileColumn = await queryInterface.addColumn(
          "promotions",
          "mobile",
          {
            type: Sequelize.STRING,
            allowNull: true
          },
          {
            transaction: t
          }
        );

        return Promise.all(nameColumn,emailColumn, mobileColumn);
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
    const nameColumn = await queryInterface.removeColumn(
      "promotions",
      "name",
      {}
    );
    const emailColumn = await queryInterface.removeColumn(
      "promotions",
      "email",
      {}
    );
    const mobileColumn = await queryInterface.removeColumn(
      "promotions",
      "mobile",
      {}
    );
    return Promise.all(nameColumn, emailColumn, mobileColumn);
  }
};
