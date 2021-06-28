const db = require("../models"); // models path depend on your structure
const response = require('../lib/response');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  create,
  getAll,
  update,
  deletes
}

// create website detail
async function create(req, res, next) {
  try {
    const websiteData = req.body;
    websiteData.external_id = uuidv4()
    let data = await db.website.create(websiteData)

    let dataObj = data.dataValues;
    delete dataObj.id;
    delete dataObj.createdAt;
    delete dataObj.updatedAt;
    res.send(response.success('Website has been created successfully', dataObj))

  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

// update website detail
async function update(req, res, next) {
  try {
    const websiteData = req.body;
    const {websiteId} = req.params;

    if (!websiteId) {
      throw {status: 422, errors: {message: 'Id is required'}}
    }
    await db.website.update(websiteData, {where: {external_id: websiteId}})

    res.send(response.success('Website has been updated successfully', {}))
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

// get all website details
async function getAll(req, res, next) {
  let {page, page_size} = req.query;
  page = Number(page) || 1;
  page_size = getValidPageSize(page_size);
  try {
    // const websites = await db.website.findAll({attributes: ['external_id', 'status','size','domainname']});
    let offset = 0;
    if (page > 1) {
      offset = ((page - 1) * page_size);
    }

    const {count, rows} = await db.website.findAndCountAll({
        attributes: ['external_id', 'status', 'size', 'domainname'],
        offset: offset,
        limit: page_size
      }
    );

    res.send(response.pagination(count, rows, page))
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

// delete website details
async function deletes(req, res, next) {
  try {
    const {websiteId} = req.params;
    if (!websiteId) {
      throw {status: 422, errors: {message: 'Id is required'}}
    }

    const website = await db.website.destroy({where: {external_id: websiteId}})

    if (website) {
      res.send(response.success('Website has been deleted successfully', {}))
    } else {
      throw {status: 422, errors: {message: 'Website is not found'}}
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
