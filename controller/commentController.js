const Comment = require('../models/CommentModel');

module.exports.getAllComments = async (req, res, next) => {
	try {
		const { filterOption } = req.body
		const comments = await Comment.find({ ...filterOption });
		res.status(200).json({ count: comments.length, comment: comments });
	} catch (err) {
		res.status(400).json({ message: 'error' });
	}
}

module.exports.getComment = async (req, res, next) => {
	try {
		const commentId = req.params.commentId;
		const comment = await Comment.findById(commentId);
		res.status(200).json({ comment: comment });
	} catch (err) {
		res.status(400).json({ message: 'error' });
	}
};

module.exports.getPosterCommnet = async (req, res, next) => {
	try {
		const { posterId } = req.params
		const comments = await Comment.find({ postId: posterId, isApproved: true })
		res.status(200).json({ count: comments.length, comments: comments })
	} catch (err) {
		console.log(err)
		res.status(400).json({ message: 'error' });
	}
}

module.exports.getRatingComment = async (req, res, next) => {
	try {
		const { ratingId } = req.params
		const comments = await Comment.find({ ratingId: ratingId })
		res.status(200).json({ count: comments.length, comments: comments })
	} catch (err) {
		console.log(err)
		res.status(400).json({ message: 'error' });
	}
}

module.exports.generateComment = async (req, res, next) => {
	try {
		const { ratingId, userId, comment, stars } = req.body
		const trackingComment = await Comment.findOne({ ratingId, userId })
		if (!trackingComment) {
			const newComment = new Comment({
				...req.body
			});
			await newComment.save();
			return res.status(200).json({ comment: newComment, message: 'set new comment' })
		} else {
			trackingComment.comment = comment
			trackingComment.stars = stars
			trackingComment.isApproved = false
			const saved = await trackingComment.save()
			return res.status(200).json({ updated: saved, message: 'update comment' })
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: 'error', detail: error });
	}
};

module.exports.approvedComment = async (req, res, next) => {
	try {
		const commentId = req.params.commentId;
		const comment = await Comment.findOne({ _id: commentId });
		comment.isApproved = true
		const saved = await comment.save()
		const response = {
			message: 'success',
			saved: saved
		};
		res.status(200).json(response);
	} catch (error) {
		res.status(400).json({ message: 'error', detail: error });
	}
};

module.exports.deleteComment = async (req, res, next) => {
	try {
		const commentId = req.params.commentId;
		const status = await Comment.deleteOne({ _id: commentId });
		const response = {
			request: 'GET',
			description: 'GET post',
			url: 'http://localhost:3001/comment/' + commentId
		};
		res.status(200).json(response);
	} catch (error) {
		res.status(400).json({ message: 'error', detail: error });
	}
};
