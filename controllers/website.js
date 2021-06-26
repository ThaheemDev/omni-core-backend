const db = require("../models"); // models path depend on your structure
const response = require('../lib/response');

// create website detail
const create = async (req, res, next) => {
    try {
        const websiteData = req.body;
        let data = await db.website.create(websiteData)

        let dataObj = data.dataValues;
        delete dataObj.id;
        delete dataObj.createdAt;
        delete dataObj.updatedAt;
        res.send(response.success('Website has been created successfully',dataObj))
        
    } catch(err) {
        console.log('err', err)
        res.status(err.status || 422).send(response.error(err.errors));       
    }
}

// update website detail
const update = async (req, res, next) => {
    try {
        const websiteData = req.body;
        const {websiteId} = req.params;

        if(!websiteId){
            throw {status:422, errors:{message:'Id is required'}}
        }
        await db.website.update(websiteData, { where: { external_id: websiteId } })
       
        res.send(response.success('Website has been updated successfully',{}))
    } catch(err) {
        res.status(err.status || 422).send(response.error(err.errors)); 
    }
}

// get all website details
const getAll = async (req, res, next) => {

    let {page,page_size}  = req.query;
    page = Number(page);
    page_size = Number(page_size);
    try {
        // const websites = await db.website.findAll({attributes: ['external_id', 'status','size','domainname']});    
        let offset = 0;
        if(page > 1){
            offset = ((page-1)*page_size);
        }

        const { count, rows }  = await db.website.findAndCountAll({ attributes: ['external_id', 'status','size','domainname'], offset: offset, limit: page_size }
            ); 
            
        let next  = ((page*page_size)<count)?true:false;
           
        res.send(response.pagination(count,rows,next))
    } catch (err) {
        res.status(err.status || 422).send(response.error(err.errors)); 
    }
}

// delete website details
const deletes = async (req, res, next) => {
    try {
        const {websiteId} = req.params;
        if(!websiteId){
            throw {status:422, errors:{message:'Id is required'}}
        }

        const website = await db.website.destroy({where: {external_id: websiteId}})
    
        if(website){
            res.send(response.success('Website has been deleted successfully',{}))
        } else {
            throw {status:422, errors:{message:'Website is not found'}}
        }
     
        
    } catch(err) {
        res.status(err.status || 422).send(response.error(err.errors)); 
    }
    
}

module.exports = {
    create,
    getAll,
    update,
    deletes
}