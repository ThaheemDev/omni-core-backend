const db = require("../models"); // models path depend on your structure
const bcrypt = require('bcrypt');
const config = require('../config/config')
const response = require('../lib/response');
const {getValidPageSize} = require("../lib/utility");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = {
  getUsers,
  deleteUser,
  createUser,
  updateUser
}

// get all user details
async function getUsers(req, res) {

  try {
  let { page, page_size,name,email,status,role } = req.query;
    page = Number(page) || 1;
    page_size = getValidPageSize(page_size);

    let offset = 0;
    if (page > 1) {
      offset = ((page - 1) * page_size);
    }

    let options = {
      attributes: ['external_id', 'name', 'email', 'status'],      
      offset: offset,
      limit: page_size,
      include: [ 
        {
          model: db.website,
          required: false,
          attributes: ['external_id', 'status', 'size', 'domainname'],
          as: 'websites',
          through: {
            attributes: []
          }
        }
      ]
    };

    if(role){
      options['include'].push({
        model: db.role,
        where: {role: {[Op.like]:role}}
      })
    } else {
      options['include'].push({
        model: db.role
      })
    }

    let query = { };

    if(name){
      query.name={[Op.like]: `%${name}%`}
      
    }

    if(email){
      query.email={[Op.like]: `%${email}%`}
    }

    if(status){
      query.status={[Op.like]: `%${status}%`}  
    }

    if(Object.keys(query).length>0){
      options =  {...options,...{where:query}};
    }
    
    const {
      count,
      rows
    } = await db.user.findAndCountAll(options);

    let promises = rows.map(response.listAccountViewModel);
    const results = await Promise.all(promises)
    res.send(await response.pagination(count, results, page))
  } catch (err) {
    console.log('err', err)
    res.status(response.getStatusCode(err)).send(response.error(err));
  }

}

// delete user details
async function deleteUser(req, res) {
  try {
    const userDetail = req.body;
    const { userId } = req.params;
    if (!userId) {
      throw { status: 422, message: 'Id is required' }
    }

    if (req && req.user && req.user.dataValues.external_id == userId) {
      throw { status: 422, message: 'You cannot delete yourself' }
    }

    const deleteCount = await db.user.destroy({ where: { external_id: userId } })
    res.status(deleteCount > 0 ? 204 : 404).send();
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }

}

async function createUser(req, res) {
  const user = req.body;
  const salt = bcrypt.genSaltSync(config.bcrypt.saltRounds);

  if (user.password) {
    user.password = bcrypt.hashSync(String(user.password), salt);
  }

  try {
    const existsUser = await db.user.findOne({ where: { email: user.email } });
    if (existsUser) {
      throw { status: 422, errors: { message: 'User Already Exists' } }
    }

    user.external_id = 0;
    await validateAndSetUserRole(user);

    let savedUser = await db.user.create(user);
    await setUserWebsites(user.websites, savedUser);
    res.send(await response.accountViewModel(savedUser));
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

async function updateUser(req, res) {
  try {
    const {userId} = req.params;
    if (!userId) {
      throw {status: 422, errors: {message: 'Id is required'}}
    }

    const user = await db.user.findOne({where: {external_id: userId}})
    if (!user) {
      throw {status: 422, errors: {message: 'User is not found'}}
    }

    const userDetail = req.body;
    /* Check user role */
    if (req.user.external_id == userId && userDetail.roleId != user.roleId) {
      throw {status: 422, message: 'You cannot change role'}
    }

    /* Check user email */
    if (userDetail.email && userDetail.email != user.email) {
      throw {status: 422, message: 'You cannot change email'}
    }

    if (userDetail.password) {
      const salt = bcrypt.genSaltSync(config.bcrypt.saltRounds);
      const hash = bcrypt.hashSync(String(userDetail.password), salt);
      userDetail.password = hash;
    } else {
      userDetail.password = user.password
    }
    userDetail.roleId = (await db.role.findOne({where: {role: userDetail.role}})).id;
    const savedUser = await user.update(userDetail, {where: {id: user.id}})
    if (!savedUser) {
      throw {status: 422, errors: {message: 'Some error occurred while updating the user.'}}
    }

    await setUserWebsites(userDetail.websites, savedUser);
    res.send(await response.accountViewModel(savedUser));
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

async function validateAndSetUserRole(user) {
  let role = await db.role.findOne({ where: { role: user.role } });

  if (role && role.id) {
    user.roleId = role.id;
  } else {
    throw { status: 422, errors: { message: 'Invalid role' } }
  }
}

async function setUserWebsites(websiteExternalIds, user) {
  if (typeof websiteExternalIds == 'array') {
    return;
  }

  if (websiteExternalIds.length == 0) {
    await user.removeWebsites()
    user.websites = [];
    return;
  }

  let validSites = await db.website.findAll({
    where: {external_id: websiteExternalIds},
    attributes: ['id', 'domainname', 'external_id']
  });
  let siteIds = validSites.map((o) => o.id);
  await user.setWebsites(siteIds);
  user.websites = validSites;
}