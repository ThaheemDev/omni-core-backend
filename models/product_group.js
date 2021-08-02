const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
    const productGroup = sequelize.define("product_group", {
        external_id: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            set(val) {
                let uid = uuidv4();
                this.setDataValue('external_id', uid);
            }
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Name is required'
                },
                len: {
                    args: [1, 255],
                    msg: "Name can not be greater than 255"
                },
            }
        }
    });
    return productGroup;
};
