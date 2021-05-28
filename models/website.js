module.exports = (sequelize, Sequelize) => {
    const Website = sequelize.define("website", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false
        },
        size: {
            type: Sequelize.ENUM,
            allowNull: false,
            values: ['SMALL', 'MEDIUM', 'LARGE', 'XLARGE']
        },
        domainname: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return Website;
};