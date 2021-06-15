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