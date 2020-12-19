const route = require('express').Router()
const controller = require('../controller/rentalRequestController')

route.get('/', controller.getAllRequest)

route.get('/:ownerId', controller.getRequestToOwner)

route.post('/', controller.generateRentalRequest)

route.delete('/:rentalRequestId', controller.deleteRentalRequest)

module.exports = route