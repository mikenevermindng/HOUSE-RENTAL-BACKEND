const router = require('express').Router();
const controller = require('../controller/ownerController');
const verify = require('../middleware/verify');

router.post('/login', verify.loginVerify , controller.login);

router.post('/register', verify.registerVerify , controller.register);

router.delete('/:ownerId', controller.deleteOwner);

router.put('/:ownerId', controller.updateAccount);

router.get('/', controller.getAllOwner);

router.get('/:ownerId', controller.getOwnerById);

module.exports = router