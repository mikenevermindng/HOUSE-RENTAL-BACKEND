const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
	postId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	senderId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	content: {
		type: String,
		require: true
	},
	isApproved: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('comment', commentSchema);
