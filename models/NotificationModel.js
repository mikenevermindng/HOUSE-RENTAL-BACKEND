const mongoose = require('mongoose');
const { POST_NOTIFICATION_CODE } = require('../Constants/NotificationDemandCode');
const AccommodationPoster = require('./AccommodationPosterModel');

const notificationSchema = mongoose.Schema({
	senderName: {
		type: String,
		require: true
	},
	content: {
		type: String,
		require: true
	},
	senderId: {
		type: mongoose.Schema.Types.ObjectId,
		require: true
	},
	isSentToAdmin: {
		type: Boolean,
		require: true
	},
	recieverIds: {
		type: mongoose.Schema.Types.ObjectId
	},
	payload: {
		type: {},
		default: {}
	},
	code: {
		type: String,
		enum: [
			POST_NOTIFICATION_CODE.ACCEPTED_POSTER,
			POST_NOTIFICATION_CODE.APPROVAL_REQUEST,
			POST_NOTIFICATION_CODE.CHANGE_REQUEST
		],
		require: true
	},
	postedDate: {
		type: Date,
		default: Date.now()
	}
});

notificationSchema.statics.approvalNotificationGenerator = async function(senderId, senderName) {
	return new this({
		senderName: senderName,
		content: ' yêu cầu đăng poster cho thuê nhà',
		senderId: senderId,
		isSentToAdmin: true,
		recieverIds: null,
		code: POST_NOTIFICATION_CODE.APPROVAL_REQUEST
	});
};

notificationSchema.statics.changeRequestGenerator = async function(postId, payload, senderInfo) {
	return new this({
		senderName: senderInfo.senderName,
		content: ' yêu cầu thay đổi thông tin cho thuê nhà',
		senderId: senderInfo.senderId,
		isSentToAdmin: true,
		payload: { ...payload, postId: postId },
		code: POST_NOTIFICATION_CODE.CHANGE_REQUEST
	}).save();
};

module.exports = mongoose.model('notification', notificationSchema);
