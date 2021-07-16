const { v4: uuidv4 } = require('uuid');
const db = require('.');

module.exports = (sequelize, Sequelize) => {
    const productGroup = require('./product_group')(sequelize, Sequelize);

    const Product = sequelize.define("product", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
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
        short_description: {
            type: Sequelize.TEXT('tiny') 
        },
        description: {
            type: Sequelize.TEXT
        },
        buy_price: {
            type: Sequelize.FLOAT,
            allowNull: false,
             validate: {
                notNull: {
                    msg: 'Buy price is required'
                }
            }
        },
        recommended_retail_price: {
            type: Sequelize.FLOAT,
            allowNull: false,
             validate: {
                notNull: {
                    msg: 'Recommended retail price is required'
                }
            }
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        category: {
            type: Sequelize.STRING
        },
        sub_category: {
            type: Sequelize.STRING
        },
        supplier: {
            type: Sequelize.STRING
        },
        url: {
            type: Sequelize.STRING
        },
        brand: {
            type: Sequelize.STRING
        },
        images: {
            type: Sequelize.STRING
        }
    });

    Product.belongsTo(productGroup);
    return Product;
};