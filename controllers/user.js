const db = require("../models"); // models path depend on your structure
const bcrypt = require('bcrypt');
const config = require('../config/config')
const response = require('../lib/response');

// get all user details
const getUsers = async (req, res, next) => {
  try {
    let {page, page_size} = req.query;
    page = Number(page);
    page_size = Number(page_size);

    let offset = 0;
    if (page > 1) {
      offset = ((page - 1) * page_size);
    }

    const {
      count,
      rows
    } = await db.user.findAndCountAll({
        attributes: ['external_id', 'name', 'email', 'websites', 'status', 'role'],
        offset: offset,
        limit: page_size
      }
    );

    let next = ((page * page_size) < count) ? true : false;
    res.send(response.pagination(count, rows, next))

  } catch (error) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }

}

// delete user details
const deleteUser = async (req, res, next) => {
  try {
    const userDetail = req.body;
    const {userId} = req.params;
    if (!userId) {
      throw {status: 422, message: 'Id is required'}
    }


    const users = await db.user.destroy({where: {external_id: userId}})
    res.send(response.success('User has been deleted successfully', {}))
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }

}
const signUp = async (req, res, next) => {
  const user = req.body;
  const salt = bcrypt.genSaltSync(config.bcrypt.saltRounds);

  if (user.password) {
    user.password = bcrypt.hashSync(String(user.password), salt);
  }

  try {
    const existsUser = await db.user.findOne({where: {email: user.email}})
    if (existsUser) {
      throw {status: 422, errors: {message: 'User Already Exists'}}
    }

    const data = await db.user.create(user);

    let dataToSend = data.dataValues;
    delete dataToSend.password;

    res.send(response.success('User created Successfully', dataToSend));

  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}
const updateUser = async (req, res, next) => {
  try {
    const userDetail = req.body;
    const {userId} = req.params;

    if (!userId) {
      throw {status: 422, errors: {message: 'Id is required'}}
    }


    const user = await db.user.findOne({where: {external_id: userId}})

    if (user) {
      if (userDetail.password) {
        const salt = bcrypt.genSaltSync(config.bcrypt.saltRounds);
        const hash = bcrypt.hashSync(userDetail.password, salt);
        userDetail.password = hash;
      } else {
        userDetail.password = user.password
      }
      const resdata = await db.user.update(userDetail, {where: {id: userId}})

      if (resdata) {
        res.send(response.success('User has been successfully updated.', {}));
      } else {
        throw {status: 422, errors: {message: 'Some error occurred while updating the user.'}}
      }
    } else {
      throw {status: 422, errors: {message: 'User is not found'}}

    }
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}
module.exports = {
  getUsers,
  deleteUser,
  signUp,
  updateUser
}
