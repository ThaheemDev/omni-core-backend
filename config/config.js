module.exports = {
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