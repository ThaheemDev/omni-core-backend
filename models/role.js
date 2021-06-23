module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("role", {
        role: {
            type: Sequelize.ENUM,
            allowNull: false,
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