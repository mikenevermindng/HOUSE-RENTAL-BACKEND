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
	password: {
		type: String,
		required: true,
		min: 8
	},
	follow: {
		type: [ mongoose.Schema.Types.ObjectId ]
	}
});

module.exports = mongoose.model('User', renterSchema);
