const jwt = require('jsonwebtoken');
const { ROLE } = require('../Constants/roleConstant')


const verifyToken = (req, res, next) => {
    try {
        const { authorization } = req.headers
        if (!authorization) {
            return res.status(401).json({
                message: 'Auth failed',
            })
        }
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.userData = decoded;
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: 'Auth failed',
            error: error
        });
    }
}

const isOwner = (req, res, next) => {
    if (req.userData.role === ROLE.OWNER) {
        next()
    } else {
        return res.status(400).json({
            message: 'Access limited',
        });
    }
}

const isAdmin = (req, res, next) => {
    if (req.userData.role === ROLE.ADMIN) {
        next()
    } else {
        return res.status(400).json({
            message: 'Access limited',
        });
    }
}

const isUser = (req, res, next) => {
    if (req.userData.role === ROLE.USER) {
        next()
    } else {
        return res.status(400).json({
            message: 'Access limited',
        });
    }
}

const isOwnerOrAdmin = (req, res, next) => {
    if (req.userData.role === ROLE.USER || req.userData.role === ROLE.ADMIN) {
        req.role = req.userData.role
        next()
    } else {
        return res.status(400).json({
            message: 'Access limited',
        });
    }
}

module.exports = {
    verifyToken, isOwner, isAdmin, isUser, isOwnerOrAdmin
}