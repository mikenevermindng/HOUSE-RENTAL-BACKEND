const router = require('express').Router();
const controller = require('../controller/ownerController');

router.post('/login', controller.login);

router.post('/register', controller.register);

router.delete('/:ownerId', controller.deleteOwner);

module.exports = router