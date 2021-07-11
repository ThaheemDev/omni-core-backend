const db = require("../models"); // models path depend on your structure
const bcrypt = require('bcrypt');
const config = require('../config/config')
const response = require('../lib/response');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = {
  getUsers,
  deleteUser,
  createUser,
  updateUser
}

// get all user details
async function getUsers(req, res) {
  try {
    let { page, page_size } = req.query;
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
      attributes: ['external_id', 'name', 'email', 'status'],
      offset: offset,
      limit: page_size,
      include: [

        db.role,
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
    }
    );

    let promises = rows.map(response.listAccountViewModel);
    const results = await Promise.all(promises)
    res.send(await response.pagination(count, results, page))
  } catch (err) {
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
    if (user.websites) {
      let validSites = await db.website.findAll({
        where: {external_id: user.websites},
        attributes: ['id', 'domainname', 'external_id']
      });
      let siteIds = validSites.map((o) => o.id);
      await savedUser.setWebsites(siteIds);
      savedUser.websites = validSites;
    }

    res.send(await response.accountViewModel(savedUser));
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

async function updateUser(req, res) {

  try {
    const userDetail = req.body;
    const { userId } = req.params;

    if (!userId) {
      throw { status: 422, errors: { message: 'Id is required' } }
    }


    const user = await db.user.findOne({ where: { external_id: userId } })

    if (user) {

      /* Check user role */
      if (req && req.user && req.user.dataValues.external_id == userId) {
        if (userDetail.roleId != user.roleId) {
          throw { status: 422, message: 'You cannot change role' }
        }
      }

      /* Check user email */
      if (userDetail.email && userDetail.email != user.email) {
        throw { status: 422, message: 'You cannot change email' }
      }

      if (userDetail.password) {
        const salt = bcrypt.genSaltSync(config.bcrypt.saltRounds);
        const hash = bcrypt.hashSync(String(userDetail.password), salt);
        userDetail.password = hash;
      } else {
        userDetail.password = user.password
      }
      userDetail.roleId = (await db.role.findOne({ where: { role: userDetail.role } })).id;
      const resdata = await user.update(userDetail, { where: { id: user.id } })
      let checkWebsites;
      if (userDetail.websites && typeof userDetail.websites == 'object') {

        checkWebsites = await db.website.findAll({ where: { external_id: userDetail.websites }, attributes: ['id',['external_id','uid']] });
        let getWebsitesID = checkWebsites.map((o) => o.id);

        await resdata.setWebsites(getWebsitesID);

        const getWebsitesUid = await Promise.all(checkWebsites.map(async (obj) => {
          await await delay(10);
          return {uid:obj.dataValues.uid};
        }));
        resdata.websites = getWebsitesUid;

      } else {
        resdata.websites = [];
      }

      if (resdata) {
        res.send(await response.accountViewModel(resdata));
      } else {
        throw { status: 422, errors: { message: 'Some error occurred while updating the user.' } }
      }
    } else {
      throw { status: 422, errors: { message: 'User is not found' } }

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

async function validateAndSetUserRole(user) {
  let role = await db.role.findOne({ where: { role: user.role } });

  if (role && role.id) {
    user.roleId = role.id;
  } else {
    throw { status: 422, errors: { message: 'Invalid role' } }
  }
}
