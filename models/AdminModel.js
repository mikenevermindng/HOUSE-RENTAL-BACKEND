const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    userName: {
        type: String,
        default: 'admin'
    },
    password: {
        type: String,
        default: 'admin',
    }
})

module.exports = mongoose.model('admin', adminSchema);