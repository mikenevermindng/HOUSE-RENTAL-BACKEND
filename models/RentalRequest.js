const mongoose = require('mongoose')

const RentalRequest = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'owner',
        required: true
    },
    posterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accommodation_post',
        required: true
    },
    requiredAt: {
        type: Date,
        default: Date.now()
    },
    numberOfPeople: {
        type: Number,
        default: 1
    }
})

module.exports = mongoose.model('rental_requests', RentalRequest)