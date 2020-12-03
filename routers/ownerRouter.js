const router = require('express').Router();
const controller = require('../controller/ownerController');

router.post('/login', controller.login);

router.post('/register', controller.register);

router.delete('/:ownerId', controller.deleteOwner);

router.put('/:ownerId', controller.updateAccount);

router.get('/', controller.getAllOwner);

router.get('/:ownerId', controller.getOwnerById);

module.exports = router