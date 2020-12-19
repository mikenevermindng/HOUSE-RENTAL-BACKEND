const mongoose = require('mongoose')

const searchingRecordModel = mongoose.Schema({
    city: String,
    district: String,
    subDistrict: String,
    rangePrice: [Number],
    requestTime: {
        type: Date,
        default: Date.now()
    },
    numberOfroom: Number,
    area: Number,
})

module.exports = mongoose.model('searching_record', searchingRecordModel)