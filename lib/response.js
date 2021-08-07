module.exports = {
  success,
  error,
  pagination,
  listAccountViewModel,
  accountViewModel,
  websiteViewModel,
  getStatusCode,
  productViewModel,
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
    products: website.products,
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

  if (['SequelizeValidationError', 'SequelizeUniqueConstraintError'].indexOf(err.name) > -1) {
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

function getStatusCode(err) {
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
    return statusCode
  }
}

function productData(data) {
  return {
    product_group: data.productGroupId,
    name: data.name,
    short_description: data.short_description,
    description: data.description,
    sku: data.sku,
    buy_price: data.buy_price,
    recommended_retail_price: data.recommended_retail_price,
    active: data.active,
    category: data.category,
    sub_category: data.sub_category,
    supplier: data.supplier,
    brand: data.brand,
    url: data.url,
    images: data.images,
    uid:data.external_id
  };
}

function productViewModel(data) {
  return {
    product_group: data.product_group,
    name: data.name,
    short_description: data.short_description,
    description: data.description,
    sku: data.sku,
    buy_price: data.buy_price,
    recommended_retail_price: data.recommended_retail_price,
    active: data.active,
    category: data.category,
    sub_category: data.sub_category,
    supplier: data.supplier,
    brand: data.brand,
    url: data.url,
    images: data.images
  };
}


function productGroupViewModel(data) {
  return {
    uid: data.external_id,
    name: data.name
  };
}

function productGroupData(data) {
  return {
    uid: data.external_id,
    name: data.name
  };
}

function productWebsiteData(data) {
  return {
    uid: data.external_id,
    name: data.name,
    short_description: data.short_description,
    description: data.description,
    price: data.price,
    active: data.active,
    language: data.language,
    brand: data.brand,
    category: data.category,
    sub_category: data.sub_category
  };
}