module.exports = (sequelize, Sequelize) => {
    const Website = sequelize.define("website", {
        status: {
            type: Sequelize.ENUM,
            allowNull: false,
            values: [1,2,3],
            defaultValue:1,
            validate: {
                customValidator(value) {
                    if ([1,2,3].indexOf(value) <= -1) {
                        throw new Error("Status value is incorrect");
                    }
                }
            }
        },
        size: {
            type: Sequelize.ENUM,
            allowNull: false,
            values: ['SMALL', 'MEDIUM', 'LARGE', 'XLARGE'],
            defaultValue:'SMALL',
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
            validate: {
                len: {
                    args: [1, 255],
                    msg: "Domain name can not be greater than 255"
                },
                notNull: {
                    msg: 'Domain name is required'
                }
            }
        }
    });
    return Website;
};