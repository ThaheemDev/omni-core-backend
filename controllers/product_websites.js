const db = require("../models"); // models path depend on your structure
const response = require('../lib/response');
const {getValidPageSize} = require("../lib/utility");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = {
  create,
  getAll,
  update,
  deletes,
  getDetails
}

// TODO: add tests.

// create Product website detail
async function create(req, res, next) {
  try {
    const productRequestedData = req.body;
   
    console.log("productRequestedData",productRequestedData);
    /* Validate product id */
    const checkProduct = await db.product.findOne({where: {external_id: productRequestedData.product}})
    if (!checkProduct) {
      throw {status: 422, errors: {message: 'Product id is not valid.'}}
    }

    /* Validate website id */
    const checkWebsite = await db.website.findOne({where: {external_id: productRequestedData.website}})
    if (!checkWebsite) {
      throw {status: 422, errors: {message: 'Website id is not valid.'}}
    }

    productRequestedData.productId = checkProduct.id;
    productRequestedData.websiteId = checkWebsite.id;
    productRequestedData.external_id = 0;
    let data = await db.product_website.create(productRequestedData);
    res.send(response.productWebsiteData(data));
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

// update Product website detail
// TODO: productId & productId you added above should be read-only after creation. This method should not override them.
async function update(req, res, next) {
  try {
    const productData = req.body;
    const {productId} = req.params;

    if (!productId) {
      throw {status: 422, errors: {message: 'Id is required'}}
    }

    let product = await db.product_website.findOne({where: {external_id: productId}});
    if (!product) {
      return res.status(404).send();
    }


     /* Validate product id */
     const checkProduct = await db.product.findOne({where: {external_id: productData.product}})
     if (!checkProduct) {
       throw {status: 422, errors: {message: 'Product id is not valid.'}}
     }
 
     /* Validate website id */
     const checkWebsite = await db.website.findOne({where: {external_id: productData.website}})
     if (!checkWebsite) {
       throw {status: 422, errors: {message: 'Website id is not valid.'}}
     }

    let result = await db.product_website.update(productData, {where: {external_id: productId}});
    res.send(response.productWebsiteData(result));
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

// get all product website details
async function getAll(req, res, next) {
  let {page, page_size, sku, name,supplier, brand, description, category, sort} = req.query;
  page = Number(page) || 1;
  page_size = getValidPageSize(page_size);
  try {
    let offset = 0;
    if (page > 1) {
      offset = ((page - 1) * page_size);
    }

    let options = {
      attributes: [['external_id','uid'], 'name', 'price'],
      offset: offset,
      limit: page_size
    };

    if(sort){  
      options['order'] =  [
          [sort, 'ASC'],
      ]
    }    

    let query = { };

    if(name){
      query.name={[Op.like]: `%${name}%`}
    }

    if(sku){
      query.sku={[Op.like]: `%${sku}%`}
    }

    if(supplier){
      query.supplier={[Op.like]: `%${supplier}%`}   
    }

    if(brand){
      query.brand={[Op.like]: `%${brand}%`}   
    }

    if(description){
      query.description={[Op.like]: `%${description}%`}   
    }

    if(category){
      query.category={[Op.like]: `%${category}%`} 
    }


    if(Object.keys(query).length>0){
      options =  {...options,...{where:query}};
    }

    const {count, rows} = await db.product_website.findAndCountAll(options);
    res.send(response.pagination(count, rows, page))
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

// get single product website details
async function getDetails(req, res, next) {
    const {productId} = req.params;
    try {
    
    let product = await db.product_website.findOne({where: {external_id: productId}});
      res.send(response.productWebsiteData(product));
    } catch (err) {
      res.status(response.getStatusCode(err)).send(response.error(err));
    }
  }

// delete product website details
async function deletes(req, res, next) {
  try {
    const {productId} = req.params;
    if (!productId) {
      throw {status: 422, errors: {message: 'Id is required'}}
    }

    const website = await db.product_website.destroy({where: {external_id: productId}})

    if (website) {
      res.send(response.success('Product has been deleted successfully', {}))
    } else {
      throw {status: 422, errors: {message: 'Product is not found'}}
    }


  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }

}