'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
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
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [1, 255],
                msg: "Name can not be greater than 255"
            },
            notNull: {
                msg: 'Name is required'
            }
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: "Must be a valid email address",
            },
            len: {
                args: [1, 255],
                msg: "Email can not be greater than 255"
            },
            notNull: {
                msg: 'Email is required'
            }
        }
    },

    status: {
        type: Sequelize.ENUM,
        values: ['ACTIVE', 'BLOCKED'],
        defaultValue: "ACTIVE",
        validate: {
            customValidator(value) {
                if (['ACTIVE', 'BLOCKED'].indexOf(value) <= -1) {
                    throw new Error("Status value is incorrect");
                }
            }
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 64],
                msg: "Password range should be between 8-100 character"
            }
        }
    },
    roleId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'roles', key: 'id' },
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
    await queryInterface.dropTable('users');
  }
};
