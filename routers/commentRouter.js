const route = require('express').Router();
const controller = require('../controller/commentController');
const { verifyToken, isOwner, isAdmin, isUser } = require('../middleware/authenticationVerification')

route.get('/:commentId', controller.getComment);

route.get('/', verifyToken, isAdmin, controller.getAllComments)

route.get('/posterComment/:posterId', controller.getPosterCommnet)

route.get('/ratingComment/:ratingId', controller.getRatingComment)

route.post('/', verifyToken, isUser, controller.generateComment);

route.patch('/:commentId', verifyToken, isAdmin, controller.approvedComment);

route.delete('/:commentId', verifyToken, isAdmin, controller.deleteComment);

module.exports = route;
