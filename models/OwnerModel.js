const mongoose = require('mongoose');

const ownerSchema = mongoose.Schema({
	firstName: {
		type: String,
		require: true
	},
	lastName: {
		type: String,
		require: true
	},
	citizenId: {
		type: Number,
		require: true,
		max: 12,
		min: 9
	},
	city: {
		type: String,
		require: true
	},
	address: {
		type: String,
		require: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	password: {
		type: String,
		required: true,
		min: 8
	},
	phoneNumber: {
		type: String,
		required: true,
		match: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
	}
});

module.exports = mongoose.model('owner', ownerSchema);
