const db = require("../models"); // models path depend on your structure
const response = require('../lib/response');

module.exports = {
  create,
  getAll,
  update,
  deletes
}

// create product groups
async function create(req, res, next) {
  try {
    const productData = req.body;
    productData.external_id = 0;
    if(!productData.name){
      throw {status: 422, errors: {message: 'Name is required'}}
    }

    let data = await db.product_group.create(productData);
    console.log("data",data);
    res.send(response.productGroupData());
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

// update Product detail
async function update(req, res, next) {
  try {
    const productData = req.body;
    const {productGroupId} = req.params;

    if (!productGroupId) {
      throw {status: 422, errors: {message: 'Id is required'}}
    }

    let product = await db.product_group.findOne({where: {external_id: productGroupId}});
    if (!product) {
      return res.status(404).send();
    }

    let result = await product.update(productData, {where: {external_id: productGroupId}});
    res.send(response.productGroupViewModel());
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

// get all product groups
async function getAll(req, res, next) {
  let {page, page_size} = req.query;
  page = Number(page) || 1;
  page_size = getValidPageSize(page_size);
  try {
  
    let offset = 0;
    if (page > 1) {
      offset = ((page - 1) * page_size);
    }

    const {count, rows} = await db.product_group.findAndCountAll({
        attributes: [['external_id','uid'], 'name'],
        offset: offset,
        limit: page_size
      }
    );
    res.send(response.pagination(count, rows, page))
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

// delete product group
async function deletes(req, res, next) {
  try {
    const {productGroupId} = req.params;
    if (!productGroupId) {
      throw {status: 422, errors: {message: 'Id is required'}}
    }

    const website = await db.product_group.destroy({where: {external_id: productGroupId}})

    if (website) {
      res.send(response.success('Product group has been deleted successfully', {}))
    } else {
      throw {status: 422, errors: {message: 'Product group is not found'}}
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