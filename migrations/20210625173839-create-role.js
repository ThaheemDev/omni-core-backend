'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      external_id: {
        type: Sequelize.STRING,
        defaultValue: uuidv4(),
        set(val) {
            let uuid = uuidv4();
            this.setDataValue('external_id', uuid);
        }
    },
      role: {
        type: Sequelize.ENUM,
        values:['EMPLOYEE','ADMIN',"MAINTAINER"],
        defaultValue:'EMPLOYEE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('roles');
  }
};