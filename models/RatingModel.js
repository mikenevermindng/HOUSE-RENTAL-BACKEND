const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
	postId: mongoose.Schema.Types.ObjectId,
	rate: {
		type: Number,
		max: 5,
		default: 0
	},
	likedUser: [{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		time: {
			type: Date,
			default: Date.now()
		}
	}],
	visits: [Date]
});

module.exports = mongoose.model('rating', ratingSchema);
