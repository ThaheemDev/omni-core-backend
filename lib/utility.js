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

// TODO: this is really not needed. Many-to-many assocs are supported out-of-the-box
// TODO: See https://sequelize.org/master/manual/assocs.html#many-to-many-relationships and remove this please.
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
   await Promise.all(websiteArr.map(async (item) => await addWebsite(userId, Number(item))));
   return true;
}

async function deleteUserWebsiteAccociation(userId){
  let userDeleted  = await db.sequelize.models.userwebsites.destroy({ where: { userId: userId } });
  return userDeleted;
}

async function updateUserWebsitesAccociation(userId,websiteArr){
  await deleteUserWebsiteAccociation(userId);
  await addUserWebsitesAccociation(userId,websiteArr)
  return true;
}
