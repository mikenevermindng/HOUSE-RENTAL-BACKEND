const Notification = require('../models/NotificationModel');
const { RESPONSE_MESSAGE } = require('../Constants/MessageConstants');

module.exports.getNotificationToAdmin = async (req, res, next) => {
	try {
		const notifications = await Notification.find({ isSentToAdmin: true }).sort([['postedDate', -1]]);
		console.log(notifications)
		res.status(200).json({
			data: notifications,
			message: RESPONSE_MESSAGE.SUCCESS
		});
	} catch (error) {
		res.status(400).json({ message: RESPONSE_MESSAGE.ERROR, detail: error });
	}
};

module.exports.getNotificationToOwner = async (req, res, next) => {
	try {
		const { _id } = req.userData;
		const notifications = await Notification.find({ recieverId: _id }).sort([['postedDate', -1]]);
		res.status(200).json({
			data: notifications,
			message: RESPONSE_MESSAGE.SUCCESS
		});
	} catch (error) {
		res.status(400).json({ message: RESPONSE_MESSAGE.ERROR, detail: error });
	}
};
