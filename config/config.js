let configFile = require('./config.json');
let config = configFile['local'];

module.exports = {
  database: {
    host: config.host,
    user: config.username,
    password: config.password,
    db: config.database,
    dialect: config.dialect,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  bcrypt: {
    saltRounds: 10,
    plainText: 'Account_Api'
  },
  jwt: {
    secrate: 'secrateText'
  }
};