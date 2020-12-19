const mongoose = require('mongoose');

const materialFacilitiesSchema = mongoose.Schema({
	bathroom: {
		type: String,
		unum: ['khép kín', 'chia sẻ'],
		required: true
	},
	electricWaterHeater: {
		type: Boolean,
		required: true
	},
	kitchen: {
		type: String,
		unum: ['khép kín', 'chia sẻ', 'không'],
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
	bed: {
		type: Boolean,
		require: true
	},
	fridge: {
		type: Boolean,
		require: true
	},
	washingMachine: {
		type: Boolean,
		require: true
	},
	wardrobe: {
		type: Boolean,
		require: true
	},
	electricityPrice: {
		type: Number,
		required: true
	},
	domesticWaterPrice: {
		type: Number,
		required: true
	},
	other: [{}]
});

module.exports = mongoose.model('facilities', materialFacilitiesSchema);
