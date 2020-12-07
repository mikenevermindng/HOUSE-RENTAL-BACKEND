const route = require('express').Router();
const Location = require('../models/LocationModel');

route.get('/', async (req, res, next) => {
	try {
		const locations = await Location.findOne();
		res.status(200).json({ locations });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: 'fail to get locations' });
	}
});

route.post('/', async (req, res, next) => {
	try {
		const newLocation = new Location({
			country: 'France',
			cities: [ { city: 'Paris', cityId: 1 } ],
			districts: [ { cityId: 1, district: 'Wall', districtId: 1 } ],
			subDistricts: [ { districtId: 1, subDistrict: 'String' } ]
		});
		const save = await newLocation.save();
		console.log(save);
		res.status(200).json({ message: 'success' });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: 'fail' });
	}
});

module.exports = route;
