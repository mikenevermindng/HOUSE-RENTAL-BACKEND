const route = require('express').Router()
const controller = require('../controller/rentalRequestController')

const { verifyToken, isOwner, isAdmin, isUser } = require('../middleware/authenticationVerification')

route.get('/', verifyToken, isAdmin, controller.getAllRequest)

route.get('/ownerRequest', verifyToken, isOwner, controller.getRequestToOwner)

route.post('/', verifyToken, isUser, controller.generateRentalRequest)

route.delete('/:rentalRequestId', verifyToken, isOwner, controller.deleteRentalRequest)

module.exports = route