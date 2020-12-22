const SearchingRecord = require('../models/SearchingRecordModel')
const _ = require('lodash')

module.exports.saveRequest = async (req, res, next) => {
    try {
        if (_.isEmpty({ ...req.body })) {
            return next()
        }
        const newRequest = new SearchingRecord({ ...req.body })
        await newRequest.save()
        next()
    } catch (error) {
        console.log(error)
        next()
    }
}