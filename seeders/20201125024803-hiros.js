'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    await queryInterface.bulkInsert('Hiros', [
    {
      
    },
  ], {});
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('Hiros', null, {});
  }
};
