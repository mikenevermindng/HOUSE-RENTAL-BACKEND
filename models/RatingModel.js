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
			time: Date,
			stars: {
				type: Number,
				min: 1,
				max: 5
			}
		}
	],
	likes: {
		type: Number,
		default: 0
	},
	visits: {
		type: [ Date ]
	}
});

ratingSchema.pre('save', function(next) {
	let rating = this;
	console.log(rating);
	rating.rate = rating.ratedTime.reduce((time) => {
		return time.stars / (this.ratedTime.length === 0 ? 1 : this.ratedTime.length);
	}, 0);
	next();
});

ratingSchema.pre('post', function(next) {
	let rating = this;
	console.log(rating);
	rating.rate = rating.ratedTime.reduce((time) => {
		return time.stars / (this.ratedTime.length === 0 ? 1 : this.ratedTime.length);
	}, 0);
	next();
});

module.exports = mongoose.model('rating', ratingSchema);
