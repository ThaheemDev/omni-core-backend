const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("role", {
        external_id: {
            type: Sequelize.STRING,
            defaultValue: uuidv4(),
            set(val) {
                let uuid = uuidv4();
                this.setDataValue('external_id', uuid);
            }
        },
        role: {
            type: Sequelize.ENUM,
            values:['EMPLOYEE','ADMIN',"MAINTAINER"],
            defaultValue:'EMPLOYEE',
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