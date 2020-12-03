const router = require('express').Router();
const controller = require('../controller/usersController');
const verify = require('../middleware/verify');

router.post('/login', verify.loginVerify , controller.login);

router.post('/register', verify.registerVerify, controller.register);

router.delete('/:userId', controller.deleteUser);

router.put('/:userId', controller.updateAccount);

router.get('/', controller.getAllUser);

router.get('/:userId', controller.getUserById);

module.exports = router