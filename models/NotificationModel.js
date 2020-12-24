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
	recieverId: {
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

notificationSchema.statics.approvalNotificationGenerator = async function (senderId, senderName) {
	return new this({
		senderName: senderName,
		content: ' yêu cầu đăng bài cho thuê nhà',
		senderId: senderId,
		isSentToAdmin: true,
		recieverIds: null,
		code: POST_NOTIFICATION_CODE.APPROVAL_REQUEST
	}).save();
};

notificationSchema.statics.answerRequestNotificationGenerator = async function (recieverId, postId, title, isApproved) {
	return new this({
		senderName: 'Admin',
		content: isApproved ? ' đã chấp thuận bài đăng ' + title + ' của bạn' : ' đã từ chối yêu cầu và xóa bài đăng ' + title + ' của bạn',
		recieverId: recieverId,
		isSentToAdmin: false,
		code: POST_NOTIFICATION_CODE.ACCEPTED_POSTER
	}).save();
};

module.exports = mongoose.model('notification', notificationSchema);
