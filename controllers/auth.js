const db = require("../models"); // models path depend on your structure
const bcrypt = require('bcrypt');
const config = require('../config/config')
const jwt = require('jsonwebtoken');
const passport  = require('passport');
const response = require('../lib/response');

// create user
const signUp = async (req, res, next) => {
    const user = req.body;    
    const salt = bcrypt.genSaltSync(config.bcrypt.saltRounds);

    if(user.password){
        user.password = bcrypt.hashSync(String(user.password), salt); 
    }
  


    try {
        const existsUser = await db.user.findOne({ where: { email: user.email } })
        if(existsUser) {
            throw {status:422, errors:{message:'User Already Exists'}}
        }

        const data = await db.user.create(user);
        let dataToSend = data.dataValues;
        delete dataToSend.password;

        res.send(response.success('User created Successfully',dataToSend));

    } catch (err) {       
        res.status(err.status || 422).send(response.error(err.errors));
    }
}

// login to user
const login = async (req, res, next) => {
    passport.authenticate('local', (error, auser) => {
            
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

                return res.status(200).send(response.success('Successfully logged-in.',userToSend));
                
            })
        }   
    }, (err) => {
        res.status(500).send(response.error(err));
        })(req, res, next)
}

// update user
const updateUser = async (req, res, next) => {
    try {
        const userDetail = req.body;

        if(!userDetail.id){
            throw {status:422, errors:{message:'Id is required'}}
        }


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

            if(resdata){
                res.send(response.success('User has been successfully updated.',{}));
            } else {
                throw {status:422, errors:{message:'Some error occurred while updating the user.'}}
            }
        } else {
            throw {status:422, errors:{message:'User is not found'}}
            
        }
    } catch (err) {
        res.status(err.status || 422).send(response.error(err.errors));
    }
}
module.exports = {
    signUp,
    login,
    updateUser
}