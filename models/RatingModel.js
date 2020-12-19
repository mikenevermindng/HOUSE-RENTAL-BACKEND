const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
	postId: mongoose.Schema.Types.ObjectId,
	rate: {
		type: Number,
		max: 5,
		default: 0
	},
	ratedTime: [
		{
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
		}
	],
	likedUser: [mongoose.Schema.Types.ObjectId],
	visits: [Date]
});

ratingSchema.pre('save', function (next) {
	this.rate = this.ratedTime.filter(rate => rate.isApproved).reduce((total, time) => {
		return total + time.stars / this.ratedTime.length;
	}, 0);
	next();
});

ratingSchema.pre('post', function (next) {
	this.rate = this.ratedTime.reduce((total, time) => {
		return total + time.stars / this.ratedTime.length;
	}, 0);
	next();
});

module.exports = mongoose.model('rating', ratingSchema);
