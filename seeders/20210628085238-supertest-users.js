'use strict';

const bcrypt = require('bcrypt');
const config = require('../config/config')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminRole = await queryInterface.rawSelect('roles', {
      where: {
        role: 'ADMIN',
      },
    }, ['id']);

    const EMPRole = await queryInterface.rawSelect('roles', {
      
      where: {
        role: 'EMPLOYEE',
      },
    }, ['id']);

    let password = bcrypt.hashSync('supertest', bcrypt.genSaltSync(config.bcrypt.saltRounds));

    return queryInterface.bulkInsert('users', [{
      name: 'SuperTest SuperAdmin',
      email: 'superadmin@local',
      external_id: 'acc2baec-d7f6-11eb-91bc-d7c92cdd4004',
      status: 'ACTIVE',
      roleId: adminRole,
      password: password,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'normal User',
      email: 'user@local',
      external_id: 'bcc3b4ec-d7f6-11eb-91bc-d7c92cdd1001',
      status: 'ACTIVE',
      roleId: EMPRole,
      password: password,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    queryInterface.bulkDelete('users');
  }
};