module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
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
            allowNull: false,
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
        role: {
            type: Sequelize.ENUM,
            allowNull: false,
            values:[1,2],
            defaultValue:2,
            validate: {
                customValidator(value) {
                    if ([1,2].indexOf(value) <= -1) {
                        throw new Error("Role is incorrect");
                    }
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [8, 100],
                    msg: "Passowrd range should be between 8-100 character"
                },
                notNull: {
                    msg: 'Password is required'
                }
            }
        }
    });
    return User;
};