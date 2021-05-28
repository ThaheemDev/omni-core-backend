const db = require("../models"); // models path depend on your structure

// get all user details
const getUsers = async (req, res, next) => {
    const loginDetail = req.body;
    if(req.user.role === 'admin') {
        const users = await db.user.findAll({attributes: ['id', 'name', 'email', 'websites', 'status', 'role']})
        res.send(users)
    }
}

// delete user details
const deleteUser = async (req, res, next) => {
    try {
        const id = req.query.id;
        const users = await db.user.destroy({where: {id: id}})
        res.send({
            message: 'update user successfully'
        })
    } catch(e) {
        res.status(500).send({
            message:
                e.message || "Some error occurred while delete user."
        });
    }
    
}

module.exports = {
    getUsers,
    deleteUser,
}