const router = require('express').Router();
const controller = require('../controller/ownerController');
const { ownerRegisterValidation, loginValidation } = require('../middleware/authenticationValidation')
const { verifyToken, isOwner, isAdmin } = require('../middleware/authenticationVerification')

router.post('/login', loginValidation, controller.login);

router.post('/register', ownerRegisterValidation, controller.register);

router.delete('/:ownerId', controller.deleteOwner);

router.put('/:ownerId', controller.updateAccount);

router.get('/', controller.getAllOwner);

router.get('/:ownerId', controller.getOwnerById);

module.exports = router