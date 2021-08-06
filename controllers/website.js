const db = require("../models"); // models path depend on your structure
const response = require('../lib/response');
const {getValidPageSize} = require("../lib/utility");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

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
    websiteData.external_id = 0;
    let data = await db.website.create(websiteData);
    data.products = 0;
    res.send(response.websiteViewModel(data));
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

    let website = await db.website.findOne({where: {external_id: websiteId}});
    if (!website) {
      return res.status(404).send();
    }

    let result = await website.update(websiteData, {where: {external_id: websiteId}});

    const productWebsiteCount = await db.product_website.count({
      where: {websiteId:website.id}     
    });
    result.products = productWebsiteCount;
    res.send(response.websiteViewModel(result));
  } catch (err) {
    res.status(response.getStatusCode(err)).send(response.error(err));
  }
}

// get all website details
async function getAll(req, res, next) {
  let {page, page_size, name, status,product} = req.query;
  page = Number(page) || 1;
  page_size = getValidPageSize(page_size);
  try {
  
    let offset = 0;
    if (page > 1) {
      offset = ((page - 1) * page_size);
    }


    let options = {
      attributes: [['external_id','uid'], 'status', 'size', 'domainname','id'],
      offset: offset,
      limit: page_size
    };

    let query = { };
    if(name){
      query.domainname={[Op.like]: `%${name}%`}  ;
    }

    if(status){
      query.status={[Op.like]: `%${status}%`}     
    }

    if(product){
     let productQuery = "SELECT `websiteId` from `product_websites` WHERE `name` LIKE '%"+product+"%'";
     query.ID={ [Op.in]: Sequelize.literal(`(${productQuery})`)}   
    }

    if(Object.keys(query).length>0){
      options =  {...options,...{where:query}};
    }
   

    if (req && req.user) {
      let userRole = await req.user.getRole();
      if(userRole.role  != 'ADMIN'){

        let count = await req.user.countWebsites();
        let currentUserWebsites = await req.user.getWebsites(options);

        let rowsMapping  = await Promise.all(currentUserWebsites.map(async (item) => {
          const productWebsiteCount = await db.product_website.count({
            where: {websiteId:item.id}     
          });
          return  {uid:item.external_id,status:item.status,size:item.size,domainname:item.domainname,products:productWebsiteCount}
        }));

        res.send(response.pagination(count, rowsMapping, page));
        return false;
         
      }
    } 

    let {count, rows} = await db.website.findAndCountAll(options);

    let rowsMapping  = await Promise.all(rows.map(async (item) => {
      const productWebsiteCount = await db.product_website.count({
        where: {websiteId:item.id}     
      });
      return  {uid:item.external_id,status:item.status,size:item.size,domainname:item.domainname,products:productWebsiteCount}
    }));
    res.send(response.pagination(count, rowsMapping, page))
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