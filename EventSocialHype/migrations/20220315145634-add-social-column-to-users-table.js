module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
  */
    return queryInterface.sequelize.transaction(async t => {
      try {
        const instagramColumn = await queryInterface.addColumn(
          "users",
          "instagram",
          {
            type: Sequelize.STRING,
            allowNull: true
          },
          {
            transaction: t
          }
        );

        const twitterColumn = await queryInterface.addColumn(
          "users",
          "twitter",
          {
            type: Sequelize.STRING,
            allowNull: true
          },
          {
            transaction: t
          }
        );

        const snapchatColumn = await queryInterface.addColumn(
          "users",
          "snapchat",
          {
            type: Sequelize.STRING,
            allowNull: true
          },
          {
            transaction: t
          }
        );
        
        const facebookColumn = await queryInterface.addColumn(
          "users",
          "facebook",
          {
            type: Sequelize.STRING,
            allowNull: true
          },
          {
            transaction: t
          }
        );
        

        return Promise.all(instagramColumn, twitterColumn, snapchatColumn, facebookColumn);
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
    const instagramColumn = await queryInterface.removeColumn(
      "users",
      "instagram",
      {}
    );
    const twitterColumn = await queryInterface.removeColumn(
      "users",
      "twitter",
      {}
    );

    const snapchatColumn = await queryInterface.removeColumn(
      "users",
      "snapchat",
      {}
    );
    const facebookColumn = await queryInterface.removeColumn(
      "users",
      "facebook",
      {}
    );
    
    return Promise.all(instagramColumn, twitterColumn, snapchatColumn, facebookColumn);
  }
};
