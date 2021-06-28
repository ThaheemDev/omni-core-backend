'use strict';
const { v4: uuidv4 } = require('uuid');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

      await queryInterface.bulkInsert('roles', [{
        role: 'EMPLOYEE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role: 'MAINTAINER',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    queryInterface.bulkDelete('roles');
  }
};
