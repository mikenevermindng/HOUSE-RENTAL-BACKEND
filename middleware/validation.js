// VALIDATION
const Joi = require('joi');
const { model } = require('../models/UserModel');


// Register Validation
const registerValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
      
        lastName: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
      
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(8).required(),      
      
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),

        phoneNumber: Joi.number().max(12),

        citizenId: Joi.string().min(9).max(12).required(),
        
        address: Joi.string().min(3),

        city: Joi.string().min(3).max(30)

      })

    return schema.validate(data);
}

// Login Validation
const loginValidation = (data) => {
    const schema = Joi.object({
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
      
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
    });
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;