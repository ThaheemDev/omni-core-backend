const {getWebsitesByUID} =  require('../lib/utility');

module.exports = {
  success,
  error,
  pagination,
  listAccountViewModel,
  accountViewModel,
  websiteViewModel,
  getStatusCode
}

function success(message, data) {
  return {
    status: 1,
    message: message,
    data: data
  }
}

function pagination(total, data, currentPage) {
  return {
    results: data,
    total: total,
    page: currentPage
  }
}

async function listAccountViewModel(account) {
  let websites = (account.dataValues && account.dataValues.websites)?account.dataValues.websites.split(';'):[];
  return {
    uid: account.external_id,
    name: account.name,
    websites: (websites && websites.length>0)?(await getWebsitesByUID([['external_id','uid'], 'domainname'],websites)):[],
    status: account.status,
    role: account.role.role
  }
}

async function accountViewModel(account) {
  return {
    uid: account.external_id,
    name: account.name,
    email: account.email,
    websites: (await getWebsitesByUID([['external_id','uid'], 'domainname'],account.websites)),
    status: account.status,
    role: (await account.getRole()).role
  }
}

function websiteViewModel(website) {
  let w = {
    uid: website.external_id,
    domainname: website.domainname,
    products: 0, // TODO : remap when products are added to website model
    status: website.status,
    size: website.size
  }
  return w;
}


function error(err) {
  console.log('err', err.name)

  if (!err) {
    return [{
      code: 422,
      message: 'something went wrong, Please try again later'
    }]
  }

  if (['SequelizeValidationError','SequelizeUniqueConstraintError'].indexOf(err.name) > -1) {
    let errObj = [];
    err.errors.map(e => {
      errObj.push({
        code: 422,
        message: e.message
      })
    });
    return errObj;
  } else if (err.errors && Object.keys(err.errors).length > 0) {
    let errObj = [];

    for (let e in err.errors) {
      errObj.push({
        code: 422,
        message: err.errors[e]
      })
    }

    return errObj;
  } else {
    let statusCode = 422;
    let message = 'something went wrong, Please try again later';

    if (err.code) {
      statusCode = err.code;
    }
    if (err.status) {
      statusCode = err.status;
    }
    if (err.message) {
      message = err.message;
    }

    return [{
      code: statusCode,
      message: message
    }]

  }

}



function getStatusCode(err){

  if (!err) {
    return 422;
  }

  if (err.name == 'SequelizeValidationError') {
    return 422;
  } else {
    let statusCode = 422;
    if (err.code) {
      statusCode = err.code;
    }
    if (err.status) {
      statusCode = err.status;
    }
    if (err.message) {
      message = err.message;
    }
    return statusCode
  }
}