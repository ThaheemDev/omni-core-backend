'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('websites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
    external_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        set(val) {
            let uuid = uuidv4();
            this.setDataValue('external_id', uuid);
        }
    },
    status: {
        type: Sequelize.ENUM,
        values: ['ACTIVE', 'BLOCKED'],
        defaultValue: 'ACTIVE',
        validate: {
            customValidator(value) {
                if (['ACTIVE', 'BLOCKED'].indexOf(value) <= -1) {
                    throw new Error("Status value is incorrect");
                }
            }
        }
    },
    size: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['SMALL', 'MEDIUM', 'LARGE', 'XLARGE'],
        defaultValue: 'SMALL',
        validate: {
            customValidator(value) {
                if (['SMALL', 'MEDIUM', 'LARGE', 'XLARGE'].indexOf(value) <= -1) {
                    throw new Error("Status value is incorrect");
                }
            }
        }
    },
    domainname: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: {
                args: [1, 255],
                msg: "Domain name can not be greater than 255"
            },
            notNull: {
                msg: 'Domain name is required'
            }
        }
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
    await queryInterface.dropTable('websites');
  }
};