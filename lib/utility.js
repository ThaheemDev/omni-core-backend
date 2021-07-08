const db = require("../models");

module.exports = {
  getWebsitesByUID,
  addWebsite
}

async function getWebsitesByUID(attributes,externalId){

  let websiteArr = await db.website.findAll({
      attributes: attributes,
      where: {'external_id': externalId },
      raw : true
    });
    return websiteArr; 
}


async function addWebsite(userId, websiteId){


      return db.website.findByPk(websiteId).then((website) => {
        if (!website) {
          console.log("Website not found!");
          return null;
        }
        
        db.sequelize.models.userwebsite.create({
          userId:userId,
          websiteId:websiteId
        })


      }).catch((err) => {
       return err;
      });
    
}