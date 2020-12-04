const { secret } = require('config.json');
const jwt_decode = require('jwt-decode');
const jwt = require('jsonwebtoken');
const Role = require('../middleware/role');

function authorize(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log(decoded);

    if(decoded.payload.role === Role.Owner){
        next();
    }
    return res.status(400).json({
        message: "error role",
    })
}

module.exports = authorize;