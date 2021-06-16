const db = require("../models"); // models path depend on your 
const response = require('../lib/response');

// get all user details
const getUsers = async (req, res, next) => {
    const loginDetail = req.body;
    console.log('req.user', req.user)
    // if(req.user.role === 'admin') {
    //     const users = await db.user.findAll({attributes: ['id', 'name', 'email', 'websites', 'status', 'role']})
    //     res.send(users)
    // }
    try {        
        const users = await db.user.findAll({attributes: ['id', 'name', 'email', 'websites', 'status', 'role']})
        res.send(response.success("Account listing",users));
    } catch (error) {
        res.send(response.error(error))
    }
    
}

// delete user details
const deleteUser = async (req, res, next) => {
    try {
        const userDetail = req.body;
        if(!userDetail.id){
            throw {status:422, errors:{message:'Id is required'}}
        }


        const id = userDetail.id;
        
        const users = await db.user.destroy({where: {id: id}})
        res.send(response.success('User has been deleted successfully',{}))
    } catch(err) {
       res.status(err.status || 422).send(response.error(err.errors));
    }
    
}

module.exports = {
    getUsers,
    deleteUser,
}