const { v4: uuidv4 } = require('uuid');
const db = require('.');

module.exports = (sequelize, Sequelize) => {
  const websiteModel = require('./website')(sequelize, Sequelize);
  const productModel = require('./product')(sequelize, Sequelize);

  const ProductWebsite = sequelize.define("product_website", {
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
      type: Sequelize.TEXT('tiny')
    },
    description: {
      type: Sequelize.TEXT
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
      field: 'productId',
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
      field: 'websiteId',
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
