module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
  */
    return queryInterface.sequelize.transaction(async t => {
      try {
        const contactOrganizerColumn = await queryInterface.addColumn(
          "events",
          "contact_organizer",
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          {
            transaction: t
          }
        );
        const get_directionColumn = await queryInterface.addColumn(
          "events",
          "get_direction",
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          {
            transaction: t
          }
        );
        const request_inviteColumn = await queryInterface.addColumn(
          "events",
          "request_invite",
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          {
            transaction: t
          }
        );
        
        const donateColumn = await queryInterface.addColumn(
          "events",
          "donate",
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          {
            transaction: t
          }
        );
        

        return Promise.all(contactOrganizerColumn, get_directionColumn, request_inviteColumn, donateColumn);
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
    const contactOrganizerColumn = await queryInterface.removeColumn(
      "events",
      "newspaper",
      {}
    );
    const get_directionColumn = await queryInterface.removeColumn(
      "events",
      "get_direction",
      {}
    );
    const request_inviteColumn = await queryInterface.removeColumn(
      "events",
      "request_invite",
      {}
    );
    
    const donateColumn = await queryInterface.removeColumn(
      "events",
      "donate",
      {}
    );
    
    return Promise.all(contactOrganizerColumn, get_directionColumn, request_inviteColumn, donateColumn);
  }
};
