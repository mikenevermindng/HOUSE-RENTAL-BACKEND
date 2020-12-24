const AccommodationPost = require('../models/AccommodationPosterModel');
const MaterialFacilities = require('../models/MaterialFacilitiesModel');
const Rating = require('../models/RatingModel');
const Notification = require('../models/NotificationModel');
const { RESPONSE_MESSAGE } = require('../Constants/MessageConstants');
const Owner = require('../models/OwnerModel')
const mongoose = require('mongoose')

module.exports.index = async (req, res, next) => {
	const { filterOption } = req.body;
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

module.exports.getPosterForuser = async (req, res, next) => {
	try {
		const { filterData, page, perPage } = req.body
		const { city, district, subDistrict, typeOfAccommodation, minArea, maxArea, minPrice, maxPrice } = filterData
		const filterOption = Object.entries({
			city, district, subDistrict, typeOfAccommodation
		}).reduce((a, [k, v]) => (v == null ? a : (a[k] = v, a)), {})
		const accommodationPosts = await AccommodationPost.find({ isApproved: true, status: 'available', ...filterOption }).populate('rating materialFacilities').skip(page * perPage).limit(perPage);
		const filterAccommodationPoster = accommodationPosts.filter(accommod => {
			let filterMinPrice = true
			let filterMaxPrice = true
			let filterMinArea = true
			let filterMaxArea = true
			if (minPrice) {
				filterMinPrice = accommod.pricePerMonth > minPrice
			}
			if (maxPrice) {
				filterMaxPrice = accommod.pricePerMonth < maxPrice
			}
			if (minArea) {
				filterMinArea = accommod.area > minArea
			}
			if (maxArea) {
				filterMaxArea = accommod.area < maxArea
			}
			return filterMinPrice && filterMaxPrice && filterMinArea && filterMaxArea
		})

		const response = {
			count: filterAccommodationPoster.length,
			posts: filterAccommodationPoster
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
}

module.exports.getPosterByOwnerId = async (req, res, next) => {
	const { _id } = req.userData
	const ownerId = _id
	try {
		const accommodationPosts = await AccommodationPost.find({ ownerId }).populate('rating materialFacilities');
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
}

module.exports.getFavoritesPoster = async (req, res, next) => {
	const { _id } = req.userData
	console.log(_id)
	try {
		const posts = await AccommodationPost.find({}).populate('rating materialFacilities')
		const filtedPoster = posts.filter(post => {
			const { rating } = post
			const { likedUser } = rating
			// console.log(likedUser)
			return likedUser.findIndex(user => user.userId.equals(_id)) !== -1
		})
		res.status(200).json({ message: 'success', posts: filtedPoster })
	} catch (error) {
		console.log(error)
		res.status(400).json({ message: 'fail', posts: [] })
	}

}

module.exports.generateAccommodationPoster = async (req, res, next) => {
	try {
		const { _id, firstName, lastName, role } = req.userData
		const generateMessage = AccommodationPost.generateAccommodationPoster(req.body, _id, firstName, lastName, role);
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
		const updateMessage = await Rating.findOneAndUpdate(
			{ _id: reqPost.rating._id },
			{ $push: { visits: Date.now() } }
		);
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
		console.log(err)
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
	const ownerId = req.userData._id
	const { posterChangeInfomation, materialFacilitiesChangeInfomation } = req.body;
	const poster = await AccommodationPost.findById(postId);
	if (poster.ownerId.toString() !== ownerId) {
		return res.status(400).json({ message: 'you are not the owner of this poster' });
	}
	if (!poster.isApproved) {
		try {
			const posterUpdated = await AccommodationPost.findOneAndUpdate(
				{ _id: req.params.accommodationPostId },
				{ ...posterChangeInfomation }
			);
			const facilityUpdated = await MaterialFacilities.findOneAndUpdate(
				{ _id: poster.materialFacilities },
				{ ...materialFacilitiesChangeInfomation }
			);
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
			res.status(400).json({ message: 'fail to update' });
		}
	} else {
		res.status(400).json({ message: 'this poster is already approved' });
	}
};

module.exports.updateAvailableDate = async (req, res, next) => {
	const { _id } = req.userData
	const { posterId } = req.params
	console.log(_id, posterId)
	console.log(req.body)
	try {
		const post = await AccommodationPost.findOne({ _id: posterId, ownerId: _id })
		post.availableDate = req.body
		post.isApproved = false
		const { ownerId } = post
		const owner = await Owner.findById(ownerId)
		const newNotification = await Notification.approvalNotificationGenerator(ownerId, owner.firstName + owner.lastName)
		const saved = await post.save()
		res.status(200).json({
			message: 'success',
			updated: "updated"
		})
	} catch (error) {
		console.log(error)
		res.status(400).json({
			message: 'fail',
		})
	}
}

module.exports.approvedPoster = async (req, res, next) => {
	try {
		const { accommodationPostId } = req.params
		const poster = await AccommodationPost.findOne({ _id: accommodationPostId });
		poster.isApproved = true
		const saved = await poster.save()
		console.log(saved)
		Notification.answerRequestNotificationGenerator(poster.ownerId, poster._id, true);
		res.status(200).json({ message: "approved" })
	} catch (error) {
		console.log(error)
		res.status(400).json({ message: "fail to approve" })
	}
}

module.exports.updateStatus = async (req, res, next) => {
	try {
		const { accommodationPostId } = req.params
		const updated = await AccommodationPost.findOneAndUpdate(
			{ _id: accommodationPostId },
			{ status: req.body.status }
		);
		res.status(200).json({ message: "approved" })
	} catch (error) {
		console.log(error)
		res.status(400).json({ message: "fail to approve" })
	}
}
