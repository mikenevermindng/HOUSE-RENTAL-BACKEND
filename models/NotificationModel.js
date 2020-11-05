const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
	content: {
		type: String,
		require: true
	},
	recieverIds: {
		type: mongoose.Schema.Types.ObjectId,
		require: true
	}
});

module.exports = mongoose.model('notification', notificationSchema);
