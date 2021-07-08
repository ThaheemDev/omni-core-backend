const db = require('.');

module.exports = (sequelize, Sequelize) => {
    const User = require('./user')(sequelize, Sequelize);
    const WebsiteModel = require('./website')(sequelize, Sequelize);


    const userwebsite = sequelize.define("userwebsite", {
        userwebsiteid: {
            type: Sequelize.INTEGER
        },
        userId: {
            type: Sequelize.INTEGER,
            unique: false
        },
        websiteId: {
            type: Sequelize.INTEGER,
            unique: false
        }
    });

    User.belongsToMany(WebsiteModel, {
        through: userwebsite,
        foreignKey: 'userId'
    });
    WebsiteModel.belongsToMany(User, {
        through: userwebsite,
        foreignKey: 'websiteId'
    });

    User.belongsTo(WebsiteModel);
    WebsiteModel.belongsTo(User);
    User.hasMany(WebsiteModel)
    WebsiteModel.hasMany(User)


    return userwebsite;
};
