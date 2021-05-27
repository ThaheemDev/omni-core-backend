module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                msg: "Must be a valid email address",
                },
            }
        },
        websites: {
            type: Sequelize.STRING,
            allowNull: false,
            get() {
                return this.getDataValue('websites').split(';')
            },
            set(val) {
               this.setDataValue('websites',val.join(';'));
            },
        },
        status: {
            type: Sequelize.ENUM,
            allowNull: false,
            values: ['ACTIVE', 'BLOCKED']
        },
        role: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return User;
};