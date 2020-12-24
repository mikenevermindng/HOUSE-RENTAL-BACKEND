const mongoose = require('mongoose');

const posterReportSchema = mongoose.Schema({
    posterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accommodation_post",
        required: true
    },
    ratingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rating",
        required: true
    },
    userReportedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    timeReported: {
        type: Date,
        default: Date.now()
    },
    reason: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('report', posterReportSchema);