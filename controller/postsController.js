const AccommodationPost = require('../models/AccommodationPosterModel');
const MaterialFacilities = require('../models/MaterialFacilitiesModel');
const Rating = require('../models/RatingModel');
const Notification = require('../models/NotificationModel');
const { RESPONSE_MESSAGE } = require('../Constants/MessageConstants');

module.exports.index = async (req, res, next) => {
	const filterOption = req.body.filterOption;
	try {
		const accommodationPosts = await AccommodationPost.find(filterOption).populate('rating materialFacilities');
		const response = {
			count: accommodationPosts.length,
			posts: accommodationPosts
		};
		res.status(200).json(response);
		return;
	} catch (error) {
		console.log(error);
		res.status(404).json({
			error: error
		});
		return;
	}
};

module.exports.generateAccommodationPoster = async (req, res, next) => {
	try {
		console.log(req.body);
		const generateMessage = AccommodationPost.generateAccommodationPoster(req.body);
		const response = {
			message: 'success',
			request: {
				type: 'GET',
				description: 'GET all posts',
				url: 'http://localhost:3001/accommodationPost/'
			},
			detail: generateMessage
		};
		res.status(200).json(response);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

module.exports.getPostById = async (req, res, next) => {
	const id = req.params.accommodationPostId;
	try {
		let reqPost = await AccommodationPost.findById(id).populate('rating materialFacilities');
		let response = {
			post: reqPost,
			request: {
				type: 'GET',
				description: 'GET all posts',
				url: 'http://localhost:3001/accommodationPost/'
			}
		};
		res.status(200).json(response);
	} catch (err) {
		res.status(404).json({ message: 'No valid entry found for provided ID' });
	}
};

module.exports.deletePostById = async (req, res, next) => {
	const id = req.params.accommodationPostId;
	try {
		AccommodationPost.deletePostById(id)
			.then((resutlt) => {
				res.status(200).json(resutlt);
			})
			.catch((error) => {
				console.log(error);
				res.status(400).json({ message: 'fail' });
			});
	} catch (err) {
		res.status(400).json({ message: 'error' });
	}
};

module.exports.requestUpdatePostById = async (req, res, next) => {
	const postId = req.params.accommodationPostId;
	const { payload, senderInfo } = req.body;
	const poster = await AccommodationPost.findById(postId);
	if (poster.ownerId.toString() === senderInfo.senderId) {
		try {
			let answer = await Notification.changeRequestGenerator(postId, payload, senderInfo);
			let response = {
				request: {
					type: 'GET',
					description: 'GET post',
					url: 'http://localhost:3001/accommodationPost/' + postId
				}
			};
			res.status(200).json(response);
		} catch (error) {
			console.log(error);
			res.status(400).json(error);
		}
	} else {
		res.status(400).json({ message: RESPONSE_MESSAGE.ERROR });
	}
};
