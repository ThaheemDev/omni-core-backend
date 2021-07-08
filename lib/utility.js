const db = require("../models");

module.exports = {
  getWebsitesByUID,
  addUserWebsitesAccociation,
  updateUserWebsitesAccociation
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

async function addUserWebsitesAccociation(userId, websiteArr){
  return await Promise.all(websiteArr.map(async (item) => await addWebsite(userId, Number(item))));    
}

async function deleteUserWebsiteAccociation(userId){
  let userDeleted  = await db.sequelize.models.userwebsite.destroy({ where: { userId: userId } });
  return userDeleted;   
}

async function updateUserWebsitesAccociation(userId,websiteArr){
  await deleteUserWebsiteAccociation(userId);
  await addUserWebsitesAccociation(userId,websiteArr)
  return true;
}