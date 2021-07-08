const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("role", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
        role: {
            type: Sequelize.ENUM,
            values:['EMPLOYEE','ADMIN',"MAINTAINER"],
            defaultValue:'EMPLOYEE',
            unique: true,
            validate: {
                customValidator(value) {
                    if (['EMPLOYEE','MAINTAINER','ADMIN'].indexOf(value) <= -1) {
                        throw new Error("Role is incorrect");
                    }
                }
            }
        }
    });
    return Role;
};