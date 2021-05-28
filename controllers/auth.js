const db = require("../models"); // models path depend on your structure
const bcrypt = require('bcrypt');
const config = require('../config/config')
const jwt = require('jsonwebtoken');
const passport  = require('passport');

// create user
const signUp = async (req, res, next) => {
    const user = req.body;
    
    const salt = bcrypt.genSaltSync(config.bcrypt.saltRounds);
    const hash = bcrypt.hashSync(user.password, salt);   
    user.password = hash;

    try {
        const existsUser = await db.user.findOne({ where: { email: user.email } })
        if(existsUser) {
            res.status(500).send({ message: 'User Already Exists' })
            return false
        }

        const data = await db.user.create(user)
        const dataToSend = data;
        delete dataToSend.password
        res.send({ message: 'User created Successfully' })
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while signUp."
        });
    }
}

// login to user
const login = async (req, res, next) => {
    passport.authenticate('local', (error, auser) => {
        if(error){
            return res.status(400).send({
                data:{}
            })
        }
        if(auser == undefined){
            return res.status(400).send({
                data:{}
            })  

        }else{
            const userToSend = JSON.parse(JSON.stringify(auser))
            delete userToSend.password;
            userToSend.token = jwt.sign({ id: userToSend.id, role: userToSend.role }, config.jwt.secrate);
            req.login(userToSend, (error) => {
                return res.status(200).send({
                    data : userToSend
                });
            })
        }   
    }, (err) => {
            return res.status(400).send({
                code : 2004,
                data : {}
            })
        })(req, res, next)
    // const loginDetail = req.body;
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
            res.send({
                message: 'update user successfully'
            })
        } else {
            res.status(500).send({
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