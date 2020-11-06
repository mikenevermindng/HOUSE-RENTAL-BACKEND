const Rating = require('../models/RatingModel');
require('mongoose').mongo.ObjectID;

module.exports.likeHandler = async (req, res, next) => {
	const userId = req.body.userId;
	const ratingId = req.params.ratingId;
	try {
		const updateMessage = await Rating.findOneAndUpdate({ _id: ratingId }, { $push: { likedUser: userId } }).exec();
		if (updateMessage) {
			const response = {
				message: 'success',
				detail: updateMessage
			};
			res.status(200).json(response);
		} else {
			res.status(400).json({ message: 'fail' });
		}
	} catch (error) {
		res.status(400).json({ message: 'error' });
	}
};

module.exports.unlikeHandler = async (req, res, next) => {
	const userId = req.body.userId;
	const ratingId = req.params.ratingId;
	try {
		const updateMessage = await Rating.findOneAndUpdate({ _id: ratingId }, { $pull: { likedUser: userId } }).exec();
		if (updateMessage) {
			const response = {
				message: 'success',
				detail: updateMessage
			};
			res.status(200).json(response);
		} else {
			res.status(400).json({ message: 'fail' });
		}
	} catch (error) {
		res.status(400).json({ message: 'error' });
	}
};

module.exports.visitHandler = async (req, res, next) => {
	const ratingId = req.params.ratingId;
	try {
		const updateMessage = await Rating.findOneAndUpdate(
			{ _id: ratingId },
			{ $push: { visits: Date.now() } }
		).exec();
		if (updateMessage) {
			const response = {
				message: 'success',
				detail: updateMessage
			};
			res.status(200).json(response);
		} else {
			res.status(400).json({ message: 'fail' });
		}
	} catch (error) {
		res.status(400).json({ message: 'error' });
	}
};

module.exports.ratingHandler = async (req, res, next) => {
	const ratingId = req.params.ratingId;
	const { userId, stars } = req.body;
	const message = {};
	const rateInfo = {
		time: Date.now(),
		stars: stars,
		userId: userId
	};
	try {
		const accessingRating = await Rating.findById(ratingId);
		const index = accessingRating.ratedTime.findIndex((time) => time.userId.toString() === userId);
		if (index !== -1) {
			accessingRating.ratedTime[index] = rateInfo;
		} else {
			accessingRating.ratedTime.push(rateInfo);
		}
		const message = await accessingRating.save();
		res.status(200).json({ message: message });
		return;
	} catch (error) {
		res.status(400).json({ message: 'error' });
	}
};
