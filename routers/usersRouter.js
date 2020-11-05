const route = require('express').Router();
const controller = require('../controller/usersController');

route.post('/login', controller.login);

route.post('/register', controller.register);

route.delete('/:userId', controller.deleteUser);

