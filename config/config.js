let configFile = require('./config.json');
let config = configFile['local'];

let dbOptions = {
  host: process.env.DB_HOST || config.host,
  user: process.env.DB_USER || config.username,
  password: process.env.DB_PASS || config.password,
  db: config.database,
  dialect: config.dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

if (config.storage) {
  dbOptions.storage = config.storage;
}

module.exports = {
  database: dbOptions,
  bcrypt: {
    saltRounds: 10,
    plainText: 'Account_Api'
  }
};
