const { v4: uuidv4 } = require('uuid');
const db = require('.');

// TODO: this is not a product, but that an override of the original product.
// TODO: see https://gitlab.com/hadiethshop/product-api-mock/-/blob/master/openapi.yaml
module.exports = (sequelize, Sequelize) => {
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
        // TODO: update your err msg, please.
        short_description: {
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
        // TODO: update your err msg, please.
        description: {
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

        language: {
            type: Sequelize.STRING,
            allowNull: false
        },

        price: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        active: {
            type: Sequelize.BOOLEAN
        },
        category: {
            type: Sequelize.STRING,
            allowNull: false
        },
        sub_category: {
            type: Sequelize.STRING,
            allowNull: false
        },
        brand: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return Product;
};