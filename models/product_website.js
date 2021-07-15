const { v4: uuidv4 } = require('uuid');
const db = require('.');

// TODO: this is not a product, but that an override of the original product.
// TODO: see https://gitlab.com/hadiethshop/product-api-mock/-/blob/master/openapi.yaml
module.exports = (sequelize, Sequelize) => {
    const websiteModel = require('./website')(sequelize, Sequelize);
    const productModel = require('./product')(sequelize, Sequelize);

    const ProductWebsite = sequelize.define("product_webiste", {
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
            validate: {
                len: {
                    args: [1, 255],
                    msg: "Name can not be greater than 255"
                }
            }
        },
        short_description: {
            type: Sequelize.STRING,
            validate: {
                len: {
                    args: [1, 255],
                    msg: "Short description can not be greater than 255"
                }
            }
        },
        description: {
            type: Sequelize.STRING,
            validate: {
                len: {
                    args: [1, 255],
                    msg: "Description can not be greater than 255"
                }
            }
        },
        language: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.FLOAT
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
        }        
    });

 
    ProductWebsite.belongsTo(productModel, {
        foreignKey: {
          field: 'product',
          allowNull: false,
          validate: {
            notNull: {
                msg: 'Product id is required'
            }
        }
        }
      });

      ProductWebsite.belongsTo(websiteModel, {
        foreignKey: {
          field: 'website',
          allowNull: false,
          validate: {
            notNull: {
                msg: 'Website id is required'
            }
        }
        }
      });

    return ProductWebsite;
};