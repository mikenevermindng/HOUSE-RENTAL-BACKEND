const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
	content: {
		type: String,
		require: true
	},
	senderId: {
		type: mongoose.Schema.Types.ObjectId,
		require: true
	},
	recieverIds: {
		type: mongoose.Schema.Types.ObjectId,
		require: true
	},
	payload: {
		type: {}
	}
});

module.exports = mongoose.model('notification', notificationSchema);
