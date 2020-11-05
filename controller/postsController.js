const AccommodationPost = require('../models/AccommodationPosterModel');
const MaterialFacilities = require('../models/MaterialFacilitiesModel');
const Rating = require('../models/RatingModel');
const mongoose = require('mongoose');

module.exports.index = (req, res, next) => {
	const filterOption = req.body.filterOption;
	AccommodationPost.find(filterOption)
		.populate([ { path: 'rating', model: 'rating' }, { path: 'facilities', model: 'facilities' } ])
		.exec()
		.then((docs) => {
			const response = {
				count: docs.length,
				posts: docs
			};
			res.status(200).json(response);
		})
		.catch((err) => {
			res.status(500).json({
				error: err
			});
		});
};

module.exports.generatePostAccommodation = async (req, res, next) => {
	const { materialFacilitiesInfo, accommodationInfo } = req.body;
	const materialFacilities = new MaterialFacilities(materialFacilitiesInfo);
	const rating = new Rating({
		ratedTime: [ { time: Date.now(), stars: 4 }, { time: Date.now(), stars: 5 }, { time: Date.now(), stars: 5 } ]
	});
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
				message: 'success'
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(404).json({ message: err.message });
		});
};

module.exports.getPostById = (req, res, next) => {
	const id = req.params.accommodationPostId;
	AccommodationPost.findById(id)
		.exec()
		.then((doc) => {
			console.log('From database', doc);
			if (doc) {
				res.status(200).json({
					Post: doc,
					request: {
						type: 'GET',
						description: 'GET all products',
						url: 'http://localhost:3001/postAccommodation/'
					}
				});
			} else {
				res.status(404).json({ message: 'No valid entry found for provided ID' });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
};
