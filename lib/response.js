const {getWebsitesByUID} =  require('../lib/utility');

module.exports = {
  success,
  error,
  pagination,
  listAccountViewModel,
  accountViewModel,
  websiteViewModel,
  getStatusCode,
  prouctViewModel,
  productGroupData,
  productData,
  productGroupViewModel,
  productWebsiteData
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
  return {
    uid: account.external_id,
    name: account.name,
    websites: account.websites,
    status: account.status,
    role: account.role.role
  }
}

async function accountViewModel(account) {
  let formatSite = s => Object({uid: s.external_id, domainname: s.domainname})
  return {
    uid: account.external_id,
    name: account.name,
    email: account.email,
    websites: account.websites ? account.websites.map(formatSite) : [],
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

function productData() {
  let resp = {  
    "product_group": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Cell",
    "short_description": "Lorem ipsum dumy text",
    "description": "Lorem ipsum dumy text",
    "sku": "1553",
    "buy_price": 15,
    "recommended_retail_price": 10,
    "active": true,
    "category": "cat1",
    "sub_category": "subcat1",
    "supplier": "test",
    "brand": "test",
    "url": "http://google.com",
    "images": [
      "http://abc.com/user.png"
    ]
  }
  return resp;
}

function prouctViewModel() {
  let resp = {
      "uid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "product_group": {
      "uid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "GP1"
    },
    "name": "Cell",
    "short_description": "Lorem ipsum dumy text",
    "description": "Lorem ipsum dumy text",
    "sku": "1553",
    "buy_price": 15,
    "recommended_retail_price": 10,
    "active": true,
    "category": "cat1",
    "sub_category": "subcat1",
    "supplier": "test",
    "brand": "test",
    "url": "http://google.com",
    "images": [
      "http://abc.com/user.png"
    ]
  }
  return resp;
}


function productGroupViewModel() {
  let resp = {
    uid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    name: "Testing"
  }
  return resp;
}

function productGroupData() {
  let resp = {
    uid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    name: "Testing"
  }
  return resp;
}

function productWebsiteData() {
  let resp = {  
    "uid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Cell",
    "short_description": "Lorem ipsum dumy text",
    "description": "Lorem ipsum dumy text",
    "price": 15,
    "recommended_retail_price": 10,
    "active": true,
    "language": "en",
    "brand": "test",
    "category": "Category1",
    "sub_category": "Sub Category1"
  }
  return resp;
}