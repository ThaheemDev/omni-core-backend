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
    let password = bcrypt.hashSync('supertest', bcrypt.genSaltSync(config.bcrypt.saltRounds));
    return queryInterface.bulkInsert('users', [{
      name: 'SuperTest SuperAdmin',
      email: 'superadmin@local',
      external_id: 'acc2baec-d7f6-11eb-91bc-d7c92cdd4004',
      status: 'ACTIVE',
      roleId: adminRole,
      // TODO: fix this once website is converted into one-to-many association
      websites: '',
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
