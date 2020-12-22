const route = require('express').Router();
const controller = require('../controller/postsController');
var path = require('path');
const recordingMiddleware = require('../middleware/searchingRequestRecorder')

const { verifyToken, isOwner, isAdmin, isUser } = require('../middleware/authenticationVerification')

const multer = require('multer');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname);
	}
});

const upload = multer({ storage: storage });
route.get('/', recordingMiddleware.saveRequest, controller.index);

route.get('/getWithFilterOptions/', verifyToken, isOwner, controller.getPosterByOwnerId);

route.post('/userGetPoster', controller.getPosterForuser)

route.get('/:accommodationPostId', controller.getPostById);

route.put('/:accommodationPostId', verifyToken, isOwner, controller.requestUpdatePostById);

route.patch('/:accommodationPostId', verifyToken, isAdmin, controller.approvedPoster)

route.patch('/updateStatus/:accommodationPostId', verifyToken, isOwner, controller.updateStatus)

route.post('/', verifyToken, isOwner, controller.generateAccommodationPoster);

route.delete('/:accommodationPostId', controller.deletePostById);

route.post('/imageUploader', upload.array('images', 12), (req, res) => {
	res.status(200).json({ files: req.files });
});

module.exports = route;
