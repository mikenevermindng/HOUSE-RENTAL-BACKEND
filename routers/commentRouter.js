const route = require('express').Router();
const controller = require('../controller/commentController');

route.get('/:commentId', controller.getComment);

route.get('/', controller.getAllComments)

route.get('/posterComment/:posterId', controller.getPosterCommnet)

route.get('/ratingComment/:ratingId', controller.getRatingComment)

route.post('/', controller.generateComment);

route.patch('/:commentId', controller.approvedComment);

route.delete('/:commentId', controller.deleteComment);

module.exports = route;
