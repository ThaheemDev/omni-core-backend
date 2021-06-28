module.exports = {
  success,
  error,
  pagination,
  listAccountViewModel,
  accountViewModel,
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

function listAccountViewModel(account) {
  return {
    uid: account.external_id,
    name: account.name,
    websites: [
      // TODO: replace by real values
      {
        "uid": "45b68dea-c7b8-11eb-959f-4362e0699be0",
        "domainname": "http://bing.com"
      }
    ],
    status: account.status,
    role: account.role.role
  }
}

async function accountViewModel(account) {
  return {
    uid: account.external_id,
    name: account.name,
    email: account.email,
    websites: [
      // TODO: replace by real values
      {
        "uid": "45b68dea-c7b8-11eb-959f-4362e0699be0",
        "domainname": "http://bing.com"
      }
    ],
    status: account.status,
    role: (await account.getRole()).role
  }
}

function websiteViewModel(website) {
  return {
    uid: website.external_id,
    domainname: website.domainname,
    products: 0, // TODO : remap when products are added to website model
    status: website.status,
    size: website.size
  }
}


function error (err) {
    if(!err){
        return [{
            code:422,
            message:'something went wrong, Please try again later'
        }]
    }

    if(err.name == 'SequelizeValidationError'){
        let errObj = [];
        err.errors.map(e => {
            errObj.push({
                    code:422,
                    message:e.message
            })
        });
        return errObj;
    } else {
        let statusCode = 422;
        let message = 'something went wrong, Please try again later';

        if(err.code){
            statusCode = err.code;
        }
        if(err.status){
            statusCode = err.status;
        }
        if(err.message){
            message = err.message;
        }

        return [{
            code:statusCode,
            message:message
        }]

    }

}



module.exports.getStatusCode = (err)=>{
    console.log('err', err)

    if(!err){
        return 422;
    }

    if(err.name == 'SequelizeValidationError'){
        return 422;
    } else {
        let statusCode = 422;
        if(err.code){
            statusCode = err.code;
        }
        if(err.status){
            statusCode = err.status;
        }
        if(err.message){
            message = err.message;
        }
        return statusCode
    }
}
