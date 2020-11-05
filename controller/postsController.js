const AccommodationPost = require('../models/AccommodationPosterModel');
const MaterialFacilities = require('../models/MaterialFacilitiesModel');
const Rating = require('../models/RatingModel');

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

module.exports.generatePostAccommodation = async (req, res, next) => {
	const { materialFacilitiesInfo, accommodationInfo } = req.body;
	const materialFacilities = new MaterialFacilities(materialFacilitiesInfo);
	const rating = new Rating();
	const post = new AccommodationPost({
		...accommodationInfo,
		ownerId: rating._id,
		rating: rating._id,
		materialFacilities: materialFacilities._id
	});
	const listSaving = [ post, rating, materialFacilities ];
	Promise.all(listSaving.map((doc) => doc.save()))
		.then((result) => {
			res.status(200).json({
				message: 'success',
				request: {
					type: 'GET',
					description: 'GET all posts',
					url: 'http://localhost:3001/accommodationPost/' + post._id
				}
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json({ message: err.message });
		});
};

module.exports.getPostById = async (req, res, next) => {
	const id = req.params.accommodationPostId;
	try {
		let reqPost = await AccommodationPost.findById(id);
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
		let accommodationPost = await AccommodationPost.findById(id);
		let ratingId = accommodationPost.rating._id;
		let materialFacilitiesId = accommodationPost.materialFacilities._id;
		Promise.all([
			AccommodationPost.deleteOne({ _id: id }),
			Rating.deleteOne({ _id: ratingId }),
			MaterialFacilities.deleteOne({ _id: materialFacilitiesId })
		])
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

module.exports.updatePostById = async (req, res, next) => {
	const postId = '5fa41b60ccf298466cac36eb';
	const postUpdateData = {
		city: 'HCM city'
	};
	const materialFacilitiesId = '5fa41b60ccf298466cac36e9';
	const facilityUpdateData = {
		electricWaterHeater: false
	};
	Promise.all([
		AccommodationPost.findByIdAndUpdate({ _id: postId }, postUpdateData).exec(),
		MaterialFacilities.findOneAndUpdate({ _id: materialFacilitiesId }, facilityUpdateData).exec()
	])
		.then((result) => {
			let response = {
				request: {
					type: 'GET',
					description: 'GET post',
					url: 'http://localhost:3001/accommodationPost/' + postId
				}
			};
			res.status(200).json(response);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
};
