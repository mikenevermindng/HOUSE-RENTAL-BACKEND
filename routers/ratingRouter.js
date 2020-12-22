const route = require('express').Router();
const controller = require('../controller/ratingController');
const { verifyToken, isOwner, isAdmin, isUser } = require('../middleware/authenticationVerification')

route.patch('/like/:ratingId', verifyToken, isUser, controller.likeHandler);

route.patch('/unlike/:ratingId', verifyToken, isUser, controller.unlikeHandler)

route.patch('/visit/:ratingId', controller.visitHandler)

route.patch('/:ratingId', verifyToken, isUser, controller.ratingHandler)

route.patch('/approved/:ratingId', verifyToken, isAdmin, controller.approvedRatingComment)

route.delete('/:ratingId', verifyToken, isAdmin, controller.deleteRatingComment)

module.exports = route;
