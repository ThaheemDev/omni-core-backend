const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
    const roleModel = require('./role')(sequelize, Sequelize);
    const WebsiteModel = require('./website')(sequelize, Sequelize);

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
    });
    User.belongsTo(roleModel);

    
    // User.belongsToMany(WebsiteModel,{ through: 'User_Websites' });
    // WebsiteModel.belongsToMany(User,{ through: 'User_Websites' });

 
    //   User.associate = function (models) {
    //     User.hasMany(WebsiteModel, { 
    //       foreignKey: 'userId', 
    //       as: 'websites' 
    //     });
    //   };

    return User;
};