const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
    const roleModel = require('./role')(sequelize, Sequelize);
    const User = sequelize.define("user", {
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
        // TODO: convert this into an one-to-many association. This should be a list of foreign keys.
        websites: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 255],
                    msg: "Websites can not be greater than 255"
                },
                notNull: {
                    msg: 'Websites is required'
                }
            },
            get() {
                return (this.getDataValue('websites'))?this.getDataValue('websites').split(';'):'';
            },
            set(val) {
                this.setDataValue('websites', val.join(';'));
            }
        },
        status: {
            type: Sequelize.ENUM,
            values: ['ACTIVE', 'BLOCKED'],
            defaultValue:"ACTIVE",
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
        }
    });
    User.belongsTo(roleModel);
    return User;
};
