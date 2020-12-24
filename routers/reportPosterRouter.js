const route = require('express').Router()
const controller = require('../controller/posterReportController')
const { verifyToken, isOwner, isAdmin, isUser } = require('../middleware/authenticationVerification')

route.get('/', verifyToken, isAdmin, controller.getPosterReported)

route.post('/', verifyToken, isUser, controller.generatePosterReport)

route.delete('/:reportId', verifyToken, isAdmin, controller.deleteReport)

module.exports = route