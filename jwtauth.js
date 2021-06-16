const config = require('./config/config')
var jwt = require('jsonwebtoken');

const jwtCheck = (req, res, next) => {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
        try {
            var decoded = jwt.decode(token, config.jwt.secrate);          
        
            if(decoded.id) {
                next()
            } else {
                res.status(403).send({
                    message: 'invalid session'
                })
            }

        } catch (err) {
            res.status(403).send({
                message: 'invalid session'
            })
            return false
        }
    } else {
        next();
    }
}
module.exports = {
    jwtCheck
}