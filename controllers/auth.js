const db = require("../models"); // models path depend on your structure
const bcrypt = require('bcrypt');
const config = require('../config/config')

// create user
const signUp = async (req, res, next) => {
    const user = req.body;
    
    const salt = bcrypt.genSaltSync(config.bcrypt.saltRounds);
    const hash = bcrypt.hashSync(user.password, salt);   
    user.password = hash;

    try {
        const data = await db.user.create(user)
        const dataToSend = data;
        delete dataToSend.password
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while signUp."
        });
    }
}

// login to user
const login = async (req, res, next) => {
    const loginDetail = req.body;
    const user = await db.user.findOne({ where: { email: loginDetail.email } })
    if(user) {
        const isSame = await bcrypt.compare(loginDetail.password, user.password)
        console.log(isSame)
        if(isSame) {
            delete user.password;
            user.isLogin = true;
            res.send(user)
        } else {
            res.status(204).send({
                message:
                    "Email and Password not match."
            });
        }
    } else {
        res.status(204).send({
            message:
                "User not found."
        });
    }
}

// update user
const updateUser = async (req, res, next) => {
    try {
        const userDetail = req.body;
        const user = await db.user.findOne({ where: { id: userDetail.id } })
        if(user) {
            if(userDetail.password) {
                const salt = bcrypt.genSaltSync(config.bcrypt.saltRounds);
                const hash = bcrypt.hashSync(userDetail.password, salt);   
                userDetail.password = hash;
            } else {
                userDetail.password = user.password
            }
            const resdata = await db.user.update(userDetail, { where: { id: userDetail.id } })
            res.send(resdata)
        } else {
            res.status(204).send({
                message:
                    "User not found."
            });
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({
            message:
                e.message || "Some error occurred while update user."
        });
    }
}
module.exports = {
    signUp,
    login,
    updateUser
}