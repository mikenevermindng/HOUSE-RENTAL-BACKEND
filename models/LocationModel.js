const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
	country: String,
	cities: [ { city: String, cityId: Number } ],
	districts: [ { cityId: Number, district: String, districtId: Number } ],
	subDistricts: [ { districtId: Number, subDistrict: String, subDistrictId: Number } ]
});

module.exports = mongoose.model('locations', locationSchema);
