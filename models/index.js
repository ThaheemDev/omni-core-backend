const config = require("../config/config.js");
const Sequelize = require("sequelize");
const fs = require('fs');
const dbConfig = config.database;
const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {  
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
fs.readdir('./models', (err, files) => {
  files.forEach(file => {
    if (file != 'index.js') {
      let splitFile = file.split('.js');
      let name = splitFile[0];
      let filePath = `./${file}`
      db[name] = require(filePath)(sequelize, Sequelize);
    }
  });
});


module.exports = db;