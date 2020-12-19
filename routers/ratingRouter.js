const route = require('express').Router();
const controller = require('../controller/ratingController');

route.patch('/like/:ratingId', controller.likeHandler);

route.patch('/unlike/:ratingId', controller.unlikeHandler)

route.patch('/visit/:ratingId', controller.visitHandler)

route.patch('/:ratingId', controller.ratingHandler)

route.patch('/approved/:ratingId', controller.approvedRatingComment)

route.delete('/:ratingId', controller.deleteRatingComment)

module.exports = route;
