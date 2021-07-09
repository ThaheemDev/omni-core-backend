const config = require("../config/config.js");
const Sequelize = require("sequelize");
const fs = require('fs');

const dbConfig = config.database;

let dbOps = {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  logging: true,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
};

// NOTE: do not remove this, I need it for testing with sqlite
if (dbConfig.storage) {
  dbOps.storage = dbConfig.storage;
}
const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, dbOps);


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const files = fs.readdirSync('./models');
files.forEach(function (file) {
  if (file != 'index.js') {
    let splitFile = file.split('.js');
    let name = splitFile[0];
    let filePath = `./${file}`
    db[name] = require(filePath)(sequelize, Sequelize);
  }
});

module.exports = db;
