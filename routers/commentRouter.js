const route = require('express').Router();
const controller = require('../controller/commentController');

route.get('/:commentId', controller.getComment);

route.post('/', controller.generateComment);

route.patch('/:commentId', controller.approvedComment);

route.delete('/:commentId', controller.deleteComment);

module.exports = route;
