const db = require("../models");

module.exports = {
  getWebsitesByUID,
  getValidPageSize
}

async function getWebsitesByUID(attributes,externalId){
  let websiteArr = await db.website.findAll({
      attributes: attributes,
      where: {'external_id': externalId },
      raw : true
    });
    return websiteArr; 
}

function getValidPageSize(value) {
  if ([10, 20, 50].includes(value)) {
    return value;
  }
  return 10;
}
