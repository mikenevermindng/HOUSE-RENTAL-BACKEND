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

commentSchema.pre('save', async function (next) {
	const Comment = mongoose.model('comment', commentSchema);
	const comments = await Comment.find({ ratingId: this.ratingId, isApproved: true })
	let rate = comments.reduce((total, time) => {
		return total + time.stars / comments.length;
	}, 0)
	const updated = await Rating.findOneAndUpdate({ _id: this.ratingId }, { rate: rate })
	next();
});

commentSchema.pre('post', async function (next) {
	const Comment = mongoose.model('comment', commentSchema);
	const comments = await Comment.find({ ratingId: this.ratingId, isApproved: true })
	let rate = comments.reduce((total, time) => {
		return total + time.stars / (comments.length);
	}, 0)
	const updated = await Rating.findOneAndUpdate({ _id: this.ratingId }, { rate: rate })
	next();
});


module.exports = mongoose.model('comment', commentSchema);
