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

// create Product detail
async function create(req, res, next) {
  try {
    const productData = req.body;
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
    console.log("");
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

// update Product detail
async function update(req, res, next) {
  try {
    const productData = req.body;
    const {sku} = req.params;

    if (!sku) {
      throw {status: 422, errors: {message: 'Sku is required'}}
    }

    let product = await db.product.findOne({where: {sku: sku}});
    if (!product) {
      return res.status(404).send();
    }    
    let productGroup={}; 
    if(productData.product_group){
     let checkProductGroup = await db.product_group.findOne({where: {external_id: productData.product_group}});
      if(!checkProductGroup){
        throw {status: 422, errors: {message: 'Invalid product group'}}
      }
      productData.productGroupId = checkProductGroup.id;
      productGroup['name'] = checkProductGroup.name;
      productGroup['uid'] = checkProductGroup.external_id;
    }
    let result = await product.update(productData,  {where: {external_id: sku}});
    result.product_group = productGroup;
    res.send(response.productViewModel(result));
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

// get all product details
async function getAll(req, res, next) {
  let {page, page_size, sku, name, supplier, sub_category, product_group, category, sort} = req.query;
  page = Number(page) || 1;
  page_size = getValidPageSize(page_size);
  try {
  
    let offset = 0;
    if (page > 1) {
      offset = ((page - 1) * page_size);
    }

    let options = {
      attributes: ['sku', 'name', 'recommended_retail_price','category','sub_category','supplier','supplier','brand','url','active','images','short_description','description'],
      offset: offset,
      limit: page_size,
      include:[{
        model: db.product_group,
        attributes: [['external_id','uid'], 'name'],
        required: true
      }]
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

    if(sub_category){
      query.sub_category={[Op.like]: `%${sub_category}%`}  
    }

    if(category){
      query.category={[Op.like]: `%${category}%`} 
    }

    if(product_group){
      options.include = [{
        model: db.product_group,
        required: true,
        attributes: [['external_id','uid'], 'name'],
        where: {
          name: {
            [Op.like]: `%{product_group}%`
          }
        }
      }];
    }

    if(Object.keys(query).length>0){
      options =  {...options,...{where:query}};
    }
    const {count, rows} = await db.product.findAndCountAll(options);    
    res.send(response.pagination(count, rows, page))
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

// get single product details
async function getDetails(req, res, next) {   
    
    try {    
      const {sku} = req.params;
      if (!sku) {
        throw {status: 422, errors: {message: 'Sku is required'}}
      }
      let product = await db.product.findOne({ 
        attributes: ['sku', 'name', 'recommended_retail_price','category','sub_category','supplier','brand','url','active','images','short_description','description'],
        where: {sku: sku},
        include:[{
          model: db.product_group,
          attributes: [['external_id','uid'], 'name'],
          required: true
        }]
      });
      res.send(response.productViewModel(product));
    } catch (err) {
      res.status(response.getStatusCode(err)).send(response.error(err));
    }
  }

// delete product details
async function deletes(req, res, next) {
  try {
    const {sku} = req.params;
    if (!sku) {
      throw {status: 422, errors: {message: 'Sku is required'}}
    }

    const productResp = await db.product.destroy({where: {sku: sku}});
    if (productResp) {
      res.send(response.success('Product has been deleted successfully', {}))
    } else {
      throw {status: 422, errors: {message: 'Product is not found'}}
    }
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}