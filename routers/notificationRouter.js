const route = require('express').Router();
const controller = require('../controller/notificationController');
const { verifyToken, isOwner, isAdmin } = require('../middleware/authenticationVerification')


route.get('/admin', verifyToken, isAdmin, controller.getNotificationToAdmin)

route.get('/:ownerId', verifyToken, isOwner, controller.getNotificationToOwner)