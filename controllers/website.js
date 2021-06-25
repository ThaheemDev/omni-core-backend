const db = require("../models"); // models path depend on your structure
const response = require('../lib/response');

// create website detail
const create = async (req, res, next) => {
    try {
        const websiteData = req.body;
        let data = await db.website.create(websiteData)

        let dataObj = data.dataValues;
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
        await db.website.update(websiteData, { where: { id: websiteId } })
       
        res.send(response.success('Website has been updated successfully',{}))
    } catch(err) {
        res.status(err.status || 422).send(response.error(err.errors)); 
    }
}

// get all website details
const getAll = async (req, res, next) => {
    try {
        const websites = await db.website.findAll()
    
        res.send(response.success('Websites listing',websites))
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

        const website = await db.website.destroy({where: {id: websiteId}})
    
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