const Rating = require('../models/RatingModel');
require('mongoose').mongo.ObjectID;

module.exports.likeHandler = async (req, res, next) => {
	const userId = req.userData._id;
	const ratingId = req.params.ratingId;
	try {
		const accessingRating = await Rating.findById(ratingId);
		const index = accessingRating.likedUser.findIndex((userIdInList) => userIdInList.userId.toString() === userId);
		if (index === -1) {
			accessingRating.likedUser.push({ userId: userId });
			const messageDetail = await accessingRating.save();
			res.status(200).json({ message: 'success', detail: messageDetail });
		} else {
			res.status(401).json({ message: 'user liked' });
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error });
	}
};

module.exports.unlikeHandler = async (req, res, next) => {
	const userId = req.userData._id;
	const ratingId = req.params.ratingId;
	try {
		const updateMessage = await Rating.findOneAndUpdate({ _id: ratingId }, { $pull: { likedUser: { userId: userId } } }).exec();
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
		console.log(error)
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
		console.log(error)
		res.status(400).json({ message: 'error' });
	}
};

module.exports.ratingHandler = async (req, res, next) => {
	const ratingId = req.params.ratingId;
	const { userId, stars, comment, username } = req.body;
	console.log(username)
	const rateInfo = {
		time: Date.now(),
		stars: stars,
		userId: userId,
		comment: comment,
		username: username
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
		console.log(error)
		res.status(400).json({ message: 'error' });
	}
};

module.exports.approvedRatingComment = async (req, res, next) => {
	try {
		const ratingId = req.params.ratingId;
		const { ratedTimeId } = req.body;
		const rating = await Rating.findById(ratingId)
		const comment = rating.ratedTime.find(time => time._id.equals(ratedTimeId))
		if (!comment) return res.status(404).json({ message: 'not found' });
		comment.isApproved = true
		const saved = await rating.save()
		res.status(200).json({ message: 'success', saved: saved });
	} catch (error) {
		console.log(error)
		res.status(400).json({ message: 'error' });
	}
}

module.exports.deleteRatingComment = async (req, res, next) => {
	try {
		const ratingId = req.params.ratingId;
		const { ratedTimeId } = req.body;
		const deleted = await Rating.findByIdAndUpdate(ratingId, {
			$pull: {
				ratedTime: { _id: ratedTimeId }
			}
		})
		res.status(200).json({ message: 'success', deleted: deleted });
	} catch (error) {
		console.log(error)
		res.status(400).json({ message: 'error' });
	}
}
