const mongoose = require('mongoose');

const materialFacilitiesSchema = mongoose.Schema({
	bathroom: {
		type: String,
		unum: [ 'closed', 'shared' ],
		required: true
	},
	electricWaterHeater: {
		type: Boolean,
		required: true
	},
	kitchen: {
		type: String,
		unum: [ 'closed', 'shared', 'none' ],
		required: true
	},
	airConditioner: {
		type: Boolean,
		required: true
	},
	balcony: {
		type: Boolean,
		required: true
	},
	electricityPrice: {
		type: Number,
		required: true
	},
	domesticWaterPrice: {
		type: Number,
		required: true
	},
	other: [ {} ]
});

module.exports = mongoose.model('facilities', materialFacilitiesSchema);
