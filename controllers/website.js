const db = require("../models"); // models path depend on your structure

// create website detail
const create = async (req, res, next) => {
    try {
        const websiteData = req.body;
        await db.website.create(websiteData)
        res.send({
            message: 'website create successfully'
        })
    } catch(e) {
        res.status(500).send({
            message:
                e.message || "Some error occurred while create website."
        });
    }
}

// update website detail
const update = async (req, res, next) => {
    try {
        const websiteData = req.body;
        await db.website.update(websiteData, { where: { id: websiteData.id } })
        res.send({
            message: 'website update successfully'
        })
    } catch(e) {
        res.status(500).send({
            message:
                e.message || "Some error occurred while update website."
        });
    }
}

// get all website details
const getAll = async (req, res, next) => {
    try {
        const websites = await db.website.findAll()
        res.send(websites)
    } catch (e) {
        res.status(500).send({
            message:
                e.message || "Some error occurred while get websites."
        });
    }
}

// delete website details
const deletes = async (req, res, next) => {
    try {
        const id = req.query.id;
        const website = await db.website.destroy({where: {id: id}})
        res.send({
            message: 'delete website successfully'
        })
    } catch(e) {
        res.status(500).send({
            message:
                e.message || "Some error occurred while delete website."
        });
    }
    
}

module.exports = {
    create,
    getAll,
    update,
    deletes
}