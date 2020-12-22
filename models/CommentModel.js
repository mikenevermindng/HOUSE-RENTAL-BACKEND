const mongoose = require('mongoose');
const Rating = require('./RatingModel')

const commentSchema = mongoose.Schema({
	postId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	ratingId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	time: {
		type: Date,
		default: Date.now()
	},
	stars: {
		type: Number,
		min: 0.5,
		max: 5,
		required: true
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	comment: {
		type: String,
	},
	isApproved: {
		type: Boolean,
		default: false
	}
});


module.exports = mongoose.model('comment', commentSchema);
