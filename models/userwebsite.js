const db = require('.');

module.exports = (sequelize, Sequelize) => {
    // const User = require('./user')(sequelize, Sequelize);
    // const WebsiteModel = require('./website')(sequelize, Sequelize);

    const userwebsite = sequelize.define("userwebsite", {
        id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
        },
        userId: {
            type: Sequelize.INTEGER,
            unique: false,
            primaryKey: false,
            autoIncrement: false
        },
        websiteId: {
            type: Sequelize.INTEGER,
            unique: false
        }
    });
    return userwebsite;
};