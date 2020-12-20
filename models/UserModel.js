const mongoose = require('mongoose');

const renterSchema = mongoose.Schema({
	username: {
		type: String,
		require: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	phoneNumber: {
		type: String,
		required: true,
		match: /^[0-9]{10}$/
	},
	password: {
		type: String,
		required: true,
		min: 8
	}
});

module.exports = mongoose.model('User', renterSchema);
