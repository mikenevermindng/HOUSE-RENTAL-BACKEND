const route = require('express').Router();
const controller = require('../controller/notificationController');

route.get('/admin', controller.getNotificationToAdmin)

route.get('/:ownerId', controller.getNotificationToOwner)