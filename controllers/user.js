const db = require("../models"); // models path depend on your structure
const bcrypt = require('bcrypt');
const config = require('../config/config')
const jwt = require('jsonwebtoken');
const passport  = require('passport');
const response = require('../lib/response');

// get all user details
const getUsers = async (req, res, next) => {
    const loginDetail = req.body;
    
    // if(req.user.role === 'admin') {
    //     const users = await db.user.findAll({attributes: ['id', 'name', 'email', 'websites', 'status', 'role']})
    //     res.send(users)
    // }
    try {        
        const users = await db.user.findAll({attributes: ['external_id','name', 'email', 'websites', 'status', 'role']})
        res.send(response.success("Account listing",users));
    } catch (error) {
        res.send(response.error(error))
    }
    
}

// delete user details
const deleteUser = async (req, res, next) => {
    try {
        const userDetail = req.body;
        const {userId} = req.params;
        if(!userId){
            throw {status:422, errors:{message:'Id is required'}}
        }


        const users = await db.user.destroy({where: {external_id: userId}})
        res.send(response.success('User has been deleted successfully',{}))
    } catch(err) {
       res.status(err.status || 422).send(response.error(err.errors));
    }
    
}
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
        console.log('err', err)
        res.status(err.status || 422).send(response.error(err.errors));
    }
}
const updateUser = async (req, res, next) => {
    try {
        const userDetail = req.body;
        const {userId} = req.params;
  
        if(!userId){
            throw {status:422, errors:{message:'Id is required'}}
        }


        const user = await db.user.findOne({ where: { external_id: userId } })
       
        if(user) {
            if(userDetail.password) {
                const salt = bcrypt.genSaltSync(config.bcrypt.saltRounds);
                const hash = bcrypt.hashSync(userDetail.password, salt);   
                userDetail.password = hash;
            } else {
                userDetail.password = user.password
            }
            const resdata = await db.user.update(userDetail, { where: { id: userId } })

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
    getUsers,
    deleteUser,
    signUp,
    updateUser
}