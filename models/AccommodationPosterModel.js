const mongoose = require('mongoose');

const postAccommodationSchema = mongoose.Schema({
	ownerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'owner',
		required: true
	},
	city: {
		type: String,
		required: true
	},
	district: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	searchingKeyWord: [ String ],
	typeOfAccommodation: {
		type: String,
		enum: [ 'phòng trọ', 'chung cư mini', 'nhà nguyên căn', 'chung cư nguyên căn' ],
		required: true
	},
	numberOfRoom: {
		type: Number,
		required: true
	},
	pricePerTimber: {
		type: [
			{
				timber: {
					type: String,
					require: true
				},
				price: {
					type: Number,
					require: true
				}
			}
		],
		required: function() {
			return this.pricePerTimber.length >= 1;
		}
	},
	area: {
		type: Number,
		required: true
	},
	materialFacilities: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'facilities',
		required: true
	},
	images: {
		type: [ String ],
		required: function() {
			return this.images.length >= 3;
		}
	},
	postedDate: {
		type: Date,
		default: Date.now()
	},
	status: {
		type: String,
		enum: [ 'rented', 'available' ],
		default: 'available'
	},
	rating: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'rating',
		required: true
	},
	isApproved: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('post_accommodation', postAccommodationSchema);
