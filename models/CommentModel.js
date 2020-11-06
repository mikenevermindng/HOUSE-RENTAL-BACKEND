const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
	postId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	content: {
		type: String,
		require: true
	},
	approved: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('comment', commentSchema);
