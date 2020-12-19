const router = require('express').Router();
const controller = require('../controller/usersController');
const { userRegisterValidation, loginValidation } = require('../middleware/authenticationValidation')
const { verifyToken, isOwner, isAdmin } = require('../middleware/authenticationVerification')

router.post('/login', loginValidation, controller.login);

router.post('/register', userRegisterValidation, controller.register);

router.delete('/:userId', verifyToken, isAdmin, controller.deleteUser);

router.put('/:userId', verifyToken, controller.updateAccount);

router.get('/', verifyToken, isAdmin, controller.getAllUser);

router.get('/:userId', verifyToken, isAdmin, controller.getUserById);

module.exports = router