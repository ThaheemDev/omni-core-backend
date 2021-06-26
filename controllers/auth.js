const db = require("../models"); // models path depend on your structure
const bcrypt = require('bcrypt');
const config = require('../config/config')
const jwt = require('jsonwebtoken');
const passport  = require('passport');
const response = require('../lib/response');

// // create user


// login to user
const login = async (req, res, next) => {
    console.log('req.body', req.body)
    passport.authenticate('local', (error, auser) => {
        console.log('auser', auser)
        console.log('error', error)
            
        if(error){
            return res.status(401).send(response.error({message:'Invalid username or password.'}));
        }
        if(auser == undefined){
            return res.status(401).send(response.error({message:'Invalid username or password.'}));
        }else{
            const userToSend = JSON.parse(JSON.stringify(auser))

            delete userToSend.password;

            userToSend.token = jwt.sign({ id: userToSend.id, role: userToSend.role }, config.jwt.secrate);

            req.login(userToSend, (error) => {
                if(error){
                    return res.status(401).send(response.error(error));
                }

                delete userToSend.id;
                delete userToSend.createdAt;
                delete userToSend.updatedAt;
                return res.status(200).send(response.success('Successfully logged-in.',userToSend));
                
            })
        }   
    }, (err) => {
        console.log('err', err)
        res.status(500).send(response.error(err));
        })(req, res, next)
}

// update user

module.exports = {
    login,
}