const db = require("../models"); // models path depend on your structure
const response = require('../lib/response');

// create website detail
const create = async (req, res, next) => {
    try {
        const websiteData = req.body;
        await db.website.create(websiteData)
        res.send(response.success('Website has been created successfully',{}))
        
    } catch(err) {
        res.status(err.status || 422).send(response.error(err.errors));       
    }
}

// update website detail
const update = async (req, res, next) => {
    try {
        const websiteData = req.body;

        if(!websiteData.id){
            throw {status:422, errors:{message:'Id is required'}}
        }
        await db.website.update(websiteData, { where: { id: websiteData.id } })
       
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

        if(!req.body.id){
            throw {status:422, errors:{message:'Id is required'}}
        }

        const id = req.body.id;
        const website = await db.website.destroy({where: {id: id}})
        console.log('website', website)

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