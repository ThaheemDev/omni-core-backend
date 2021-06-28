module.exports.success = (message,data)=>{
    return {
        status:1,
        message:message,
        data:data
    }
}

module.exports.pagination = (total,data,nextResult)=>{
    return {
        results:data,
        total:total,
        next:nextResult
    }
}



module.exports.error = (err)=>{
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
