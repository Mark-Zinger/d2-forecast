'use strict';
const heroesSeeds = require('../result/heroes.json')

heroesSeeds.forEach(el => {
  el.createdAt = new Date();
  el.updatedAt = new Date();
})

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Heros', [
      ...heroesSeeds
    ], {});

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('Heros', null, {});

  }
};
