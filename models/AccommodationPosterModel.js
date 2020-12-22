const mongoose = require('mongoose');
const MaterialFacilities = require('./MaterialFacilitiesModel');
const Rating = require('./RatingModel');
const Notification = require('./NotificationModel');

const postAccommodationSchema = mongoose.Schema({
	ownerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'owner',
		required: true
	},
	title: {
		type: String,
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
	subDistrict: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	searchingKeyWord: [String],
	typeOfAccommodation: {
		type: String,
		enum: ['phòng trọ', 'chung cư mini', 'nhà nguyên căn', 'chung cư nguyên căn'],
		required: true
	},
	numberOfRoom: {
		type: Number,
		required: true
	},
	pricePerMonth: {
		type: Number,
		required: true
	},
	pricePerQuarter: {
		type: Number,
	},
	pricePerYear: {
		type: Number,
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
		type: [String],
		required: function () {
			return this.images.length >= 3;
		}
	},
	postedDate: {
		type: Date,
		default: Date.now()
	},
	status: {
		type: String,
		enum: ['rented', 'available'],
		default: 'available'
	},
	rating: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'rating',
		required: true
	},
	description: {
		type: String,
	},
	availableDate: {
		type: Array,
		require: true
	},
	isApproved: {
		type: Boolean,
		default: false
	}
});

postAccommodationSchema.statics.generateAccommodationPoster = async function (info, ownerId, firstName, lastNam) {
	const { materialFacilitiesInfo, accommodationInfo } = info;
	const materialFacilities = new MaterialFacilities(materialFacilitiesInfo);
	const rating = new Rating();
	const post = new this({
		...accommodationInfo,
		ownerId: ownerId,
		rating: rating._id,
		materialFacilities: materialFacilities._id
	});
	const notification = await Notification.approvalNotificationGenerator(ownerId, firstName + lastNam);
	const listSaving = [rating, materialFacilities, notification, post];
	return Promise.all(listSaving.map((doc) => doc.save()));
};

postAccommodationSchema.statics.updatePostById = async function (payload) {
	const { postUpdateData, facilityUpdateData, postId } = payload;
	const materialFacilitiesId = await this.findById(postId).materialFacilities;
	return Promise.all([
		this.findByIdAndUpdate({ _id: postId }, postUpdateData).exec(),
		MaterialFacilities.findOneAndUpdate({ _id: materialFacilitiesId }, facilityUpdateData).exec()
	]);
};

postAccommodationSchema.statics.deletePostById = async function (id) {
	let accommodationPost = await this.findById(id);
	let ratingId = accommodationPost.rating._id;
	let materialFacilitiesId = accommodationPost.materialFacilities._id;
	return Promise.all([
		this.deleteOne({ _id: id }),
		Rating.deleteOne({ _id: ratingId }),
		MaterialFacilities.deleteOne({ _id: materialFacilitiesId })
	]);
};

module.exports = mongoose.model('accommodation_post', postAccommodationSchema);
