const Notification = require('../models/NotificationModel');
const { RESPONSE_MESSAGE } = require('../Constants/MessageConstants');

module.exports.getNotificationToAdmin = async (req, res, next) => {
	try {
		const notifications = Notification.find({ isSentToAdmin: true }).sort([ [ 'postedDate', -1 ] ]);
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
		const { userId } = req.body;
		const notifications = Notification.find({ recieverIds: userId }).sort([ [ 'postedDate', -1 ] ]);
		res.status(200).json({
			data: notifications,
			message: RESPONSE_MESSAGE.SUCCESS
		});
	} catch (error) {
		res.status(400).json({ message: RESPONSE_MESSAGE.ERROR, detail: error });
	}
};
