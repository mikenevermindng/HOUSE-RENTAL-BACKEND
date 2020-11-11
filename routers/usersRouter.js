const router = require('express').Router();
const controller = require('../controller/usersController');

router.post('/login', controller.login);

router.post('/register', controller.register);

router.delete('/:userId', controller.deleteUser);

router.put('/:userId', controller.updateAccount);

module.exports = router