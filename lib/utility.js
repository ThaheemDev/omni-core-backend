const db = require("../models");

module.exports = {
  getWebsitesByUID
}

async function getWebsitesByUID(attributes,externalId){

  let websiteArr = await db.website.findAll({
      attributes: attributes,
      where: {'external_id': externalId },
      raw : true
    });
    return websiteArr; 
}