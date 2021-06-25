module.exports = {
  local: {
    username: 'root',
    password: '',
    database: 'accountManage',
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  database: {
    host: "localhost",
    user: "root",
    password: "",
    db: "accountManage",
    dialect: "mysql",
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