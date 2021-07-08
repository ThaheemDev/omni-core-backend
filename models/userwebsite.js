const db = require('.');

module.exports = (sequelize, Sequelize) => {
    // const User = require('./user')(sequelize, Sequelize);
    // const WebsiteModel = require('./website')(sequelize, Sequelize);

    // TODO: really no need to do this. Sequelize does that for you. See https://sequelize.org/master/manual/assocs.html#many-to-many-relationships
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
