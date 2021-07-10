const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
    const productGroup = sequelize.define("product_group", {
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
                notNull: {
                    msg: 'Name is required'
                }
            }
        }
    });
    return productGroup;
};