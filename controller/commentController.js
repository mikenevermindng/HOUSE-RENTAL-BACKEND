const Comment = require('../models/CommentModel');

module.exports.getComment = async (req, res, next) => {
	try {
		const commentId = req.params.commentId;
		const comment = await Comment.findById(commentId);
		res.status(200).json({ comment: comment });
	} catch (err) {
		res.status(400).json({ message: 'error' });
	}
};

module.exports.generateComment = async (req, res, next) => {
	try {
		const newComment = new Comment({
			...req.body
		});
		await newComment.save();
		const response = {
			request: 'GET',
			description: 'GET post',
			url: 'http://localhost:3001/comment/' + newComment._id
		};
		res.status(200).json(response);
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: 'error', detail: error });
	}
};

module.exports.approvedComment = async (req, res, next) => {
	try {
		const commentId = req.params.commentId;
		const comment = await Comment.findById(commentId);
		comment.isApproved = true;
		await comment.save();
		const response = {
			request: 'GET',
			description: 'GET post',
			url: 'http://localhost:3001/comment/' + comment._id
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
