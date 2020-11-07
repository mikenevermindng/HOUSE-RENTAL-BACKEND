const route = require('express').Router();
const controller = require('../controller/ownerController');

route.post('/login', controller.login);

route.post('/register', controller.register);

route.delete('/:ownerId', controller.deleteOwner);