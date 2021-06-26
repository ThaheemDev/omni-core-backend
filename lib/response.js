module.exports.success = (message,data)=>{
    return {
        status:1,
        message:message,
        data:data
    }
}

module.exports.error = (errors)=>{
    return {
        status:2,
        error:errors
    }
}


module.exports.pagination = (total,data,nextResult)=>{
    return {
        results:data,
        total:total,
        next:nextResult
    }
}
