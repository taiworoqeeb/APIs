module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
  */
    return queryInterface.sequelize.transaction(async t => {
      try {
        const longitudeColumn = await queryInterface.addColumn(
          "events",
          "longitude",
          {
            type: Sequelize.STRING,
            allowNull: true
          },
          {
            transaction: t
          }
        );

        const latitudeColumn = await queryInterface.addColumn(
          "events",
          "latitude",
          {
            type: Sequelize.STRING,
            allowNull: true
          },
          {
            transaction: t
          }
        );
        

        return Promise.all(longitudeColumn,latitudeColumn);
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
    const longitudeColumn = await queryInterface.removeColumn(
      "events",
      "longitude",
      {}
    );
    const latitudeColumn = await queryInterface.removeColumn(
      "events",
      "latitude",
      {}
    );
    
    return Promise.all(longitudeColumn, latitudeColumn);
  }
};
