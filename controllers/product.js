const db = require("../models"); // models path depend on your structure
const response = require('../lib/response');

module.exports = {
  create,
  getAll,
  update,
  deletes,
  getDetails
}

// create Product detail
async function create(req, res, next) {
  try {
    const productData = req.body;
    productData.external_id = 0;
    if(productData.product_group){
      let checkProductGroup = await db.product_group.findOne({where: {external_id: productData.product_group}});
      if(!checkProductGroup){
        throw {status: 422, errors: {message: 'Invalid product group'}}
      }
      productData.productGroupId = checkProductGroup.id;
    }
    let data = await db.product.create(productData);
    res.send(response.productData(data));
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

// update Product detail
async function update(req, res, next) {
  try {
    const productData = req.body;
    const {productId} = req.params;

    if (!productId) {
      throw {status: 422, errors: {message: 'Id is required'}}
    }

    let product = await db.product.findOne({where: {external_id: productId}});
    if (!product) {
      return res.status(404).send();
    }    
    if(productData.product_group){
      let checkProductGroup = await db.product_group.findOne({where: {external_id: productData.product_group}});
      if(!checkProductGroup){
        throw {status: 422, errors: {message: 'Invalid product group'}}
      }
      productData.productGroupId = checkProductGroup.id;
    }
    let result = await product.update(productData, {where: {external_id: productId}});
    res.send(response.prouctViewModel(result));
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

// get all product details
async function getAll(req, res, next) {
  let {page, page_size} = req.query;
  page = Number(page) || 1;
  page_size = getValidPageSize(page_size);
  try {
  
    let offset = 0;
    if (page > 1) {
      offset = ((page - 1) * page_size);
    }

    const {count, rows} = await db.product.findAndCountAll({
        attributes: [['external_id','uid'], 'sku', 'name', 'recommended_retail_price'],
        offset: offset,
        limit: page_size
      }
    );
    res.send(response.pagination(count, rows, page))
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

// get single product details
async function getDetails(req, res, next) {
    const {productId} = req.params;
    try {    
      let product = await db.product.findOne({where: {external_id: productId}});
      res.send(response.prouctViewModel(product));
    } catch (err) {
      res.status(response.getStatusCode(err)).send(response.error(err));
    }
  }

// delete product details
async function deletes(req, res, next) {
  try {
    const {productId} = req.params;
    if (!productId) {
      throw {status: 422, errors: {message: 'Id is required'}}
    }

    const website = await db.product.destroy({where: {external_id: productId}})

    if (website) {
      res.send(response.success('Product has been deleted successfully', {}))
    } else {
      throw {status: 422, errors: {message: 'Product is not found'}}
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
