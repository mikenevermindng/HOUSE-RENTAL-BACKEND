const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
	postId: mongoose.Schema.Types.ObjectId,
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
