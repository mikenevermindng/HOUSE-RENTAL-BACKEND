const {registerValidation, loginValidation} = require('../middleware/validation');
const jwt = require('jsonwebtoken');

module.exports.registerVerify = (req, res, next) => {
    try {
        // LET'S VALIDATE DATE BEFORE WE MAKE A USER
        const {error} = registerValidation(req.body);
        if(error) return res.status(422).json({
        message: 'Validation error.',
        error
        });
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ 
            message: "error",
            detail: error });
    }
    
};

module.exports.loginVerify = (req, res, next) => {
    try {
        // LET'S VALIDATE DATE BEFORE WE MAKE A USER
        const {error} = loginValidation(req.body);
        if(error) return res.status(422).json({
            message: 'Validation error.',
            error: error
        });
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ 
            message: "error",
            detail: error });
    }
    
}

