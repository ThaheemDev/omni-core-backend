const db = require("../models"); // models path depend on your structure
const bcrypt = require('bcrypt');
const config = require('../config/config')
const jwt = require('jsonwebtoken');
const passport  = require('passport');
const response = require('../lib/response');
// login to user
const login = async (req, res, next) => {

    try {

        if(!(req.body && Object.keys(req.body).length>0)){
            throw {status:401,message:'Information is missing'};
        }

        if(!req.body.email){
            throw {status:401,message:'Email is required'};
        }

        if(!req.body.password){
            throw {status:401,message:'Password is required'};
        }

        passport.authenticate('local', (error, auser) => {
            
            if(error){
                throw {status:401,message:'Invalid username or password.'};
            }
            if(auser == undefined){
                throw {status:401,message:'Invalid username or password.'};
            }else{
                const userToSend = JSON.parse(JSON.stringify(auser))
    
                delete userToSend.password;
    
                userToSend.token = jwt.sign({ id: userToSend.id, role: userToSend.role }, config.jwt.secrate);
    
                req.login(userToSend, (error) => {
                    if(error){
                        throw error
                    }
    
                    delete userToSend.id;
                    delete userToSend.createdAt;
                    delete userToSend.updatedAt;
                    return res.status(200).send(response.success('Successfully logged-in.',userToSend));
                    
                })
            }   
        }, (err) => {
            res.status(response.getStatusCode(err)).send(response.error(err));
        })(req, res, next)
        
    } catch (err) {
        res.status(response.getStatusCode(err)).send(response.error(err));
    }



    
}

// update user

module.exports = {
    login,
}