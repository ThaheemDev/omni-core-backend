const db = require("../models"); // models path depend on your structure
const bcrypt = require('bcrypt');
const config = require('../config/config')
const response = require('../lib/response');
const {v4: uuidv4} = require('uuid');

// TODO: only users with ADMIN role should be able to POST, PUT & DELETE. Add tests for this as well.
module.exports = {
  getUsers,
  deleteUser,
  createUser,
  updateUser
}

// get all user details
async function getUsers(req, res) {
  try {
    let {page, page_size} = req.query;
    page = Number(page) || 1;
    page_size = getValidPageSize(page_size);

    let offset = 0;
    if (page > 1) {
      offset = ((page - 1) * page_size);
    }

    const {
      count,
      rows
    } = await db.user.findAndCountAll({
        attributes: ['external_id', 'name', 'email', 'websites', 'status'],
        offset: offset,
        limit: page_size,
        include: db.role
      }
    );

    res.send(response.pagination(count, rows.map(response.listAccountViewModel), page))
  } catch (error) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }

}

// delete user details
async function deleteUser(req, res) {
  // TODO: should not be able to remove himself
  try {
    const userDetail = req.body;
    const {userId} = req.params;
    if (!userId) {
      throw {status: 422, message: 'Id is required'}
    }
    if (req && req.user && req.user.dataValues.external_id == userId) {
      throw {status: 422, message: 'You cannot delete yourself'}
    }
    const deleteCount = await db.user.destroy({where: {external_id: userId}})
    res.status(deleteCount > 0 ? 204 : 404).send();
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }

}

async function createUser(req, res) {
  // TODO: validate role and any other data that is not covered Sequelize validations/constrains.
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

    user.external_id = 0;
    user.roleId = (await db.role.findOne({where: {role: user.role}})).id;
    const data = await db.user.create(user);

    res.send(await response.accountViewModel(data));
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

async function updateUser(req, res) {
  // TODO: validate role and any other data that is not covered Sequelize validations/constrains.
  // TODO: user not allowed to change his own role
  // TODO: should not be able to change email
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
      userDetail.roleId = (await db.role.findOne({where: {role: userDetail.role}})).id;
      const resdata = await user.update(userDetail, {where: {id: user.id}})

      if (resdata) {
        res.send(await response.accountViewModel(resdata));
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

function getValidPageSize(value) {
  if ([10, 20, 50].includes(value)) {
    return value;
  }
  return 10;
}

