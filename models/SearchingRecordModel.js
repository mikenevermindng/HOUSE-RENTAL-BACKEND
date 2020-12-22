const mongoose = require('mongoose')

const searchingRecordModel = mongoose.Schema({
    city: String,
    district: String,
    subDistrict: String,
    minPrice: Number,
    maxPrice: Number,
    typeOfAccommodation: String,
    requestTime: {
        type: Date,
        default: Date.now()
    },
    area: Number,
})

module.exports = mongoose.model('searching_record', searchingRecordModel)