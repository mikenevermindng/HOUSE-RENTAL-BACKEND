const SearchingRecord = require('../models/SearchingRecordModel')
const _ = require('lodash')

module.exports.saveRequest = async (req, res, next) => {
    try {
        const { filterOption } = req.body
        if (_.isEmpty(filterOption)) {
            return next()
        }
        const newRequest = new SearchingRecord({ ...filterOption })
        await newRequest.save()
        next()
    } catch (error) {
        console.log(error)
        next()
    }
}